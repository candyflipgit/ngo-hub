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
exports.CollaborationsController = void 0;
const common_1 = require("@nestjs/common");
const collaborations_service_1 = require("./collaborations.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
let CollaborationsController = class CollaborationsController {
    collabService;
    constructor(collabService) {
        this.collabService = collabService;
    }
    getCollabs(req) {
        return this.collabService.getCollaborations(req.user.userId);
    }
    send(req, body) {
        return this.collabService.sendRequest(req.user.userId, body.receiverId, body.title);
    }
    respond(req, id, body) {
        return this.collabService.respondRequest(req.user.userId, id, body.status);
    }
};
exports.CollaborationsController = CollaborationsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CollaborationsController.prototype, "getCollabs", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], CollaborationsController.prototype, "send", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], CollaborationsController.prototype, "respond", null);
exports.CollaborationsController = CollaborationsController = __decorate([
    (0, common_1.Controller)('collaborations'),
    __metadata("design:paramtypes", [collaborations_service_1.CollaborationsService])
], CollaborationsController);
//# sourceMappingURL=collaborations.controller.js.map