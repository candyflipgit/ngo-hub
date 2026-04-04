import { PrismaService } from '../prisma/prisma.service';
export declare class ChatService {
    private prisma;
    constructor(prisma: PrismaService);
    getConversations(userId: string): Promise<{
        id: string;
        name: string;
        preview: string;
        time: Date;
        active: boolean;
        otherUserId: string | undefined;
    }[]>;
    getMessages(chatId: string, userId: string): Promise<{
        id: string;
        text: string;
        mediaUrl: string | null;
        time: Date;
        isMe: boolean;
    }[]>;
    sendMessage(chatId: string, userId: string, content: string, mediaUrl?: string): Promise<{
        id: string;
        text: string;
        mediaUrl: string | null;
        time: Date;
        isMe: boolean;
    }>;
    searchUsers(query: string, excludeUserId: string): Promise<{
        id: string;
        name: string;
        role: string;
    }[]>;
    startOrGetChat(userId: string, targetUserId: string): Promise<string>;
}
