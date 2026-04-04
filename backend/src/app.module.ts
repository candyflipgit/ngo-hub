import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { NgoModule } from './ngo/ngo.module';
import { EventsModule } from './events/events.module';
import { LegalModule } from './legal/legal.module';
import { FeedModule } from './feed/feed.module';
import { ChatModule } from './chat/chat.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TeamModule } from './team/team.module';
import { CollaborationsModule } from './collaborations/collaborations.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { CertificatesModule } from './certificates/certificates.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, NgoModule, EventsModule, LegalModule, FeedModule, ChatModule, NotificationsModule, TeamModule, CollaborationsModule, AnalyticsModule, CertificatesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
