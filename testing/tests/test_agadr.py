# testing/tests/test_agadr.py

import unittest
from algorithms.agadr import AGADRScheduler

class TestAGADRScheduler(unittest.TestCase):
    def setUp(self):
        self.scheduler = AGADRScheduler()

    def test_chromosome_creation(self):
        """Test if chromosome creation produces valid structure"""
        chromosome = self.scheduler.create_chromosome()
        self.assertIsInstance(chromosome, list)
        if chromosome:  # if not empty
            self.assertIsInstance(chromosome[0], dict)
            self.assertIn('day', chromosome[0])
            self.assertIn('time_slot', chromosome[0])
            self.assertIn('course', chromosome[0])
            self.assertIn('teacher', chromosome[0])
            self.assertIn('classroom', chromosome[0])

    def test_population_initialization(self):
        """Test if population initialization creates correct number of chromosomes"""
        population = self.scheduler.initialize_population()
        self.assertEqual(len(population), self.scheduler.population_size)

    def test_fitness_calculation(self):
        """Test if fitness calculation returns valid score"""
        chromosome = self.scheduler.create_chromosome()
        fitness = self.scheduler.fitness(chromosome)
        self.assertGreaterEqual(fitness, 0)
        self.assertLessEqual(fitness, 1)

    def test_crossover(self):
        """Test if crossover produces valid offspring"""
        parent1 = self.scheduler.create_chromosome()
        parent2 = self.scheduler.create_chromosome()
        child1, child2 = self.scheduler.crossover(parent1, parent2)
        self.assertIsInstance(child1, list)
        self.assertIsInstance(child2, list)

    def test_mutation(self):
        """Test if mutation produces valid chromosome"""
        chromosome = self.scheduler.create_chromosome()
        mutated = self.scheduler.mutate(chromosome)
        self.assertIsInstance(mutated, list)
        if mutated:
            self.assertIsInstance(mutated[0], dict)

    def test_evolution_process(self):
        """Test if evolution process completes and returns solution"""
        solution = self.scheduler.evolve()
        self.assertIsInstance(solution, list)
        if solution:
            self.assertIsInstance(solution[0], dict)

    def test_timetable_generation(self):
        """Test if timetable generation produces valid format"""
        timetable = self.scheduler.generate_timetable()
        self.assertIsInstance(timetable, dict)
        for day in range(5):
            self.assertIn(day, timetable)
            self.assertIsInstance(timetable[day], dict)
            # testing/tests/test_agadr.py

def setUp(self):
    self.scheduler = AGADRScheduler()
    # Add test data directly
    self.scheduler.teachers = [{
        'id': 1,
        'name': 'Test Teacher',
        'subjects': ['Mathematics'],
        'availability': {str(day): [True]*8 for day in range(5)}
    }]
    self.scheduler.classrooms = [{
        'id': 1,
        'room_number': '101',
        'capacity': 30
    }]
    self.scheduler.courses = [{
        'id': 1,
        'name': 'Test Course',
        'subject': 'Mathematics',
        'students': 25
    }]

if __name__ == '__main__':
    unittest.main()