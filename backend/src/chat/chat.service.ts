import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getConversations(userId: string) {
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
         if (other.ngoProfile) name = other.ngoProfile.name;
         else if (other.volunteerProfile) name = `${other.volunteerProfile.firstName} ${other.volunteerProfile.lastName}`;
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

  async getMessages(chatId: string, userId: string) {
    const chat = await this.prisma.chat.findFirst({
      where: { id: chatId, participants: { some: { id: userId } } },
    });
    if (!chat) throw new NotFoundException('Chat not found');

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

  async sendMessage(chatId: string, userId: string, content: string, mediaUrl?: string) {
    const chat = await this.prisma.chat.findFirst({
      where: { id: chatId, participants: { some: { id: userId } } },
    });
    if (!chat) throw new NotFoundException();

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

  async searchUsers(query: string, excludeUserId: string) {
    // Search both NGOs and Volunteers if no specific role is asked, but UI implies "search ngo"
    const ngos = await this.prisma.user.findMany({
       where: { role: 'NGO', ngoProfile: { name: { contains: query, mode: 'insensitive' } }, id: { not: excludeUserId } },
       include: { ngoProfile: true }
    });
    
    const vols = await this.prisma.user.findMany({
       where: { role: 'VOLUNTEER', volunteerProfile: { OR: [ { firstName: { contains: query, mode: 'insensitive' } }, { lastName: { contains: query, mode: 'insensitive' } } ] }, id: { not: excludeUserId } },
       include: { volunteerProfile: true }
    });

    return [
       ...ngos.map(u => ({ id: u.id, name: u.ngoProfile?.name || 'Unknown NGO', role: 'NGO' })),
       ...vols.map(u => ({ id: u.id, name: `${u.volunteerProfile?.firstName} ${u.volunteerProfile?.lastName}`, role: 'VOLUNTEER' }))
    ];
  }

  async startOrGetChat(userId: string, targetUserId: string) {
     const existing = await this.prisma.chat.findFirst({
       where: {
         AND: [
            { participants: { some: { id: userId } } },
            { participants: { some: { id: targetUserId } } }
         ]
       }
     });
     if (existing) return existing.id;
     
     const chat = await this.prisma.chat.create({
       data: {
          participants: { connect: [{ id: userId }, { id: targetUserId }] }
       }
     });
     return chat.id;
  }
}
