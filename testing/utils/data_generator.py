def generate_test_data():
    """Generate sample data for testing"""
    divisions = [
        {
            "name": "Division A",
            "semester": "Fall 2024",
            "availability": {
                "monday": ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"],
                "tuesday": ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"],
                "wednesday": ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"],
                "thursday": ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"],
                "friday": ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"]
            }
        },
        # Add more divisions...
    ]

    teachers = [
        {
            "name": "John Doe",
            "subjects": ["Advanced Mathematics", "Physics"],
            "availability": {
                "monday": ["9:00 AM", "10:00 AM", "11:00 AM"],
                "tuesday": ["9:00 AM", "10:00 AM", "11:00 AM"],
                "wednesday": ["9:00 AM", "10:00 AM", "11:00 AM"],
                "thursday": ["9:00 AM", "10:00 AM", "11:00 AM"],
                "friday": ["9:00 AM", "10:00 AM", "11:00 AM"]
            }
        },
        # Add more teachers...
    ]

    classrooms = [
        {
            "roomNumber": "101",
            "capacity": 30,
            "availability": {
                "monday": ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"],
                "tuesday": ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"],
                "wednesday": ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"],
                "thursday": ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"],
                "friday": ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM"]
            }
        },
        # Add more classrooms...
    ]

    return {
        "divisions": divisions,
        "teachers": teachers,
        "classrooms": classrooms
    } 