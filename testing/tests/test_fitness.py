# testing/tests/test_fitness.py

import unittest
from algorithms.fitness import FitnessCalculator

class TestFitnessCalculator(unittest.TestCase):
    def setUp(self):
        self.calculator = FitnessCalculator()
        self.sample_chromosome = [
            {
                'day': 0,
                'time_slot': 0,
                'course': {'name': 'Math', 'students': 30},
                'teacher': {'id': 1, 'name': 'John Doe', 'availability': [[True]*8]*5},
                'classroom': {'id': 1, 'capacity': 35}
            },
            {
                'day': 0,
                'time_slot': 1,
                'course': {'name': 'Physics', 'students': 25},
                'teacher': {'id': 2, 'name': 'Jane Smith', 'availability': [[True]*8]*5},
                'classroom': {'id': 2, 'capacity': 30}
            }
        ]

    def test_calculate_fitness(self):
        """Test overall fitness calculation"""
        fitness = self.calculator.calculate_fitness(self.sample_chromosome)
        self.assertGreaterEqual(fitness, 0)
        self.assertLessEqual(fitness, 1)

    def test_teacher_conflicts(self):
        """Test detection of teacher conflicts"""
        # Create a conflict by assigning same teacher to same time
        conflicting_chromosome = self.sample_chromosome.copy()
        conflicting_chromosome[1]['teacher'] = conflicting_chromosome[0]['teacher']
        conflicting_chromosome[1]['time_slot'] = conflicting_chromosome[0]['time_slot']
        
        conflicts = self.calculator.check_teacher_conflicts(conflicting_chromosome)
        self.assertGreater(conflicts, 0)

    def test_room_conflicts(self):
        """Test detection of room conflicts"""
        # Create a conflict by assigning same room to same time
        conflicting_chromosome = self.sample_chromosome.copy()
        conflicting_chromosome[1]['classroom'] = conflicting_chromosome[0]['classroom']
        conflicting_chromosome[1]['time_slot'] = conflicting_chromosome[0]['time_slot']
        
        conflicts = self.calculator.check_room_conflicts(conflicting_chromosome)
        self.assertGreater(conflicts, 0)

    def test_capacity_violations(self):
        """Test detection of capacity violations"""
        # Create a violation by exceeding room capacity
        violating_chromosome = self.sample_chromosome.copy()
        violating_chromosome[0]['course']['students'] = 40  # Exceeds room capacity of 35
        
        violations = self.calculator.check_capacity_violations(violating_chromosome)
        self.assertGreater(violations, 0)

    def test_consecutive_classes(self):
        """Test detection of too many consecutive classes"""
    # Create 4 consecutive classes for same teacher
        consecutive_chromosome = [
            {
                'day': 0,
                'time_slot': 0,
                'teacher': {'id': 1, 'name': 'Test Teacher'},
                'course': {'name': 'Course1', 'students': 20},
                'classroom': {'id': 1, 'capacity': 30}
            },
            {
                'day': 0,
                'time_slot': 1,
                'teacher': {'id': 1, 'name': 'Test Teacher'},
                'course': {'name': 'Course2', 'students': 20},
                'classroom': {'id': 2, 'capacity': 30}
            },
            {
                'day': 0,
                'time_slot': 2,
                'teacher': {'id': 1, 'name': 'Test Teacher'},
                'course': {'name': 'Course3', 'students': 20},
                'classroom': {'id': 3, 'capacity': 30}
            },
            {
                'day': 0,
                'time_slot': 3,
                'teacher': {'id': 1, 'name': 'Test Teacher'},
                'course': {'name': 'Course4', 'students': 20},
                'classroom': {'id': 4, 'capacity': 30}
            }
        ]
    
        penalties = self.calculator.check_consecutive_classes(consecutive_chromosome)
        self.assertGreater(penalties, 0)

    def test_teacher_preferences(self):
        """Test detection of teacher preference violations"""
        # Create a violation by scheduling when teacher is unavailable
        violating_chromosome = self.sample_chromosome.copy()
        violating_chromosome[0]['teacher']['availability'][0][0] = False
        
        violations = self.calculator.check_teacher_preferences(violating_chromosome)
        self.assertGreater(violations, 0)

if __name__ == '__main__':
    unittest.main()