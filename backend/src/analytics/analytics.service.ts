import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
   constructor(private readonly prisma: PrismaService) {}

   async getDashboardStats(userId: string) {
       const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { ngoProfile: true, volunteerProfile: true } });
       if (!user) throw new UnauthorizedException();
              if (user.role === 'NGO' && user.ngoProfile) {
            const ngoId = user.ngoProfile.id;
            const eventsCount = await this.prisma.event.count({ where: { ngoId } });
            const totalVolunteersCount = await this.prisma.eventApplication.groupBy({ by: ['volunteerId'], where: { event: { ngoId } } });
            const totalVolunteers = totalVolunteersCount.length;
            const certsCount = await this.prisma.certificate.count({ where: { application: { event: { ngoId } } } });
            
            // Calculate total hours logged by summing volunteer sessions for completed events
            const hoursAgg = await this.prisma.eventApplication.aggregate({
                _sum: { hoursLogged: true },
                where: { event: { ngoId }, status: 'COMPLETED' }
            });

            // Calculate participation rate (completed / total applications)
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
           const totalVolunteers = hoursLoggedAgg._sum.hoursLogged || 0; // we reuse this variable as "hours volunteered"
           const eventsJoined = await this.prisma.eventApplication.count({ where: { volunteerId: volId } });
           const certsCount = await this.prisma.certificate.count({ where: { volunteerId: volId } });
           const overallImpact = eventsJoined > 0 ? ((await this.prisma.eventApplication.count({ where: { volunteerId: volId, status: 'COMPLETED' } }) / eventsJoined) * 100).toFixed(1) : 0;
           
           return {
              totalVolunteers: totalVolunteers || 0, // Maps to Hours Volunteered
              events: eventsJoined || 0,
              certificatesIssued: certsCount || 0,
              overallImpact: '+' + (overallImpact || 0) + '%'
           };
       }

       throw new UnauthorizedException();
   }
}
