# testing/run_tests.py

import unittest
import sys
from algorithms.agadr import AGADRScheduler
from display.timetable_view import display_timetable

def run_all_tests():
    """Run all unit tests"""
    # Discover and run tests
    loader = unittest.TestLoader()
    start_dir = 'tests'
    suite = loader.discover(start_dir, pattern='test_*.py')
    
    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    return result.wasSuccessful()

def run_sample_schedule():
    """Generate and display a sample schedule"""
    print("\nGenerating sample schedule...")
    scheduler = AGADRScheduler()
    timetable = scheduler.generate_timetable()
    
    print("\nGenerated Timetable:")
    display_timetable(timetable)
    
    return True

if __name__ == '__main__':
    # Run tests if argument is 'test'
    if len(sys.argv) > 1 and sys.argv[1] == 'test':
        success = run_all_tests()
        sys.exit(0 if success else 1)
    # Otherwise generate sample schedule
    else:
        run_sample_schedule()