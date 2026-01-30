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
exports.UpdateMessageDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class UpdateMessageDto {
}
exports.UpdateMessageDto = UpdateMessageDto;
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMessageDto.prototype, "subject", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMessageDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: [Object] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], UpdateMessageDto.prototype, "attachments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: ['low', 'normal', 'high'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['low', 'normal', 'high']),
    __metadata("design:type", String)
], UpdateMessageDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: ['academic', 'administrative', 'general', 'urgent'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['academic', 'administrative', 'general', 'urgent']),
    __metadata("design:type", String)
], UpdateMessageDto.prototype, "category", void 0);
//# sourceMappingURL=update-message.dto.js.map