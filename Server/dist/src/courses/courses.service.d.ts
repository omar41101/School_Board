import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
export declare class CoursesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: any): Promise<{
        status: string;
        results: number;
        data: {
            courses: ({
                teacher: {
                    user: {
                        firstName: string;
                        lastName: string;
                        email: string;
                        id: number;
                    };
                } & {
                    dateOfBirth: Date;
                    gender: import(".prisma/client").$Enums.Gender;
                    employeeId: string;
                    qualification: string;
                    specialization: string;
                    salary: import("@prisma/client/runtime/library").Decimal;
                    subjects: import("@prisma/client/runtime/library").JsonValue | null;
                    experience: number;
                    classes: import("@prisma/client/runtime/library").JsonValue | null;
                    schedule: import("@prisma/client/runtime/library").JsonValue | null;
                    documents: import("@prisma/client/runtime/library").JsonValue | null;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    addressStreet: string | null;
                    addressCity: string | null;
                    addressState: string | null;
                    addressZipCode: string | null;
                    addressCountry: string | null;
                    status: import(".prisma/client").$Enums.TeacherStatus;
                    userId: number;
                    joiningDate: Date;
                };
            } & {
                name: string;
                description: string | null;
                level: string;
                schedule: import("@prisma/client/runtime/library").JsonValue | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                code: string;
                subject: string;
                teacherId: number | null;
                credits: number;
                maxStudents: number;
                enrolledStudents: import("@prisma/client/runtime/library").JsonValue | null;
                syllabus: import("@prisma/client/runtime/library").JsonValue | null;
                academicYear: string;
                semester: import(".prisma/client").$Enums.Semester;
            })[];
        };
    }>;
    findOne(id: number): Promise<{
        status: string;
        data: {
            course: {
                teacher: {
                    user: {
                        phone: string | null;
                        firstName: string;
                        lastName: string;
                        email: string;
                        password: string;
                        role: import(".prisma/client").$Enums.Role;
                        id: number;
                        avatar: string | null;
                        isActive: boolean;
                        lastLogin: Date | null;
                        createdAt: Date;
                        updatedAt: Date;
                    };
                } & {
                    dateOfBirth: Date;
                    gender: import(".prisma/client").$Enums.Gender;
                    employeeId: string;
                    qualification: string;
                    specialization: string;
                    salary: import("@prisma/client/runtime/library").Decimal;
                    subjects: import("@prisma/client/runtime/library").JsonValue | null;
                    experience: number;
                    classes: import("@prisma/client/runtime/library").JsonValue | null;
                    schedule: import("@prisma/client/runtime/library").JsonValue | null;
                    documents: import("@prisma/client/runtime/library").JsonValue | null;
                    id: number;
                    createdAt: Date;
                    updatedAt: Date;
                    addressStreet: string | null;
                    addressCity: string | null;
                    addressState: string | null;
                    addressZipCode: string | null;
                    addressCountry: string | null;
                    status: import(".prisma/client").$Enums.TeacherStatus;
                    userId: number;
                    joiningDate: Date;
                };
            } & {
                name: string;
                description: string | null;
                level: string;
                schedule: import("@prisma/client/runtime/library").JsonValue | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                code: string;
                subject: string;
                teacherId: number | null;
                credits: number;
                maxStudents: number;
                enrolledStudents: import("@prisma/client/runtime/library").JsonValue | null;
                syllabus: import("@prisma/client/runtime/library").JsonValue | null;
                academicYear: string;
                semester: import(".prisma/client").$Enums.Semester;
            };
        };
    }>;
    create(createCourseDto: CreateCourseDto): Promise<{
        status: string;
        data: {
            course: {
                name: string;
                description: string | null;
                level: string;
                schedule: import("@prisma/client/runtime/library").JsonValue | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                code: string;
                subject: string;
                teacherId: number | null;
                credits: number;
                maxStudents: number;
                enrolledStudents: import("@prisma/client/runtime/library").JsonValue | null;
                syllabus: import("@prisma/client/runtime/library").JsonValue | null;
                academicYear: string;
                semester: import(".prisma/client").$Enums.Semester;
            };
        };
    }>;
    update(id: number, updateCourseDto: UpdateCourseDto): Promise<{
        status: string;
        data: {
            course: {
                name: string;
                description: string | null;
                level: string;
                schedule: import("@prisma/client/runtime/library").JsonValue | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                code: string;
                subject: string;
                teacherId: number | null;
                credits: number;
                maxStudents: number;
                enrolledStudents: import("@prisma/client/runtime/library").JsonValue | null;
                syllabus: import("@prisma/client/runtime/library").JsonValue | null;
                academicYear: string;
                semester: import(".prisma/client").$Enums.Semester;
            };
        };
    }>;
    remove(id: number): Promise<{
        status: string;
        message: string;
    }>;
    enrollStudent(id: number, studentId: number): Promise<{
        status: string;
        data: {
            course: {
                name: string;
                description: string | null;
                level: string;
                schedule: import("@prisma/client/runtime/library").JsonValue | null;
                id: number;
                createdAt: Date;
                updatedAt: Date;
                status: string;
                code: string;
                subject: string;
                teacherId: number | null;
                credits: number;
                maxStudents: number;
                enrolledStudents: import("@prisma/client/runtime/library").JsonValue | null;
                syllabus: import("@prisma/client/runtime/library").JsonValue | null;
                academicYear: string;
                semester: import(".prisma/client").$Enums.Semester;
            };
        };
    }>;
}
