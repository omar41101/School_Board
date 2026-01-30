export declare enum Role {
    Admin = "admin",
    Student = "student",
    Teacher = "teacher",
    Parent = "parent",
    Direction = "direction"
}
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: Role[]) => import("@nestjs/common").CustomDecorator<string>;
