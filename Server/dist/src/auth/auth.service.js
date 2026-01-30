"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        const { password: _, ...result } = user;
        return result;
    }
    async login(user) {
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
        });
        const payload = { email: user.email, id: user.id };
        return {
            success: true,
            token: this.jwtService.sign(payload),
            data: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                isActive: user.isActive,
                createdAt: user.createdAt,
            },
        };
    }
    async register(registerDto) {
        const { firstName, lastName, email, password, role, ...additionalData } = registerDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.BadRequestException('User already exists with this email');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role: role || 'student',
            },
        });
        let profileCreated = false;
        try {
            if (role === 'student' && additionalData.matricule && additionalData.dateOfBirth) {
                await this.prisma.student.create({
                    data: {
                        userId: user.id,
                        matricule: additionalData.matricule,
                        dateOfBirth: new Date(additionalData.dateOfBirth),
                        gender: additionalData.gender,
                        level: additionalData.level,
                        className: additionalData.className,
                        section: additionalData.section,
                        addressStreet: additionalData.address?.street,
                        addressCity: additionalData.address?.city,
                        addressState: additionalData.address?.state,
                        addressZipCode: additionalData.address?.zipCode,
                        addressCountry: additionalData.address?.country,
                        parentId: additionalData.parentId,
                        bloodGroup: additionalData.medicalInfo?.bloodGroup,
                        allergies: additionalData.medicalInfo?.allergies || [],
                        medicalConditions: additionalData.medicalInfo?.medicalConditions || [],
                        emergencyContactName: additionalData.medicalInfo?.emergencyContact?.name,
                        emergencyContactRelationship: additionalData.medicalInfo?.emergencyContact?.relationship,
                        emergencyContactPhone: additionalData.medicalInfo?.emergencyContact?.phone,
                        previousSchoolName: additionalData.previousSchool?.name,
                        previousSchoolYear: additionalData.previousSchool?.year,
                        documents: additionalData.documents || [],
                    },
                });
                profileCreated = true;
            }
            else if (role === 'teacher' && additionalData.employeeId && additionalData.dateOfBirth) {
                await this.prisma.teacher.create({
                    data: {
                        userId: user.id,
                        employeeId: additionalData.employeeId,
                        dateOfBirth: new Date(additionalData.dateOfBirth),
                        gender: additionalData.gender,
                        qualification: additionalData.qualification,
                        specialization: additionalData.specialization,
                        salary: additionalData.salary,
                        subjects: additionalData.subjects || [],
                        experience: additionalData.experience || 0,
                        addressStreet: additionalData.address?.street,
                        addressCity: additionalData.address?.city,
                        addressState: additionalData.address?.state,
                        addressZipCode: additionalData.address?.zipCode,
                        addressCountry: additionalData.address?.country,
                        classes: additionalData.classes || [],
                        schedule: additionalData.schedule || [],
                        documents: additionalData.documents || [],
                    },
                });
                profileCreated = true;
            }
            else if (role === 'parent' && additionalData.relationship) {
                await this.prisma.parent.create({
                    data: {
                        userId: user.id,
                        relationship: additionalData.relationship,
                        occupation: additionalData.occupation,
                        addressStreet: additionalData.address?.street,
                        addressCity: additionalData.address?.city,
                        addressState: additionalData.address?.state,
                        addressZipCode: additionalData.address?.zipCode,
                        addressCountry: additionalData.address?.country,
                        emergencyContactName: additionalData.emergencyContact?.name,
                        emergencyContactRelationship: additionalData.emergencyContact?.relationship,
                        emergencyContactPhone: additionalData.emergencyContact?.phone,
                    },
                });
                profileCreated = true;
            }
        }
        catch (error) {
            console.log('Profile creation skipped or failed:', error.message);
        }
        const payload = { email: user.email, id: user.id };
        const { password: _, ...userWithoutPassword } = user;
        return {
            success: true,
            token: this.jwtService.sign(payload),
            data: {
                ...userWithoutPassword,
                profileCreated,
            },
        };
    }
    async getMe(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                avatar: true,
                isActive: true,
                createdAt: true,
            },
        });
        return {
            success: true,
            data: user,
        };
    }
    async updatePassword(userId, updatePasswordDto) {
        const { currentPassword, newPassword } = updatePasswordDto;
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        const payload = { email: user.email, id: user.id };
        return {
            status: 'success',
            token: this.jwtService.sign(payload),
            message: 'Password updated successfully',
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map