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
exports.TeamService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TeamService = class TeamService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTeam(userId) {
        const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
        if (!ngo)
            throw new common_1.UnauthorizedException();
        return this.prisma.teamMember.findMany({ where: { ngoId: ngo.id }, include: { user: true } });
    }
    async inviteMember(adminId, email, role) {
        const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId: adminId } });
        if (!ngo)
            throw new common_1.UnauthorizedException();
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('User with this email not found on the platform.');
        const existing = await this.prisma.teamMember.findFirst({ where: { ngoId: ngo.id, userId: user.id } });
        if (existing)
            throw new common_1.BadRequestException('User is already a team member.');
        return this.prisma.teamMember.create({
            data: {
                ngoId: ngo.id,
                userId: user.id,
                role
            },
            include: { user: true }
        });
    }
    async removeMember(adminId, memberId) {
        const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId: adminId } });
        if (!ngo)
            throw new common_1.UnauthorizedException();
        return this.prisma.teamMember.delete({
            where: { id: memberId }
        });
    }
};
exports.TeamService = TeamService;
exports.TeamService = TeamService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TeamService);
//# sourceMappingURL=team.service.js.map