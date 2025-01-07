from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
from pathlib import Path

# Get absolute path to project root
ROOT_DIR = Path(__file__).parent.parent.parent
print(f"Project root directory: {ROOT_DIR}")

# Add paths in the correct order
TESTING_DIR = ROOT_DIR / 'testing'
sys.path.insert(0, str(TESTING_DIR))
print(f"\nPython path: {sys.path[0]}")

try:
    # Import using absolute paths from testing directory
    from testing.algorithms.agadr import AGADRScheduler
    from utils.data_generator import generate_test_data
    print("Successfully imported all modules")
except ImportError:
    # Fallback import method if the first fails
    try:
        import importlib.util
        
        # Dynamic import for AGADRScheduler
        agadr_path = TESTING_DIR / 'algorithms' / 'agadr.py'
        spec = importlib.util.spec_from_file_location("agadr", str(agadr_path))
        agadr_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(agadr_module)
        AGADRScheduler = agadr_module.AGADRScheduler
        
        print("Successfully imported modules using dynamic import")
    except Exception as e:
        print(f"Import error: {e}")
        raise

app = Flask(__name__)
CORS(app)

@app.route('/generate-timetable', methods=['POST'])
def generate_timetable():
    try:
        data = request.json
        print("Received data:", data)

        # Generate additional test data if needed
        test_data = generate_test_data()
        
        # Merge test data with received data
        divisions = data.get('divisions') or test_data['divisions']
        teachers = data.get('teachers') or test_data['teachers']
        classrooms = data.get('classrooms') or test_data['classrooms']

        print("Using data:", {
            "divisions": len(divisions),
            "teachers": len(teachers),
            "classrooms": len(classrooms)
        })

        scheduler = AGADRScheduler(
            divisions=divisions,
            teachers=teachers,
            classrooms=classrooms,
            semester=data['semester']
        )
        
        timetable = scheduler.generate_timetable()
        print("Generated timetable:", timetable)
        
        return jsonify(timetable)
    except Exception as e:
        print("Error generating timetable:", str(e))
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(port=5002, debug=True)