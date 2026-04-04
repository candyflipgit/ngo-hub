import { ChatService } from './chat.service';
export declare class ChatController {
    private chatService;
    constructor(chatService: ChatService);
    searchUsers(q: string, req: any): never[] | Promise<{
        id: string;
        name: string;
        role: string;
    }[]>;
    getConversations(req: any): Promise<{
        id: string;
        name: string;
        preview: string;
        time: Date;
        active: boolean;
        otherUserId: string | undefined;
    }[]>;
    getMessages(id: string, req: any): Promise<{
        id: string;
        text: string;
        mediaUrl: string | null;
        time: Date;
        isMe: boolean;
    }[]>;
    sendMessage(id: string, body: {
        text: string;
        mediaUrl?: string;
    }, req: any): Promise<{
        id: string;
        text: string;
        mediaUrl: string | null;
        time: Date;
        isMe: boolean;
    }>;
    startChat(targetUserId: string, req: any): Promise<string>;
}
