# testing/algorithms/fitness.py

from typing import List, Dict

class FitnessCalculator:
    def __init__(self):
        self.weights = {
            'teacher_conflict': 1.0,
            'room_conflict': 1.0,
            'consecutive_classes': 0.5,
            'capacity_violation': 0.8,
            'teacher_preference': 0.3
        }

    def calculate_fitness(self, chromosome: List[Dict]) -> float:
        """Calculate overall fitness score"""
        penalties = 0
        
        # Check hard constraints
        penalties += self.check_teacher_conflicts(chromosome) * self.weights['teacher_conflict']
        penalties += self.check_room_conflicts(chromosome) * self.weights['room_conflict']
        penalties += self.check_capacity_violations(chromosome) * self.weights['capacity_violation']
        
        # Check soft constraints
        penalties += self.check_consecutive_classes(chromosome) * self.weights['consecutive_classes']
        penalties += self.check_teacher_preferences(chromosome) * self.weights['teacher_preference']
        
        # Convert penalties to fitness score (0 to 1)
        fitness = 1 / (1 + penalties)
        return fitness

    def check_teacher_conflicts(self, chromosome: List[Dict]) -> int:
        """Check for teachers assigned to multiple classes at same time"""
        conflicts = 0
        for i, gene1 in enumerate(chromosome):
            for gene2 in chromosome[i+1:]:
                if (gene1['day'] == gene2['day'] and 
                    gene1['time_slot'] == gene2['time_slot'] and
                    gene1['teacher']['id'] == gene2['teacher']['id']):
                    conflicts += 1
        return conflicts

    def check_room_conflicts(self, chromosome: List[Dict]) -> int:
        """Check for multiple classes in same room at same time"""
        conflicts = 0
        for i, gene1 in enumerate(chromosome):
            for gene2 in chromosome[i+1:]:
                if (gene1['day'] == gene2['day'] and 
                    gene1['time_slot'] == gene2['time_slot'] and
                    gene1['classroom']['id'] == gene2['classroom']['id']):
                    conflicts += 1
        return conflicts

    def check_capacity_violations(self, chromosome: List[Dict]) -> int:
        """Check if room capacity is sufficient for class size"""
        violations = 0
        for gene in chromosome:
            if gene['course']['students'] > gene['classroom']['capacity']:
                violations += 1
        return violations

    def check_consecutive_classes(self, chromosome: List[Dict]) -> int:
        """Check for teachers having too many consecutive classes"""
        penalties = 0
        for i, gene1 in enumerate(chromosome):
            consecutive_count = 1
            for gene2 in chromosome[i+1:]:
                if (gene1['day'] == gene2['day'] and 
                    gene1['teacher']['id'] == gene2['teacher']['id'] and
                    abs(gene1['time_slot'] - gene2['time_slot']) == 1):
                    consecutive_count += 1
            if consecutive_count > 3:  # More than 3 consecutive classes
                penalties += consecutive_count - 3
        return penalties

    def check_teacher_preferences(self, chromosome: List[Dict]) -> int:
        """Check if teacher preferences are violated"""
        violations = 0
        for gene in chromosome:
            teacher = gene['teacher']
            if not teacher['availability'][gene['day']][gene['time_slot']]:
                violations += 1
        return violations
    
    
    # testing/algorithms/fitness.py

def check_consecutive_classes(self, chromosome: List[Dict]) -> int:
    """Check for teachers having too many consecutive classes"""
    penalties = 0
    # Sort by day and time slot
    sorted_chromosome = sorted(chromosome, 
                             key=lambda x: (x['day'], x['time_slot']))
    
    # Group by teacher and day
    teachers = {}
    for gene in sorted_chromosome:
        teacher_id = gene['teacher']['id']
        day = gene['day']
        if teacher_id not in teachers:
            teachers[teacher_id] = {}
        if day not in teachers[teacher_id]:
            teachers[teacher_id][day] = []
        teachers[teacher_id][day].append(gene['time_slot'])
    
    # Check consecutive slots for each teacher each day
    for teacher_days in teachers.values():
        for slots in teacher_days.values():
            consecutive = 1
            slots.sort()
            for i in range(1, len(slots)):
                if slots[i] - slots[i-1] == 1:
                    consecutive += 1
                else:
                    if consecutive > 3:
                        penalties += consecutive - 3
                    consecutive = 1
            # Check last sequence
            if consecutive > 3:
                penalties += consecutive - 3
                
    return penalties