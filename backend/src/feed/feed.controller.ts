import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { FeedService } from './feed.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getGlobalFeed() {
    return this.feedService.getGlobalFeed();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@Request() req: any, @Body() body: { content: string, imageUrl?: string }) {
    return this.feedService.createPost(req.user.userId, body.content, body.imageUrl);
  }
}
