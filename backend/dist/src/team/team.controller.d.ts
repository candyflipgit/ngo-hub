import { TeamService } from './team.service';
export declare class TeamController {
    private readonly teamService;
    constructor(teamService: TeamService);
    getTeam(req: any): Promise<({
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
    invite(req: any, body: {
        email: string;
        role: string;
    }): Promise<{
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
    remove(req: any, id: string): Promise<{
        id: string;
        role: string;
        createdAt: Date;
        userId: string;
        ngoId: string;
    }>;
}
