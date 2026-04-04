import { PrismaService } from '../prisma/prisma.service';
export declare class FeedService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getGlobalFeed(): Promise<({
        comments: ({
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
            userId: string;
            content: string;
            postId: string;
        })[];
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
        ngoId: string;
        content: string;
        imageUrl: string | null;
    })[]>;
    createPost(userId: string, content: string, imageUrl?: string): Promise<{
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
        ngoId: string;
        content: string;
        imageUrl: string | null;
    }>;
}
