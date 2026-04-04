import { PrismaService } from '../prisma/prisma.service';
export declare class LegalService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getWorkflows(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ngoId: string;
        status: string;
        type: string;
        progress: number;
    }[]>;
    startWorkflow(userId: string, type: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ngoId: string;
        status: string;
        type: string;
        progress: number;
    }>;
    updateProgress(workflowId: string, progress: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ngoId: string;
        status: string;
        type: string;
        progress: number;
    }>;
    getDocuments(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ngoId: string;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        type: import("@prisma/client").$Enums.DocumentType;
        documentUrl: string | null;
        checklistState: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    uploadDocument(userId: string, data: {
        name: string;
        type: 'TRUST' | 'SOCIETY' | 'SECTION_8';
        data: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ngoId: string;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        type: import("@prisma/client").$Enums.DocumentType;
        documentUrl: string | null;
        checklistState: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
