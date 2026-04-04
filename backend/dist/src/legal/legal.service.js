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
exports.LegalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LegalService = class LegalService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getWorkflows(userId) {
        const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
        if (!ngo)
            throw new common_1.UnauthorizedException();
        return this.prisma.legalWorkflow.findMany({ where: { ngoId: ngo.id } });
    }
    async startWorkflow(userId, type) {
        const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
        if (!ngo)
            throw new common_1.UnauthorizedException();
        return this.prisma.legalWorkflow.create({
            data: {
                ngoId: ngo.id,
                type,
                progress: 0,
                status: 'DRAFTING'
            }
        });
    }
    async updateProgress(workflowId, progress) {
        return this.prisma.legalWorkflow.update({
            where: { id: workflowId },
            data: { progress, status: progress >= 100 ? 'SUBMITTED' : 'DRAFTING' }
        });
    }
    async getDocuments(userId) {
        const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
        if (!ngo)
            throw new common_1.UnauthorizedException();
        return this.prisma.legalDocument.findMany({ where: { ngoId: ngo.id } });
    }
    async uploadDocument(userId, data) {
        const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
        if (!ngo)
            throw new common_1.UnauthorizedException();
        return this.prisma.legalDocument.create({
            data: {
                ngoId: ngo.id,
                type: data.type,
                documentUrl: data.data,
                status: 'APPROVED'
            }
        });
    }
};
exports.LegalService = LegalService;
exports.LegalService = LegalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LegalService);
//# sourceMappingURL=legal.service.js.map