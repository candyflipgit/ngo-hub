import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LegalService {
  constructor(private readonly prisma: PrismaService) {}

  async getWorkflows(userId: string) {
    const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
    if (!ngo) throw new UnauthorizedException();
    return this.prisma.legalWorkflow.findMany({ where: { ngoId: ngo.id } });
  }

  async startWorkflow(userId: string, type: string) {
    const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
    if (!ngo) throw new UnauthorizedException();
    
    return this.prisma.legalWorkflow.create({
       data: {
         ngoId: ngo.id,
         type,
         progress: 0,
         status: 'DRAFTING'
       }
    });
  }

  async updateProgress(workflowId: string, progress: number) {
    return this.prisma.legalWorkflow.update({
       where: { id: workflowId },
       data: { progress, status: progress >= 100 ? 'SUBMITTED' : 'DRAFTING' }
    });
  }

  async getDocuments(userId: string) {
    const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
    if (!ngo) throw new UnauthorizedException();
    return this.prisma.legalDocument.findMany({ where: { ngoId: ngo.id } });
  }

  async uploadDocument(userId: string, data: { name: string, type: 'TRUST'|'SOCIETY'|'SECTION_8', data: string }) {
    const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
    if (!ngo) throw new UnauthorizedException();
    
    return this.prisma.legalDocument.create({
      data: {
         ngoId: ngo.id,
         type: data.type,
         documentUrl: data.data,
         status: 'APPROVED'
      }
    });
  }
}
