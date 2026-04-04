import { Controller, Get, Query, Param, Post, UseGuards, Request } from '@nestjs/common';
import { NgoService } from './ngo.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ngo')
export class NgoController {
  constructor(private readonly ngoService: NgoService) {}

  @Get()
  search(
    @Query('query') query: string,
    @Query('cause') cause: string,
    @Query('location') location: string,
  ) {
    return this.ngoService.searchNgos(query, cause, location);
  }

  @Get(':id')
  details(@Param('id') id: string) {
    return this.ngoService.getNgoDetails(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/follow')
  toggleFollow(@Request() req: any, @Param('id') id: string) {
    return this.ngoService.toggleFollow(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/follow-status')
  followStatus(@Request() req: any, @Param('id') id: string) {
    return this.ngoService.getFollowStatus(req.user.userId, id);
  }
}
