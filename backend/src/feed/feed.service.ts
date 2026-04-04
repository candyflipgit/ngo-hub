import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}

  async getGlobalFeed() {
    return this.prisma.post.findMany({
      include: {
        ngo: true,
        comments: { include: { user: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async createPost(userId: string, content: string, imageUrl?: string) {
    const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
    if (!ngo) throw new Error("Only NGOs can create posts");

    return this.prisma.post.create({
      data: {
        ngoId: ngo.id,
        content,
        imageUrl,
      },
      include: { ngo: true }
    });
  }
}
