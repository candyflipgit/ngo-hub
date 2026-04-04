import { Controller, Get, Post, Body, Param, Request, UseGuards, Patch, Put } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './events.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req: any, @Body() dto: CreateEventDto) {
    return this.eventsService.create(req.user.userId, dto);
  }

  @Patch(':id/deactivate')
  @UseGuards(JwtAuthGuard)
  deactivateEvent(@Param('id') id: string, @Request() req: any) {
    return this.eventsService.deactivateEvent(id, req.user.userId);
  }

  @Get('ngo/team')
  @UseGuards(JwtAuthGuard)
  getNgoTeamEvents(@Request() req: any) {
    return this.eventsService.getNgoTeamEvents(req.user.userId);
  }

  @Post(':id/notify-followers')
  @UseGuards(JwtAuthGuard)
  notifyFollowers(@Param('id') id: string, @Request() req: any) {
    return this.eventsService.notifyFollowers(id, req.user.userId);
  }

  @Post(':id/apply')
  @UseGuards(JwtAuthGuard)
  apply(@Param('id') id: string, @Request() req: any) {
    return this.eventsService.apply(id, req.user.userId);
  }

  @Get(':id/applications')
  @UseGuards(JwtAuthGuard)
  getApplications(@Param('id') id: string, @Request() req: any) {
    return this.eventsService.getEventApplications(id, req.user.userId);
  }

  @Patch('applications/:appId')
  @UseGuards(JwtAuthGuard)
  handleApplication(
     @Param('appId') appId: string, 
     @Body() body: { status: 'APPROVED' | 'REJECTED' }, 
     @Request() req: any
  ) {
    return this.eventsService.handleApplication(appId, body.status, req.user.userId);
  }

  @Post('applications/:appId/attend')
  @UseGuards(JwtAuthGuard)
  markAttendance(
     @Param('appId') appId: string, 
     @Body() body: { hours: number }, 
     @Request() req: any
  ) {
    return this.eventsService.markAttendance(appId, body.hours, req.user.userId);
  }
}
