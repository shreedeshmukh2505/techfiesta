# testing/algorithms/agadr.py
import os
import random
import numpy as np
from typing import List, Dict, Tuple
import json

class AGADRScheduler:
    def __init__(self, population_size: int = 50, generations: int = 100):
        self.population_size = population_size
        self.generations = generations
        self.mutation_rate = 0.1
        self.crossover_rate = 0.8
        self.elite_size = 2
        
        # Time slots and days
        self.time_slots = list(range(8))  # 8 periods per day
        self.days = list(range(5))        # 5 days per week
        
        # Load data
        self.load_data()

    def load_data(self):
        try:
        # Change paths to be relative to testing directory
            with open('./data/teachers.json', 'r') as f:
                data = json.load(f)
                self.teachers = data['teachers']
                print("Loaded teachers:", len(self.teachers))
        
            with open('./data/classrooms.json', 'r') as f:
                data = json.load(f)
                self.classrooms = data['classrooms']
                print("Loaded classrooms:", len(self.classrooms))
            
            with open('./data/courses.json', 'r') as f:
                data = json.load(f)
                self.courses = data['courses']
                print("Loaded courses:", len(self.courses))
            
        except FileNotFoundError as e:
            print(f"Error loading data files: {e}")
            print("Current working directory:", os.getcwd())
            self.teachers = []
            self.classrooms = []
            self.courses = []

    def create_chromosome(self) -> List[Dict]:
        """Create a single chromosome (complete timetable solution)"""
        chromosome = []
    
    # Make a deep copy of courses to avoid modifying original
        unassigned_courses = self.courses.copy()
    
        if not unassigned_courses:
            print("No courses available")
            return chromosome
        
        for course in unassigned_courses:
        # Get number of sessions needed for this course
            sessions_needed = course.get('sessions_per_week', 1)
        
            for _ in range(sessions_needed):
            # Try different time slots and days until a valid slot is found
                for day in random.sample(self.days, len(self.days)):
                    for slot in random.sample(self.time_slots, len(self.time_slots)):
                    # Get available teachers for this course
                        available_teachers = [t for t in self.teachers 
                                           if course['subject'] in t['subjects'] and 
                                           t['availability'][str(day)][slot]]

                    # Get suitable classrooms
                        suitable_rooms = [c for c in self.classrooms 
                                        if c['capacity'] >= course['students'] and
                                        c['availability'][str(day)][slot]]
                    
                    # If we have both teacher and room available
                        if available_teachers and suitable_rooms:
                            teacher = random.choice(available_teachers)
                            classroom = random.choice(suitable_rooms)
                        
                            gene = {
                                'day': day,
                                'time_slot': slot,
                                'course': course,
                                'teacher': teacher,
                                'classroom': classroom
                            }
                            chromosome.append(gene)
                        # Move to next course session
                            break
                    if len(chromosome) > 0 and chromosome[-1]['course'] == course:
                        # Successfully added this session
                        break
                    
        return chromosome

    def initialize_population(self) -> List[List[Dict]]:
        """Create initial population of chromosomes"""
        return [self.create_chromosome() for _ in range(self.population_size)]

    def fitness(self, chromosome: List[Dict]) -> float:
        """Calculate fitness score for a chromosome"""
        score = 0
        conflicts = 0
        
        # Check for various constraints
        for i, gene1 in enumerate(chromosome):
            for j, gene2 in enumerate(chromosome[i+1:], i+1):
                # Teacher collision
                if (gene1['day'] == gene2['day'] and 
                    gene1['time_slot'] == gene2['time_slot']):
                    if gene1['teacher'] == gene2['teacher']:
                        conflicts += 1
                    if gene1['classroom'] == gene2['classroom']:
                        conflicts += 1
                        
                # Teacher consecutive classes
                if (gene1['day'] == gene2['day'] and 
                    abs(gene1['time_slot'] - gene2['time_slot']) == 1 and
                    gene1['teacher'] == gene2['teacher']):
                    conflicts += 0.5
        
        # Calculate final fitness score
        score = 1 / (1 + conflicts)
        return score

    def select_parents(self, population: List[List[Dict]], fitness_scores: List[float]) -> Tuple[List[Dict], List[Dict]]:
        """Select parents using tournament selection"""
        tournament_size = 3
        parent1 = max(random.sample(list(zip(population, fitness_scores)), tournament_size), 
                     key=lambda x: x[1])[0]
        parent2 = max(random.sample(list(zip(population, fitness_scores)), tournament_size), 
                     key=lambda x: x[1])[0]
        return parent1, parent2

    def crossover(self, parent1: List[Dict], parent2: List[Dict]) -> Tuple[List[Dict], List[Dict]]:
        """Perform crossover between parents using adaptive crossover point"""
        if random.random() > self.crossover_rate or not parent1 or not parent2:
            return parent1, parent2
        
    # Add safety check
        if len(parent1) == 0 or len(parent2) == 0:
            return parent1, parent2

    # Find adaptive crossover point based on fitness contribution
        fitness_contributions = []
        for i in range(max(1, len(parent1))):
            temp_child = parent1[:i] + parent2[i:]
            fitness_contributions.append(self.fitness(temp_child))
        
    # Add safety check for empty fitness_contributions
        if not fitness_contributions:
            return parent1, parent2
        
        crossover_point = fitness_contributions.index(max(fitness_contributions))
    
        child1 = parent1[:crossover_point] + parent2[crossover_point:]
        child2 = parent2[:crossover_point] + parent1[crossover_point:]
    
        return child1, child2

    def mutate(self, chromosome: List[Dict]) -> List[Dict]:
        """Perform mutation on chromosome"""
        if random.random() > self.mutation_rate or not chromosome:
            return chromosome
        
        mutated = chromosome.copy()
    # Safety check for empty chromosome
        if not mutated:
            return mutated
        
        gene_idx = random.randrange(len(mutated))
    
    # Randomly choose mutation type
        mutation_type = random.choice(['swap_time', 'swap_teacher', 'swap_room'])
    
        try:
            if mutation_type == 'swap_time':
                new_day = random.choice(self.days)
                new_slot = random.choice(self.time_slots)
                mutated[gene_idx]['day'] = new_day
                mutated[gene_idx]['time_slot'] = new_slot
            
            elif mutation_type == 'swap_teacher':
                course = mutated[gene_idx]['course']
                available_teachers = [t for t in self.teachers 
                                   if course['subject'] in t['subjects']]
                if available_teachers:
                    mutated[gene_idx]['teacher'] = random.choice(available_teachers)
                
            else:  # swap_room
                course = mutated[gene_idx]['course']
                available_rooms = [c for c in self.classrooms 
                                 if c['capacity'] >= course['students']]
                if available_rooms:
                    mutated[gene_idx]['classroom'] = random.choice(available_rooms)
                
        except (IndexError, KeyError) as e:
            print(f"Error in mutation: {e}")
            return chromosome
                
        return mutated

    def evolve(self) -> List[Dict]:
        """Main evolution process"""
        population = self.initialize_population()
        
        for generation in range(self.generations):
            # Calculate fitness for entire population
            fitness_scores = [self.fitness(chrom) for chrom in population]
            
            # Sort population by fitness
            population = [x for _, x in sorted(zip(fitness_scores, population), 
                                            key=lambda pair: pair[0], 
                                            reverse=True)]
            
            # Keep elite chromosomes
            new_population = population[:self.elite_size]
            
            # Generate new population
            while len(new_population) < self.population_size:
                parent1, parent2 = self.select_parents(population, fitness_scores)
                child1, child2 = self.crossover(parent1, parent2)
                
                child1 = self.mutate(child1)
                child2 = self.mutate(child2)
                
                new_population.extend([child1, child2])
            
            population = new_population[:self.population_size]
            
            # Print progress
            best_fitness = max(fitness_scores)
            print(f"Generation {generation}: Best Fitness = {best_fitness}")
            
            # Convergence check
            if best_fitness > 0.95:
                break
                
        return population[0]  # Return best solution

    def is_teacher_available(self, teacher: Dict, day: int, slot: int) -> bool:
        """Check if teacher is available at given time"""
        return teacher['availability'][day][slot]

    def generate_timetable(self) -> Dict:
        """Generate and format timetable for display"""
        solution = self.evolve()
        timetable = {day: {slot: None for slot in self.time_slots} 
                    for day in self.days}
        
        for gene in solution:
            day = gene['day']
            slot = gene['time_slot']
            timetable[day][slot] = {
                'course': gene['course']['name'],
                'teacher': gene['teacher']['name'],
                'room': gene['classroom']['room_number']
            }        
        return timetable
    def check_consecutive_classes(self, chromosome: List[Dict]) -> int:
        """Check for teachers having too many consecutive classes"""
        penalties = 0
        teachers_daily_slots = {}
    
    # Group slots by teacher and day
        for gene in chromosome:
            teacher_id = gene['teacher']['id']
            day = gene['day']
            key = (teacher_id, day)
            if key not in teachers_daily_slots:
                teachers_daily_slots[key] = []
            teachers_daily_slots[key].append(gene['time_slot'])
    
    # Check each teacher's daily schedule
        for slots in teachers_daily_slots.values():
            slots.sort()  # Sort time slots
            consecutive_count = 1
            for i in range(1, len(slots)):
                if slots[i] == slots[i-1] + 1:  # If slots are consecutive
                    consecutive_count += 1
                else:
                    if consecutive_count > 3:  # If more than 3 consecutive classes
                        penalties += consecutive_count - 3
                    consecutive_count = 1
        
        # Check final sequence
            if consecutive_count > 3:
                penalties += consecutive_count - 3
    
        return penalties