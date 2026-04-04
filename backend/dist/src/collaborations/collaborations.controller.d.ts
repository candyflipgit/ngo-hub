import { CollaborationsService } from './collaborations.service';
export declare class CollaborationsController {
    private readonly collabService;
    constructor(collabService: CollaborationsService);
    getCollabs(req: any): Promise<({
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
    send(req: any, body: {
        receiverId: string;
        title: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        senderId: string;
        receiverId: string;
    }>;
    respond(req: any, id: string, body: {
        status: 'APPROVED' | 'REJECTED';
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        senderId: string;
        receiverId: string;
    }>;
}
