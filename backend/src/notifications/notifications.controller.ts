import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  @UseGuards(JwtAuthGuard)
  @Get()
  getNotifications(@Request() req: any) {
    return [
      { id: '1', title: 'Admin Approved', content: 'Your NGO Profile has been verified!', isRead: false },
      { id: '2', title: 'New Volunteer', content: 'A volunteer has applied for your event.', isRead: true }
    ];
  }
}
