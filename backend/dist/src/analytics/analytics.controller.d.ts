import { AnalyticsService } from './analytics.service';
export declare class AnalyticsController {
    private readonly analytics;
    constructor(analytics: AnalyticsService);
    getDashboardStats(req: any): Promise<{
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
