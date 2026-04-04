import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(userId: string): Promise<{
        totalVolunteers: number;
        events: number;
        hoursLogged: string;
        participationRate: string;
        certificatesIssued: number;
        overallImpact?: undefined;
    } | {
        totalVolunteers: number;
        events: number;
        certificatesIssued: number;
        overallImpact: string;
        hoursLogged?: undefined;
        participationRate?: undefined;
    }>;
}
