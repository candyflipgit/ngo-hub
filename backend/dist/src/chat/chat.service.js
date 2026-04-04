"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ChatService = class ChatService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getConversations(userId) {
        const chats = await this.prisma.chat.findMany({
            where: { participants: { some: { id: userId } } },
            include: {
                participants: {
                    include: { ngoProfile: true, volunteerProfile: true }
                },
                messages: { orderBy: { createdAt: 'desc' }, take: 1 }
            },
            orderBy: { updatedAt: 'desc' }
        });
        return chats.map(chat => {
            const other = chat.participants.find(p => p.id !== userId);
            let name = 'Unknown User';
            if (other) {
                if (other.ngoProfile)
                    name = other.ngoProfile.name;
                else if (other.volunteerProfile)
                    name = `${other.volunteerProfile.firstName} ${other.volunteerProfile.lastName}`;
            }
            return {
                id: chat.id,
                name,
                preview: chat.messages[0]?.content || 'No messages yet.',
                time: chat.messages[0]?.createdAt || chat.updatedAt,
                active: false,
                otherUserId: other?.id
            };
        });
    }
    async getMessages(chatId, userId) {
        const chat = await this.prisma.chat.findFirst({
            where: { id: chatId, participants: { some: { id: userId } } },
        });
        if (!chat)
            throw new common_1.NotFoundException('Chat not found');
        const messages = await this.prisma.message.findMany({
            where: { chatId },
            orderBy: { createdAt: 'asc' }
        });
        return messages.map(m => ({
            id: m.id,
            text: m.content,
            mediaUrl: m.mediaUrl,
            time: m.createdAt,
            isMe: m.senderId === userId
        }));
    }
    async sendMessage(chatId, userId, content, mediaUrl) {
        const chat = await this.prisma.chat.findFirst({
            where: { id: chatId, participants: { some: { id: userId } } },
        });
        if (!chat)
            throw new common_1.NotFoundException();
        await this.prisma.chat.update({ where: { id: chatId }, data: { updatedAt: new Date() } });
        const msg = await this.prisma.message.create({
            data: { chatId, senderId: userId, content, mediaUrl }
        });
        return {
            id: msg.id,
            text: msg.content,
            mediaUrl: msg.mediaUrl,
            time: msg.createdAt,
            isMe: true
        };
    }
    async searchUsers(query, excludeUserId) {
        const ngos = await this.prisma.user.findMany({
            where: { role: 'NGO', ngoProfile: { name: { contains: query, mode: 'insensitive' } }, id: { not: excludeUserId } },
            include: { ngoProfile: true }
        });
        const vols = await this.prisma.user.findMany({
            where: { role: 'VOLUNTEER', volunteerProfile: { OR: [{ firstName: { contains: query, mode: 'insensitive' } }, { lastName: { contains: query, mode: 'insensitive' } }] }, id: { not: excludeUserId } },
            include: { volunteerProfile: true }
        });
        return [
            ...ngos.map(u => ({ id: u.id, name: u.ngoProfile?.name || 'Unknown NGO', role: 'NGO' })),
            ...vols.map(u => ({ id: u.id, name: `${u.volunteerProfile?.firstName} ${u.volunteerProfile?.lastName}`, role: 'VOLUNTEER' }))
        ];
    }
    async startOrGetChat(userId, targetUserId) {
        const existing = await this.prisma.chat.findFirst({
            where: {
                AND: [
                    { participants: { some: { id: userId } } },
                    { participants: { some: { id: targetUserId } } }
                ]
            }
        });
        if (existing)
            return existing.id;
        const chat = await this.prisma.chat.create({
            data: {
                participants: { connect: [{ id: userId }, { id: targetUserId }] }
            }
        });
        return chat.id;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatService);
//# sourceMappingURL=chat.service.js.map