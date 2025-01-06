// server/utils/scheduler.js
// const Schedule = require('../models/Schedule');
// const Teacher = require('../models/Teacher');
// const Student = require('../models/Student');
// const Classroom = require('../models/Classroom');
// const mongoose = require('mongoose');

// class BinPackingScheduler {
//     constructor() {
//         this.timeSlots = [
//             '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
//             '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
//         ];
//         this.weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
//     }

//     async generateSchedule(semester) {
//         try {
//             console.log('Starting schedule generation for semester:', semester);

//             // 1. Clear existing schedules for the semester
//             await Schedule.deleteMany({ semester });
//             console.log('Cleared existing schedules');

//             // 2. Get all resources
//             const [teachers, students, classrooms] = await Promise.all([
//                 Teacher.find().lean(),
//                 Student.find().lean(),
//                 Classroom.find().lean()
//             ]);

//             console.log(`Resources loaded - Teachers: ${teachers.length}, Students: ${students.length}, Classrooms: ${classrooms.length}`);

//             // Validate resources
//             if (!this.validateResources(teachers, students, classrooms)) {
//                 throw new Error('Invalid or insufficient resources');
//             }

//             // 3. Create bins
//             const bins = this.initializeBins();

//             // 4. Process each teacher's subjects
//             const schedules = [];
//             for (const teacher of teachers) {
//                 try {
//                     const teacherSchedules = await this.processTeacherSchedule(
//                         teacher,
//                         students,
//                         classrooms,
//                         bins,
//                         semester
//                     );
//                     schedules.push(...teacherSchedules);
//                 } catch (teacherError) {
//                     console.error(`Error processing teacher ${teacher._id}:`, teacherError);
//                     continue; // Skip this teacher but continue with others
//                 }
//             }

//             if (schedules.length === 0) {
//                 throw new Error('No valid schedules could be generated');
//             }

//             // 5. Save all schedules
//             const savedSchedules = await Schedule.insertMany(schedules, { ordered: false });
//             console.log(`Successfully generated ${savedSchedules.length} schedules`);
//             return savedSchedules;

//         } catch (error) {
//             console.error('Schedule generation failed:', error);
//             throw error;
//         }
//     }

//     validateResources(teachers, students, classrooms) {
//         if (!teachers.length || !students.length || !classrooms.length) {
//             console.error('Missing required resources');
//             return false;
//         }

//         // Validate teacher data
//         const validTeachers = teachers.filter(teacher => 
//             teacher.subjects?.length > 0 && 
//             teacher.availability && 
//             Object.keys(teacher.availability).length > 0
//         );

//         // Validate student data
//         const validStudents = students.filter(student =>
//             student.availability &&
//             Object.keys(student.availability).length > 0
//         );

//         // Validate classroom data
//         const validClassrooms = classrooms.filter(classroom =>
//             classroom.capacity > 0 &&
//             classroom.availability &&
//             Object.keys(classroom.availability).length > 0
//         );

//         console.log(`Valid resources - Teachers: ${validTeachers.length}, Students: ${validStudents.length}, Classrooms: ${validClassrooms.length}`);
        
//         return validTeachers.length > 0 && validStudents.length > 0 && validClassrooms.length > 0;
//     }

//     async processTeacherSchedule(teacher, students, classrooms, bins, semester) {
//         const schedules = [];
//         console.log(`Processing schedule for teacher: ${teacher._id}`);

//         for (const subject of teacher.subjects || []) {
//             try {
//                 // Find eligible students for this subject
//                 const eligibleStudents = this.findEligibleStudents(subject, students);
//                 if (eligibleStudents.length < 5) {
//                     console.log(`Skipping subject ${subject} - insufficient students`);
//                     continue;
//                 }

//                 // Find available time slots
//                 const availableSlots = this.findAvailableTimeSlots(teacher, bins);
//                 if (availableSlots.length === 0) {
//                     console.log(`No available time slots for teacher ${teacher._id}`);
//                     continue;
//                 }

//                 // Find suitable classroom
//                 for (const slot of availableSlots) {
//                     const classroom = this.findSuitableClassroom(classrooms, slot.day, slot.timeSlot);
//                     if (!classroom) continue;

//                     const schedule = {
//                         teacher: new mongoose.Types.ObjectId(teacher._id),
//                         subject: subject,
//                         students: eligibleStudents.slice(0, classroom.capacity).map(s => 
//                             new mongoose.Types.ObjectId(s._id)
//                         ),
//                         classroom: new mongoose.Types.ObjectId(classroom._id),
//                         dayOfWeek: slot.day,
//                         timeSlot: slot.timeSlot,
//                         semester: semester,
//                         status: 'scheduled'
//                     };

