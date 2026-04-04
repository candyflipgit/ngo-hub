import { Controller, Get, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CollaborationsService } from './collaborations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('collaborations')
export class CollaborationsController {
  constructor(private readonly collabService: CollaborationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getCollabs(@Request() req: any) {
    return this.collabService.getCollaborations(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  send(@Request() req: any, @Body() body: { receiverId: string, title: string }) {
    return this.collabService.sendRequest(req.user.userId, body.receiverId, body.title);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  respond(@Request() req: any, @Param('id') id: string, @Body() body: { status: 'APPROVED' | 'REJECTED' }) {
    return this.collabService.respondRequest(req.user.userId, id, body.status);
  }
}
