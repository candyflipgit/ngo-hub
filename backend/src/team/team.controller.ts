import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TeamService } from './team.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('team')
export class TeamController {
   constructor(private readonly teamService: TeamService) {}

   @UseGuards(JwtAuthGuard)
   @Get()
   getTeam(@Request() req: any) {
      return this.teamService.getTeam(req.user.userId);
   }

   @UseGuards(JwtAuthGuard)
   @Post('invite')
   invite(@Request() req: any, @Body() body: { email: string, role: string }) {
      return this.teamService.inviteMember(req.user.userId, body.email, body.role);
   }

   @UseGuards(JwtAuthGuard)
   @Delete(':id')
   remove(@Request() req: any, @Param('id') id: string) {
      return this.teamService.removeMember(req.user.userId, id);
   }
}