//                     schedules.push(schedule);
//                     this.updateBinAvailability(bins, slot.day, slot.timeSlot, teacher._id, classroom._id);
//                     break;
//                 }
//             } catch (subjectError) {
//                 console.error(`Error processing subject ${subject}:`, subjectError);
//                 continue;
//             }
//         }

//         return schedules;
//     }

//     findAvailableTimeSlots(teacher, bins) {
//         const availableSlots = [];
        
//         this.weekDays.forEach(day => {
//             if (!teacher.availability[day]) return;
            
//             bins[day].forEach(bin => {
//                 if (bin.available && teacher.availability[day].includes(bin.timeSlot)) {
//                     availableSlots.push({ day, timeSlot: bin.timeSlot });
//                 }
//             });
//         });

//         return availableSlots;
//     }

//     findEligibleStudents(subject, allStudents) {
//         // Simple implementation - can be enhanced based on requirements
//         return allStudents.filter(student => 
//             student.availability && 
//             Object.keys(student.availability).length > 0
//         );
//     }

//     findSuitableClassroom(classrooms, day, timeSlot) {
//         return classrooms.find(classroom => 
//             classroom.availability?.[day]?.includes(timeSlot) &&
//             classroom.capacity >= 5
//         );
//     }

//     initializeBins() {
//         const bins = {};
//         this.weekDays.forEach(day => {
//             bins[day] = this.timeSlots.map(slot => ({
//                 timeSlot: slot,
//                 classes: [],
//                 available: true
//             }));
//         });
//         return bins;
//     }

//     updateBinAvailability(bins, day, timeSlot, teacherId, classroomId) {
//         const bin = bins[day].find(b => b.timeSlot === timeSlot);
//         if (bin) {
//             bin.available = false;
//             bin.classes.push({ teacher: teacherId, classroom: classroomId });
//         }
//     }
// }

// module.exports = new BinPackingScheduler();


// server/utils/scheduler.js
const mongoose = require('mongoose');
const Schedule = require('../models/Schedule');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Classroom = require('../models/Classroom');

class BinPackingScheduler {
    constructor() {
        this.timeSlots = [
            '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
            '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
        ];
        this.weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        this.MIN_CLASS_SIZE = 3;
    }

    validateResources(teachers, students, classrooms) {
        if (!teachers.length || !students.length || !classrooms.length) {
            console.error('Missing required resources');
            return false;
        }

        // Validate teacher data
        const validTeachers = teachers.filter(teacher => {
            const hasSubjects = Array.isArray(teacher.subjects) && teacher.subjects.length > 0;
            const hasAvailability = teacher.availability && 
                this.weekDays.every(day => Array.isArray(teacher.availability[day]));
            
            if (!hasSubjects) {
                console.error(`Teacher ${teacher._id} has no subjects`);
            }
            if (!hasAvailability) {
                console.error(`Teacher ${teacher._id} has invalid availability`);
            }
            
            return hasSubjects && hasAvailability;
        });

        // Validate student data
        const validStudents = students.filter(student => {
            const hasSubjects = Array.isArray(student.subjects) && student.subjects.length > 0;
            const hasAvailability = student.availability && 
                this.weekDays.every(day => Array.isArray(student.availability[day]));
            
            if (!hasSubjects) {
                console.error(`Student ${student._id} has no subjects`);
            }
            if (!hasAvailability) {
                console.error(`Student ${student._id} has invalid availability`);
            }
            
            return hasSubjects && hasAvailability;
        });

        // Validate classroom data
        const validClassrooms = classrooms.filter(classroom => {
            const hasCapacity = classroom.capacity && classroom.capacity >= this.MIN_CLASS_SIZE;
            const hasAvailability = classroom.availability && 
                this.weekDays.every(day => Array.isArray(classroom.availability[day]));
            
            if (!hasCapacity) {
                console.error(`Classroom ${classroom._id} has insufficient capacity`);
            }
            if (!hasAvailability) {
                console.error(`Classroom ${classroom._id} has invalid availability`);
            }
            
            return hasCapacity && hasAvailability;
        });

        console.log(`Valid resources - Teachers: ${validTeachers.length}, Students: ${validStudents.length}, Classrooms: ${validClassrooms.length}`);
        
        return validTeachers.length > 0 && validStudents.length > 0 && validClassrooms.length > 0;
    }

