import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CollaborationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCollaborations(userId: string) {
    const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
    if (!ngo) throw new UnauthorizedException();
    
    return this.prisma.collaboration.findMany({
       where: {
          OR: [
             { senderId: ngo.id },
             { receiverId: ngo.id }
          ]
       },
       include: {
          sender: { select: { name: true, location: true } },
          receiver: { select: { name: true, location: true } }
       }
    });
  }

  async sendRequest(userId: string, receiverId: string, title: string) {
    const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId }, include: { user: true } });
    if (!ngo) throw new UnauthorizedException();

    const collab = await this.prisma.collaboration.create({
       data: {
         senderId: ngo.id,
         receiverId: receiverId,
         status: 'PENDING',
         title
       }
    });

    const receiverNgo = await this.prisma.ngoProfile.findUnique({ where: { id: receiverId }, include: { user: true } });
    if (receiverNgo) {
       await this.prisma.notification.create({
          data: { userId: receiverNgo.user.id, title: 'New Event Collaboration Request', content: `${ngo.name} wants to collaborate on ${title}!` }
       });
    }

    return collab;
  }

  async respondRequest(userId: string, collId: string, status: 'APPROVED' | 'REJECTED') {
    const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
    if (!ngo) throw new UnauthorizedException();

    return this.prisma.collaboration.update({
       where: { id: collId },
       data: { status }
    });
  }
}
