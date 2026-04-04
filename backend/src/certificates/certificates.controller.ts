import { Controller, Get, UseGuards, Request, Param, Post, Body } from '@nestjs/common';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('certificates')
export class CertificatesController {
   constructor(private readonly service: CertificatesService) {}

   @UseGuards(JwtAuthGuard)
   @Get()
   getMyCertificates(@Request() req: any) {
      return this.service.getMyCertificates(req.user.userId);
   }

   @Get(':id')
   getPublicCertificate(@Param('id') id: string) {
      return this.service.getPublicCertificate(id);
   }

   @UseGuards(JwtAuthGuard)
   @Post('upload')
   uploadCertificate(@Request() req: any, @Body() body: { applicationId: string, volunteerId: string, base64: string }) {
      return this.service.uploadCertificate(req.user.userId, body);
   }
}
