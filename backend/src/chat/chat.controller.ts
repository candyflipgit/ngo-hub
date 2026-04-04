import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get('search')
  searchUsers(@Query('q') q: string, @Request() req: any) {
    if (!q) return [];
    return this.chatService.searchUsers(q, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getConversations(@Request() req: any) {
    return this.chatService.getConversations(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/messages')
  getMessages(@Param('id') id: string, @Request() req: any) {
    return this.chatService.getMessages(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/messages')
  sendMessage(@Param('id') id: string, @Body() body: { text: string; mediaUrl?: string }, @Request() req: any) {
    return this.chatService.sendMessage(id, req.user.userId, body.text || '', body.mediaUrl);
  }

  @UseGuards(JwtAuthGuard)
  @Post('start/:userId')
  startChat(@Param('userId') targetUserId: string, @Request() req: any) {
    return this.chatService.startOrGetChat(req.user.userId, targetUserId);
  }
}
