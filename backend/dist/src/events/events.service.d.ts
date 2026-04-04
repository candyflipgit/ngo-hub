import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './events.dto';
export declare class EventsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(userId: string, dto: CreateEventDto): Promise<{
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
    deactivateEvent(eventId: string, userId: string): Promise<{
        message: string;
    }>;
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
    apply(eventId: string, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        attended: boolean;
        hoursLogged: number | null;
        eventId: string;
        volunteerId: string;
    }>;
    getEventApplications(eventId: string, userId: string): Promise<({
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
    handleApplication(applicationId: string, status: 'APPROVED' | 'REJECTED', userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        attended: boolean;
        hoursLogged: number | null;
        eventId: string;
        volunteerId: string;
    }>;
    markAttendance(applicationId: string, hours: number, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        attended: boolean;
        hoursLogged: number | null;
        eventId: string;
        volunteerId: string;
    }>;
    getNgoTeamEvents(userId: string): Promise<({
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
    notifyFollowers(eventId: string, userId: string): Promise<{
        message: string;
    }>;
}
