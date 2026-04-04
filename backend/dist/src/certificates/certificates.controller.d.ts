import { CertificatesService } from './certificates.service';
export declare class CertificatesController {
    private readonly service;
    constructor(service: CertificatesService);
    getMyCertificates(req: any): Promise<({
        volunteer: {
            user: {
                id: string;
                email: string;
                password: string;
                role: import("@prisma/client").$Enums.Role;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            phone: string | null;
            aadhaarEkycId: string | null;
            points: number;
            userId: string;
        };
        application: {
            event: {
                ngo: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    missionStatement: string | null;
                    location: string | null;
                    website: string | null;
                    isVerified: boolean;
                    userId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                location: string;
                title: string;
                date: Date;
                requiredVolunteers: number;
                isActive: boolean;
                ngoId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ApplicationStatus;
            attended: boolean;
            hoursLogged: number | null;
            eventId: string;
            volunteerId: string;
        };
    } & {
        id: string;
        volunteerId: string;
        issueDate: Date;
        downloadUrl: string;
        applicationId: string;
    })[]>;
    getPublicCertificate(id: string): Promise<({
        volunteer: {
            user: {
                id: string;
                email: string;
                password: string;
                role: import("@prisma/client").$Enums.Role;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            firstName: string;
            lastName: string;
            phone: string | null;
            aadhaarEkycId: string | null;
            points: number;
            userId: string;
        };
        application: {
            event: {
                ngo: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    missionStatement: string | null;
                    location: string | null;
                    website: string | null;
                    isVerified: boolean;
                    userId: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string;
                location: string;
                title: string;
                date: Date;
                requiredVolunteers: number;
                isActive: boolean;
                ngoId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.ApplicationStatus;
            attended: boolean;
            hoursLogged: number | null;
            eventId: string;
            volunteerId: string;
        };
    } & {
        id: string;
        volunteerId: string;
        issueDate: Date;
        downloadUrl: string;
        applicationId: string;
    }) | null>;
    uploadCertificate(req: any, body: {
        applicationId: string;
        volunteerId: string;
        base64: string;
    }): Promise<{
        id: string;
        volunteerId: string;
        issueDate: Date;
        downloadUrl: string;
        applicationId: string;
    }>;
}
