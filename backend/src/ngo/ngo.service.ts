import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NgoService {
  constructor(private readonly prisma: PrismaService) {}

  async searchNgos(query: string, cause: string, location: string) {
    const filters: any = {};
    if (query) filters.name = { contains: query, mode: 'insensitive' };
    if (location) filters.location = { contains: location, mode: 'insensitive' };

    return this.prisma.ngoProfile.findMany({
      where: filters,
      include: {
         events: true,
         _count: { select: { events: true } }
      }
    });
  }

  async getNgoDetails(id: string) {
    const ngo = await this.prisma.ngoProfile.findUnique({
      where: { id },
      include: {
         user: { select: { id: true } },
         events: true,
         // @ts-ignore
         _count: { select: { events: true, followers: true } }
      }
    });
    if (!ngo) throw new NotFoundException();
    return ngo;
  }

  async toggleFollow(userId: string, ngoId: string) {
    const volunteer = await this.prisma.volunteerProfile.findUnique({ where: { userId } });
    if (!volunteer) throw new NotFoundException('Only volunteers can follow');

    const existingFollow = await (this.prisma as any).follow.findFirst({
        where: { followerId: volunteer.id, followingId: ngoId }
    });

    if (existingFollow) {
        await (this.prisma as any).follow.delete({ where: { id: existingFollow.id } });
        return { isFollowing: false };
    } else {
        await (this.prisma as any).follow.create({
            data: { followerId: volunteer.id, followingId: ngoId }
        });
        return { isFollowing: true };
    }
  }

  async getFollowStatus(userId: string, ngoId: string) {
    const volunteer = await this.prisma.volunteerProfile.findUnique({ where: { userId } });
    if (!volunteer) return { isFollowing: false };

    const existingFollow = await (this.prisma as any).follow.findFirst({
        where: { followerId: volunteer.id, followingId: ngoId }
    });
    
    return { isFollowing: !!existingFollow };
  }
}
