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
exports.UpdateCantineDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateCantineDto {
}
exports.UpdateCantineDto = UpdateCantineDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], UpdateCantineDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateCantineDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: ['breakfast', 'lunch', 'snack', 'dinner'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['breakfast', 'lunch', 'snack', 'dinner']),
    __metadata("design:type", String)
], UpdateCantineDto.prototype, "mealType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: [Object] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateCantineDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: ['pending', 'confirmed', 'served', 'cancelled'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['pending', 'confirmed', 'served', 'cancelled']),
    __metadata("design:type", String)
], UpdateCantineDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: ['pending', 'paid'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['pending', 'paid']),
    __metadata("design:type", String)
], UpdateCantineDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCantineDto.prototype, "specialInstructions", void 0);
//# sourceMappingURL=update-cantine.dto.js.map