    async generateSchedule(semester) {
        try {
            console.log('Starting schedule generation for semester:', semester);

            // 1. Clear existing schedules for the semester
            await Schedule.deleteMany({ semester });
            console.log('Cleared existing schedules');

            // 2. Get all resources
            const [teachers, students, classrooms] = await Promise.all([
                Teacher.find().lean(),
                Student.find().lean(),
                Classroom.find().lean()
            ]);

            console.log(`Resources loaded - Teachers: ${teachers.length}, Students: ${students.length}, Classrooms: ${classrooms.length}`);

            // Validate resources with detailed logging
            if (!this.validateResources(teachers, students, classrooms)) {
                throw new Error('Invalid or insufficient resources - check console for details');
            }

            // 3. Create bins for schedule tracking
            const bins = this.initializeBins();

            // 4. Group students by subject preferences
            const studentGroups = this.groupStudentsBySubjects(students);
            console.log('Student groups:', Object.keys(studentGroups).map(subject => ({
                subject,
                count: studentGroups[subject].length
            })));

            // 5. Process each teacher's subjects
            const schedules = [];
            for (const teacher of teachers) {
                for (const subject of teacher.subjects || []) {
                    const eligibleStudents = studentGroups[subject] || [];
                    console.log(`Processing ${subject} - Eligible students: ${eligibleStudents.length}`);

                    if (eligibleStudents.length >= this.MIN_CLASS_SIZE) {
                        const teacherSchedules = await this.scheduleSubject(
                            teacher,
                            subject,
                            eligibleStudents,
                            classrooms,
                            bins,
                            semester
                        );
                        schedules.push(...teacherSchedules);
                    } else {
                        console.log(`Skipping ${subject} - insufficient students (${eligibleStudents.length}/${this.MIN_CLASS_SIZE} required)`);
                    }
                }
            }

            if (schedules.length === 0) {
                throw new Error('No valid schedules could be generated - check student enrollment and subject requirements');
            }

            // 6. Save and return schedules
            const savedSchedules = await Schedule.insertMany(schedules);
            console.log(`Successfully generated ${savedSchedules.length} schedules`);
            return savedSchedules;

        } catch (error) {
            console.error('Schedule generation failed:', error);
            throw error;
        }
    }

    // ... (rest of the methods from previous artifact)
    groupStudentsBySubjects(students) {
        const groups = {};
        students.forEach(student => {
            (student.subjects || []).forEach(subject => {
                if (!groups[subject]) {
                    groups[subject] = [];
                }
                groups[subject].push(student);
            });
        });
        return groups;
    }

    initializeBins() {
        const bins = {};
        this.weekDays.forEach(day => {
            bins[day] = this.timeSlots.map(slot => ({
                timeSlot: slot,
                classes: [],
                available: true
            }));
        });
        return bins;
    }

    findAvailableTimeSlots(teacher, bins) {
        const availableSlots = [];
        
        this.weekDays.forEach(day => {
            if (!teacher.availability[day]) return;
            
            bins[day].forEach(bin => {
                if (bin.available && teacher.availability[day].includes(bin.timeSlot)) {
                    availableSlots.push({ day, timeSlot: bin.timeSlot });
                }
            });
        });

        return availableSlots;
    }

    async scheduleSubject(teacher, subject, students, classrooms, bins, semester) {
        const schedules = [];
        const availableSlots = this.findAvailableTimeSlots(teacher, bins);

        for (const slot of availableSlots) {
            const classroom = this.findSuitableClassroom(classrooms, slot.day, slot.timeSlot, students.length);
            if (!classroom) continue;

            const schedule = {
                teacher: teacher._id,
                subject: subject,
                students: students.slice(0, classroom.capacity).map(s => s._id),
                classroom: classroom._id,
                dayOfWeek: slot.day,
                timeSlot: slot.timeSlot,
                semester: semester,
                status: 'scheduled'
            };

            schedules.push(schedule);
            this.updateBinAvailability(bins, slot.day, slot.timeSlot, teacher._id, classroom._id);
            break;
        }

        return schedules;
    }

    findSuitableClassroom(classrooms, day, timeSlot, studentCount) {
        return classrooms.find(classroom => 
            classroom.availability?.[day]?.includes(timeSlot) &&
            classroom.capacity >= Math.max(this.MIN_CLASS_SIZE, studentCount)
        );
    }

    updateBinAvailability(bins, day, timeSlot, teacherId, classroomId) {
        const bin = bins[day].find(b => b.timeSlot === timeSlot);
        if (bin) {
            bin.available = false;
            bin.classes.push({ teacher: teacherId, classroom: classroomId });
        }
    }
}

module.exports = new BinPackingScheduler();