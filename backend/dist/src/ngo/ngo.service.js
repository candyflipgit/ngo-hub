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
exports.NgoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NgoService = class NgoService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchNgos(query, cause, location) {
        const filters = {};
        if (query)
            filters.name = { contains: query, mode: 'insensitive' };
        if (location)
            filters.location = { contains: location, mode: 'insensitive' };
        return this.prisma.ngoProfile.findMany({
            where: filters,
            include: {
                events: true,
                _count: { select: { events: true } }
            }
        });
    }
    async getNgoDetails(id) {
        const ngo = await this.prisma.ngoProfile.findUnique({
            where: { id },
            include: {
                user: { select: { id: true } },
                events: true,
                _count: { select: { events: true, followers: true } }
            }
        });
        if (!ngo)
            throw new common_1.NotFoundException();
        return ngo;
    }
    async toggleFollow(userId, ngoId) {
        const volunteer = await this.prisma.volunteerProfile.findUnique({ where: { userId } });
        if (!volunteer)
            throw new common_1.NotFoundException('Only volunteers can follow');
        const existingFollow = await this.prisma.follow.findFirst({
            where: { followerId: volunteer.id, followingId: ngoId }
        });
        if (existingFollow) {
            await this.prisma.follow.delete({ where: { id: existingFollow.id } });
            return { isFollowing: false };
        }
        else {
            await this.prisma.follow.create({
                data: { followerId: volunteer.id, followingId: ngoId }
            });
            return { isFollowing: true };
        }
    }
    async getFollowStatus(userId, ngoId) {
        const volunteer = await this.prisma.volunteerProfile.findUnique({ where: { userId } });
        if (!volunteer)
            return { isFollowing: false };
        const existingFollow = await this.prisma.follow.findFirst({
            where: { followerId: volunteer.id, followingId: ngoId }
        });
        return { isFollowing: !!existingFollow };
    }
};
exports.NgoService = NgoService;
exports.NgoService = NgoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NgoService);
//# sourceMappingURL=ngo.service.js.map