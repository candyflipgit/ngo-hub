import { NgoService } from './ngo.service';
export declare class NgoController {
    private readonly ngoService;
    constructor(ngoService: NgoService);
    search(query: string, cause: string, location: string): Promise<({
        events: {
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
        }[];
        _count: {
            events: number;
        };
    } & {
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
    })[]>;
    details(id: string): Promise<{
        user: {
            id: string;
        };
        events: {
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
        }[];
        _count: {
            events: number;
            followers: number;
        };
    } & {
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
    }>;
    toggleFollow(req: any, id: string): Promise<{
        isFollowing: boolean;
    }>;
    followStatus(req: any, id: string): Promise<{
        isFollowing: boolean;
    }>;
}
