import { Role } from '../decorators/roles.decorator';
declare class AddressDto {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
}
declare class EmergencyContactDto {
    name?: string;
    relationship?: string;
    phone?: string;
}
declare class MedicalInfoDto {
    bloodGroup?: string;
    allergies?: string[];
    medicalConditions?: string[];
    emergencyContact?: EmergencyContactDto;
}
declare class PreviousSchoolDto {
    name?: string;
    year?: string;
}
export declare class RegisterDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: Role;
    matricule?: string;
    dateOfBirth?: string;
    gender?: string;
    level?: string;
    className?: string;
    section?: string;
    parentId?: number;
    employeeId?: string;
    qualification?: string;
    specialization?: string;
    salary?: number;
    subjects?: string[];
    experience?: number;
    classes?: string[];
    schedule?: any;
    relationship?: string;
    occupation?: string;
    address?: AddressDto;
    medicalInfo?: MedicalInfoDto;
    previousSchool?: PreviousSchoolDto;
    documents?: any[];
    emergencyContact?: EmergencyContactDto;
}
export {};
