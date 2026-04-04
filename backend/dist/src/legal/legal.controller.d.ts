import { LegalService } from './legal.service';
export declare class LegalController {
    private readonly legalService;
    constructor(legalService: LegalService);
    getWorkflows(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ngoId: string;
        status: string;
        type: string;
        progress: number;
    }[]>;
    startWorkflow(req: any, body: {
        type: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ngoId: string;
        status: string;
        type: string;
        progress: number;
    }>;
    updateProgress(id: string, body: {
        progress: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ngoId: string;
        status: string;
        type: string;
        progress: number;
    }>;
    getDocuments(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        ngoId: string;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        type: import("@prisma/client").$Enums.DocumentType;
        documentUrl: string | null;
        checklistState: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    uploadDocument(req: any, body: {
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
