import { PrismaService } from '../prisma/prisma.service';
export declare class NgoService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    searchNgos(query: string, cause: string, location: string): Promise<({
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
    getNgoDetails(id: string): Promise<{
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
    toggleFollow(userId: string, ngoId: string): Promise<{
        isFollowing: boolean;
    }>;
    getFollowStatus(userId: string, ngoId: string): Promise<{
        isFollowing: boolean;
    }>;
}
