import { Controller, Post, Get, Body, Request, UseGuards, Param, Patch } from '@nestjs/common';
import { LegalService } from './legal.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('legal')
export class LegalController {
  constructor(private readonly legalService: LegalService) {}

  @UseGuards(JwtAuthGuard)
  @Get('workflows')
  getWorkflows(@Request() req: any) {
    return this.legalService.getWorkflows(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('workflows')
  startWorkflow(@Request() req: any, @Body() body: { type: string }) {
    return this.legalService.startWorkflow(req.user.userId, body.type);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('workflows/:id')
  updateProgress(@Param('id') id: string, @Body() body: { progress: number }) {
    return this.legalService.updateProgress(id, body.progress);
  }

  @UseGuards(JwtAuthGuard)
  @Get('documents')
  getDocuments(@Request() req: any) {
    return this.legalService.getDocuments(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('documents')
  uploadDocument(@Request() req: any, @Body() body: { name: string, type: 'TRUST'|'SOCIETY'|'SECTION_8', data: string }) {
    return this.legalService.uploadDocument(req.user.userId, body);
  }
}
