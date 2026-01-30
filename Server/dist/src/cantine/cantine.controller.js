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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CantineController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cantine_service_1 = require("./cantine.service");
const create_cantine_dto_1 = require("./dto/create-cantine.dto");
const update_cantine_dto_1 = require("./dto/update-cantine.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const roles_decorator_2 = require("../auth/decorators/roles.decorator");
let CantineController = class CantineController {
    constructor(cantineService) {
        this.cantineService = cantineService;
    }
    findAll(query) {
        return this.cantineService.findAll(query);
    }
    findOne(id) {
        return this.cantineService.findOne(id);
    }
    create(createCantineDto) {
        return this.cantineService.create(createCantineDto);
    }
    update(id, updateCantineDto) {
        return this.cantineService.update(id, updateCantineDto);
    }
    cancel(id) {
        return this.cantineService.cancel(id);
    }
    remove(id) {
        return this.cantineService.remove(id);
    }
};
exports.CantineController = CantineController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all cantine orders' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CantineController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get cantine order by ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CantineController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_decorator_2.Role.Admin, roles_decorator_2.Role.Student, roles_decorator_2.Role.Parent),
    (0, swagger_1.ApiOperation)({ summary: 'Create cantine order' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cantine_dto_1.CreateCantineDto]),
    __metadata("design:returntype", void 0)
], CantineController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(roles_decorator_2.Role.Admin),
    (0, swagger_1.ApiOperation)({ summary: 'Update cantine order (Admin only)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_cantine_dto_1.UpdateCantineDto]),
    __metadata("design:returntype", void 0)
], CantineController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel cantine order' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CantineController.prototype, "cancel", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(roles_decorator_2.Role.Admin),
    (0, swagger_1.ApiOperation)({ summary: 'Delete cantine order (Admin only)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CantineController.prototype, "remove", null);
exports.CantineController = CantineController = __decorate([
    (0, swagger_1.ApiTags)('Cantine'),
    (0, common_1.Controller)('cantine'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [cantine_service_1.CantineService])
], CantineController);
//# sourceMappingURL=cantine.controller.js.map