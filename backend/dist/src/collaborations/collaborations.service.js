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
exports.CollaborationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CollaborationsService = class CollaborationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getCollaborations(userId) {
        const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
        if (!ngo)
            throw new common_1.UnauthorizedException();
        return this.prisma.collaboration.findMany({
            where: {
                OR: [
                    { senderId: ngo.id },
                    { receiverId: ngo.id }
                ]
            },
            include: {
                sender: { select: { name: true, location: true } },
                receiver: { select: { name: true, location: true } }
            }
        });
    }
    async sendRequest(userId, receiverId, title) {
        const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId }, include: { user: true } });
        if (!ngo)
            throw new common_1.UnauthorizedException();
        const collab = await this.prisma.collaboration.create({
            data: {
                senderId: ngo.id,
                receiverId: receiverId,
                status: 'PENDING',
                title
            }
        });
        const receiverNgo = await this.prisma.ngoProfile.findUnique({ where: { id: receiverId }, include: { user: true } });
        if (receiverNgo) {
            await this.prisma.notification.create({
                data: { userId: receiverNgo.user.id, title: 'New Event Collaboration Request', content: `${ngo.name} wants to collaborate on ${title}!` }
            });
        }
        return collab;
    }
    async respondRequest(userId, collId, status) {
        const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
        if (!ngo)
            throw new common_1.UnauthorizedException();
        return this.prisma.collaboration.update({
            where: { id: collId },
            data: { status }
        });
    }
};
exports.CollaborationsService = CollaborationsService;
exports.CollaborationsService = CollaborationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CollaborationsService);
//# sourceMappingURL=collaborations.service.js.map