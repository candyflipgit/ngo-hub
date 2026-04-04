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
exports.CertificatesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CertificatesService = class CertificatesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyCertificates(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { volunteerProfile: true, ngoProfile: true } });
        if (user?.role === 'NGO' && user.ngoProfile) {
            return this.prisma.certificate.findMany({
                where: { application: { event: { ngoId: user.ngoProfile.id } } },
                include: { application: { include: { event: { include: { ngo: true } } } }, volunteer: { include: { user: true } } }
            });
        }
        if (user?.role === 'VOLUNTEER' && user.volunteerProfile) {
            return this.prisma.certificate.findMany({
                where: { volunteerId: user.volunteerProfile.id },
                include: { application: { include: { event: { include: { ngo: true } } } }, volunteer: { include: { user: true } } }
            });
        }
        return [];
    }
    async getPublicCertificate(id) {
        return this.prisma.certificate.findUnique({
            where: { id },
            include: {
                volunteer: { include: { user: true } },
                application: { include: { event: { include: { ngo: true } } } }
            }
        });
    }
    async uploadCertificate(userId, data) {
        const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
        if (!ngo)
            throw new common_1.UnauthorizedException('Only NGOs can upload certificates.');
        const cert = await this.prisma.certificate.create({
            data: {
                applicationId: data.applicationId,
                volunteerId: data.volunteerId,
                downloadUrl: data.base64
            }
        });
        const vol = await this.prisma.volunteerProfile.findUnique({ where: { id: data.volunteerId }, include: { user: true } });
        if (vol) {
            await this.prisma.notification.create({
                data: { userId: vol.user.id, title: 'Certificate Issued', content: 'An NGO has issued an official certificate to your vault!' }
            });
        }
        return cert;
    }
};
exports.CertificatesService = CertificatesService;
exports.CertificatesService = CertificatesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CertificatesService);
//# sourceMappingURL=certificates.service.js.map