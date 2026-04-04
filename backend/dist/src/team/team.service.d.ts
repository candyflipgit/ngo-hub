import { PrismaService } from '../prisma/prisma.service';
export declare class TeamService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getTeam(userId: string): Promise<({
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
        role: string;
        createdAt: Date;
        userId: string;
        ngoId: string;
    })[]>;
    inviteMember(adminId: string, email: string, role: string): Promise<{
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
        role: string;
        createdAt: Date;
        userId: string;
        ngoId: string;
    }>;
    removeMember(adminId: string, memberId: string): Promise<{
        id: string;
        role: string;
        createdAt: Date;
        userId: string;
        ngoId: string;
    }>;
}
