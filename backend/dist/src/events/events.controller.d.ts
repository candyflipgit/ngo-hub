import { EventsService } from './events.service';
import { CreateEventDto } from './events.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    findAll(): Promise<({
        ngo: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            missionStatement: string | null;
            location: string | null;
            website: string | null;
            isVerified: boolean;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        location: string;
        title: string;
        date: Date;
        requiredVolunteers: number;
        isActive: boolean;
        ngoId: string;
    })[]>;
    create(req: any, dto: CreateEventDto): Promise<{
        ngo: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            description: string | null;
            missionStatement: string | null;
            location: string | null;
            website: string | null;
            isVerified: boolean;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        location: string;
        title: string;
        date: Date;
        requiredVolunteers: number;
        isActive: boolean;
        ngoId: string;
    }>;
    deactivateEvent(id: string, req: any): Promise<{
        message: string;
    }>;
    getNgoTeamEvents(req: any): Promise<({
        applications: ({
            volunteer: {
                user: {
                    id: string;
                    email: string;
                    password: string;
                    role: import("@prisma/client").$Enums.Role;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                firstName: string;
                lastName: string;
                phone: string | null;
                aadhaarEkycId: string | null;
                points: number;
                userId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ApplicationStatus;
            attended: boolean;
            hoursLogged: number | null;
            eventId: string;
            volunteerId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        location: string;
        title: string;
        date: Date;
        requiredVolunteers: number;
        isActive: boolean;
        ngoId: string;
    })[]>;
    notifyFollowers(id: string, req: any): Promise<{
        message: string;
    }>;
    apply(id: string, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        attended: boolean;
        hoursLogged: number | null;
        eventId: string;
        volunteerId: string;
    }>;
    getApplications(id: string, req: any): Promise<({
        volunteer: {
            user: {
                id: string;
                email: string;
                password: string;
                role: import("@prisma/client").$Enums.Role;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            phone: string | null;
            aadhaarEkycId: string | null;
            points: number;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        attended: boolean;
        hoursLogged: number | null;
        eventId: string;
        volunteerId: string;
    })[]>;
    handleApplication(appId: string, body: {
        status: 'APPROVED' | 'REJECTED';
    }, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        attended: boolean;
        hoursLogged: number | null;
        eventId: string;
        volunteerId: string;
    }>;
    markAttendance(appId: string, body: {
        hours: number;
    }, req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        attended: boolean;
        hoursLogged: number | null;
        eventId: string;
        volunteerId: string;
    }>;
}
