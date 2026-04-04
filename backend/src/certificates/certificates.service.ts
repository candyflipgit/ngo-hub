import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CertificatesService {
   constructor(private readonly prisma: PrismaService) {}

   async getMyCertificates(userId: string) {
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

   async getPublicCertificate(id: string) {
       return this.prisma.certificate.findUnique({
          where: { id },
          include: {
             volunteer: { include: { user: true } },
             application: { include: { event: { include: { ngo: true } } } }
          }
       });
   }
   
   async uploadCertificate(userId: string, data: { applicationId: string, volunteerId: string, base64: string }) {
       const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
       if (!ngo) throw new UnauthorizedException('Only NGOs can upload certificates.');
       
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
}
