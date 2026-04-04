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
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsService = class AnalyticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { ngoProfile: true, volunteerProfile: true } });
        if (!user)
            throw new common_1.UnauthorizedException();
        if (user.role === 'NGO' && user.ngoProfile) {
            const ngoId = user.ngoProfile.id;
            const eventsCount = await this.prisma.event.count({ where: { ngoId } });
            const totalVolunteersCount = await this.prisma.eventApplication.groupBy({ by: ['volunteerId'], where: { event: { ngoId } } });
            const totalVolunteers = totalVolunteersCount.length;
            const certsCount = await this.prisma.certificate.count({ where: { application: { event: { ngoId } } } });
            const hoursAgg = await this.prisma.eventApplication.aggregate({
                _sum: { hoursLogged: true },
                where: { event: { ngoId }, status: 'COMPLETED' }
            });
            const totalApps = await this.prisma.eventApplication.count({ where: { event: { ngoId } } });
            const completedApps = await this.prisma.eventApplication.count({ where: { event: { ngoId }, status: 'COMPLETED' } });
            const participationRate = totalApps > 0 ? (completedApps / totalApps) * 100 : 0;
            return {
                totalVolunteers: totalVolunteers || 0,
                events: eventsCount || 0,
                hoursLogged: (hoursAgg._sum.hoursLogged || 0).toFixed(0),
                participationRate: participationRate.toFixed(1) + '%',
                certificatesIssued: certsCount || 0
            };
        }
        if (user.role === 'VOLUNTEER' && user.volunteerProfile) {
            const volId = user.volunteerProfile.id;
            const hoursLoggedAgg = await this.prisma.eventApplication.aggregate({ _sum: { hoursLogged: true }, where: { volunteerId: volId } });
            const totalVolunteers = hoursLoggedAgg._sum.hoursLogged || 0;
            const eventsJoined = await this.prisma.eventApplication.count({ where: { volunteerId: volId } });
            const certsCount = await this.prisma.certificate.count({ where: { volunteerId: volId } });
            const overallImpact = eventsJoined > 0 ? ((await this.prisma.eventApplication.count({ where: { volunteerId: volId, status: 'COMPLETED' } }) / eventsJoined) * 100).toFixed(1) : 0;
            return {
                totalVolunteers: totalVolunteers || 0,
                events: eventsJoined || 0,
                certificatesIssued: certsCount || 0,
                overallImpact: '+' + (overallImpact || 0) + '%'
            };
        }
        throw new common_1.UnauthorizedException();
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map