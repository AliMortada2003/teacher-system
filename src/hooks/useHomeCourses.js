import { useEffect, useState } from "react";
import { db } from "../db/database";

const readDb = (key, fallback) => {
    try {
        const value = db.all(key);
        return value || fallback;
    } catch {
        return fallback;
    }
};

const isStudent = (user) => user?.role === "student" && !user.hidden;

const isPublishedSubject = (subject) =>
    subject?.published !== false && subject?.active !== false;

export function useHomeCourses() {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const users = readDb("users", []);
        const subjects = readDb("subjects", []);
        const lessons = readDb("lessons", []);
        const exams = readDb("exams", []);

        const students = users.filter(isStudent);

        const mappedCourses = subjects
            .filter(isPublishedSubject)
            .slice(0, 6)
            .map((subject, index) => {
                const courseLessons = lessons.filter(
                    (lesson) => lesson.subjectId === subject.id
                );

                const courseExams = exams.filter(
                    (exam) => exam.subjectId === subject.id && exam.published
                );

                const enrolledStudents = students.filter((student) =>
                    student.subjectIds?.includes(subject.id)
                );

                const totalDuration =
                    courseLessons.reduce(
                        (sum, lesson) => sum + (Number(lesson.duration) || 0),
                        0
                    ) || 45;

                return {
                    ...subject,
                    lessonsCount: courseLessons.length,
                    quizzesCount: courseExams.length,
                    studentsCount: enrolledStudents.length,
                    durationLabel: subject.durationLabel || `${totalDuration} د`,
                    rating: (4.8 + (index % 2) * 0.1).toFixed(1),
                };
            });

        setCourses(mappedCourses);
    }, []);

    return courses;
}