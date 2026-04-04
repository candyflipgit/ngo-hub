import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
export class AnalyticsController {
   constructor(private readonly analytics: AnalyticsService) {}

   @UseGuards(JwtAuthGuard)
   @Get()
   getDashboardStats(@Request() req: any) {
      return this.analytics.getDashboardStats(req.user.userId);
   }
}
