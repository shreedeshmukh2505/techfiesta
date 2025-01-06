# testing/display/timetable_view.py

from tabulate import tabulate
from typing import Dict

def display_timetable(timetable: Dict):
    """Display timetable in a simple tabular format"""
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    time_slots = ['9:00', '10:00', '11:00', '12:00', '1:00', '2:00', '3:00', '4:00']
    
    # Prepare data for tabulate
    table_data = []
    for slot_idx, time in enumerate(time_slots):
        row = [time]
        for day_idx in range(5):
            cell = timetable[day_idx][slot_idx]
            if cell:
                row.append(f"{cell['course']}\n{cell['teacher']}\nRoom {cell['room']}")
            else:
                row.append('---')
        table_data.append(row)
    
    # Display table
    headers = ['Time'] + days
    print(tabulate(table_data, headers=headers, tablefmt='grid'))

# Example usage
if __name__ == "__main__":
    from algorithms.agadr import AGADRScheduler
    
    scheduler = AGADRScheduler()
    timetable = scheduler.generate_timetable()
    display_timetable(timetable)