"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EventsService = class EventsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
        if (!ngo)
            throw new common_1.UnauthorizedException('Only NGOs can create events');
        const newEvent = await this.prisma.event.create({
            data: {
                ngoId: ngo.id,
                title: dto.title,
                description: dto.description,
                date: new Date(dto.date),
                location: dto.location,
                requiredVolunteers: dto.requiredVolunteers,
            },
            include: { ngo: true }
        });
        await this.prisma.post.create({
            data: {
                ngoId: ngo.id,
                content: `We just launched a new event: ${dto.title}. Join us!`,
            }
        });
        return newEvent;
    }
    async deactivateEvent(eventId, userId) {
        const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
        if (!ngo)
            throw new common_1.UnauthorizedException('Access denied');
        const event = await this.prisma.event.findFirst({ where: { id: eventId, ngoId: ngo.id } });
        if (!event)
            throw new common_1.NotFoundException('Event not found or unauthorized');
        const hoursMatch = event.description.match(/(\d+(\.\d+)?)\s*(hour|hr|hrs)/i);
        const extractedHours = hoursMatch ? parseFloat(hoursMatch[1]) : 0;
        await this.prisma.$transaction(async (tx) => {
            await tx.event.update({
                where: { id: eventId },
                data: { isActive: false }
            });
            const approvedApps = await tx.eventApplication.findMany({
                where: { eventId, status: 'APPROVED' },
                include: { volunteer: { include: { user: true } } }
            });
            for (const app of approvedApps) {
                await tx.eventApplication.update({
                    where: { id: app.id },
                    data: {
                        status: 'COMPLETED',
                        hoursLogged: extractedHours,
                        attended: true
                    }
                });
                await tx.certificate.create({
                    data: {
                        applicationId: app.id,
                        volunteerId: app.volunteerId,
                        downloadUrl: `/certificate/download/${app.id}`
                    }
                });
                if (app.volunteer?.user?.id) {
                    await tx.notification.create({
                        data: {
                            userId: app.volunteer.user.id,
                            title: 'Event Success!',
                            content: `The event "${event.title}" has ended. You earned ${extractedHours} hours and your certificate is now available!`
                        }
                    });
                }
            }
        });
        return { message: `Event deactivated. ${extractedHours} hours logged for all confirmed volunteers.` };
    }
    async findAll() {
        return this.prisma.event.findMany({
            include: { ngo: true },
            orderBy: { date: 'asc' },
        });
    }
    async apply(eventId, userId) {
        const volunteer = await this.prisma.volunteerProfile.findUnique({ where: { userId } });
        if (!volunteer)
            throw new common_1.UnauthorizedException('Only Volunteers can apply');
        const event = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        if (!event.isActive)
            throw new common_1.UnauthorizedException('This event is no longer active and cannot accept new applications.');
        return this.prisma.eventApplication.create({
            data: {
                eventId,
                volunteerId: volunteer.id,
                status: 'PENDING'
            },
        });
    }
    async getEventApplications(eventId, userId) {
        const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
        if (!ngo)
            throw new common_1.UnauthorizedException('Access denied');
        const event = await this.prisma.event.findFirst({ where: { id: eventId, ngoId: ngo.id } });
        if (!event)
            throw new common_1.NotFoundException('Event not found or unauthorized access');
        return this.prisma.eventApplication.findMany({
            where: { eventId },
            include: { volunteer: { include: { user: true } } }
        });
    }
    async handleApplication(applicationId, status, userId) {
        const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
        const app = await this.prisma.eventApplication.findUnique({ where: { id: applicationId }, include: { event: true } });
        if (!ngo || !app || app.event.ngoId !== ngo.id)
            throw new common_1.UnauthorizedException();
        const updated = await this.prisma.eventApplication.update({
            where: { id: applicationId },
            data: { status }
        });
        if (status === 'APPROVED') {
            const vol = await this.prisma.volunteerProfile.findUnique({ where: { id: app.volunteerId }, include: { user: true } });
            if (vol) {
                await this.prisma.notification.create({
                    data: { userId: vol.user.id, title: 'Application Approved', content: `You were accepted for ${app.event.title}!` }
                });
            }
        }
        else if (status === 'REJECTED') {
            const vol = await this.prisma.volunteerProfile.findUnique({ where: { id: app.volunteerId }, include: { user: true } });
            if (vol) {
                await this.prisma.notification.create({
                    data: { userId: vol.user.id, title: 'Application Update', content: `Your application to ${app.event.title} was not accepted.` }
                });
            }
        }
        return updated;
    }
    async markAttendance(applicationId, hours, userId) {
        const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
        const app = await this.prisma.eventApplication.findUnique({ where: { id: applicationId }, include: { event: true } });
        if (!ngo || !app || app.event.ngoId !== ngo.id)
            throw new common_1.UnauthorizedException();
        const result = await this.prisma.$transaction(async (tx) => {
            const markedApp = await tx.eventApplication.update({
                where: { id: applicationId },
                data: { attended: true, hoursLogged: hours, status: 'COMPLETED' }
            });
            await tx.certificate.create({
                data: {
                    applicationId,
                    volunteerId: app.volunteerId,
                    downloadUrl: `/certificate/download/${applicationId}`
                }
            });
            const vol = await tx.volunteerProfile.findUnique({ where: { id: app.volunteerId }, include: { user: true } });
            if (vol) {
                await tx.notification.create({
                    data: { userId: vol.user.id, title: 'Event Completed!', content: `You earned ${hours} hours and a new certificate for ${app.event.title}!` }
                });
            }
            return markedApp;
        });
        return result;
    }
    async getNgoTeamEvents(userId) {
        const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
        if (!ngo)
            throw new common_1.UnauthorizedException('Access denied');
        return this.prisma.event.findMany({
            where: { ngoId: ngo.id },
            include: {
                applications: {
                    where: { status: 'APPROVED' },
                    include: { volunteer: { include: { user: true } } }
                }
            },
            orderBy: { date: 'desc' }
        });
    }
    async notifyFollowers(eventId, userId) {
        const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
        if (!ngo)
            throw new common_1.UnauthorizedException('Access denied');
        const event = await this.prisma.event.findUnique({ where: { id: eventId } });
        if (!event || event.ngoId !== ngo.id)
            throw new common_1.NotFoundException('Event not found');
        const followers = await this.prisma.follow.findMany({
            where: { followingId: ngo.id },
            include: { follower: { include: { user: true } } }
        });
        for (const follow of followers) {
            if (follow.follower?.user?.id) {
                await this.prisma.notification.create({
                    data: {
                        userId: follow.follower.user.id,
                        title: 'Volunteer Need',
                        content: `${ngo.name} needs more volunteers for their event: ${event.title}. Apply now!`
                    }
                });
            }
        }
        return { message: `Notified ${followers.length} followers.` };
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventsService);
//# sourceMappingURL=events.service.js.map