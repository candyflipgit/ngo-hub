import { IsEnum, IsOptional } from 'class-validator';
import { DocumentType } from '@prisma/client';

export class StartLegalRegistrationDto {
  @IsEnum(DocumentType)
  type: DocumentType;
}

export class UpdateLegalChecklistDto {
  @IsOptional()
  checklistState: any;
}
