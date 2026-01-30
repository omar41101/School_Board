"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const students_module_1 = require("./students/students.module");
const teachers_module_1 = require("./teachers/teachers.module");
const parents_module_1 = require("./parents/parents.module");
const courses_module_1 = require("./courses/courses.module");
const grades_module_1 = require("./grades/grades.module");
const assignments_module_1 = require("./assignments/assignments.module");
const attendance_module_1 = require("./attendance/attendance.module");
const payments_module_1 = require("./payments/payments.module");
const events_module_1 = require("./events/events.module");
const messages_module_1 = require("./messages/messages.module");
const cantine_module_1 = require("./cantine/cantine.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            students_module_1.StudentsModule,
            teachers_module_1.TeachersModule,
            parents_module_1.ParentsModule,
            courses_module_1.CoursesModule,
            grades_module_1.GradesModule,
            assignments_module_1.AssignmentsModule,
            attendance_module_1.AttendanceModule,
            payments_module_1.PaymentsModule,
            events_module_1.EventsModule,
            messages_module_1.MessagesModule,
            cantine_module_1.CantineModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map