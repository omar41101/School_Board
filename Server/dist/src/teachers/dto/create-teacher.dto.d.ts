export declare class CreateTeacherDto {
    userId: number;
    employeeId: string;
    dateOfBirth: string;
    gender: string;
    qualification: string;
    specialization: string;
    salary: number;
    subjects?: string[];
    experience?: number;
    addressStreet?: string;
    addressCity?: string;
    addressState?: string;
    addressZipCode?: string;
    addressCountry?: string;
    classes?: any[];
    schedule?: any[];
}
