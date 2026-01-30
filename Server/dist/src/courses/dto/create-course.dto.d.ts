export declare class CreateCourseDto {
    name: string;
    code: string;
    description?: string;
    level: string;
    subject: string;
    teacherId?: number;
    credits?: number;
    maxStudents?: number;
    enrolledStudents?: number[];
    schedule?: any[];
    syllabus?: any[];
    academicYear: string;
    semester: string;
}
