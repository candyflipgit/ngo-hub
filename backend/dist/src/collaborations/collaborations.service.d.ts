import { PrismaService } from '../prisma/prisma.service';
export declare class CollaborationsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCollaborations(userId: string): Promise<({
        sender: {
            name: string;
            location: string | null;
        };
        receiver: {
            name: string;
            location: string | null;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        senderId: string;
        receiverId: string;
    })[]>;
    sendRequest(userId: string, receiverId: string, title: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        senderId: string;
        receiverId: string;
    }>;
    respondRequest(userId: string, collId: string, status: 'APPROVED' | 'REJECTED'): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        senderId: string;
        receiverId: string;
    }>;
}
