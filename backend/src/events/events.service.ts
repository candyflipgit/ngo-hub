import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './events.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateEventDto) {
    const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
    if (!ngo) throw new UnauthorizedException('Only NGOs can create events');

    // Automatically trigger analytics
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
    
    // Simulate feed post auto-generation
    await this.prisma.post.create({
      data: {
        ngoId: ngo.id,
        content: `We just launched a new event: ${dto.title}. Join us!`,
      }
    });

    return newEvent;
  }

  async deactivateEvent(eventId: string, userId: string) {
    const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
    if (!ngo) throw new UnauthorizedException('Access denied');

    const event = await this.prisma.event.findFirst({ where: { id: eventId, ngoId: ngo.id } });
    if (!event) throw new NotFoundException('Event not found or unauthorized');

    // Extract hours from description (e.g., "5 hours", "2.5 hrs", "Duration: 10 hr")
    const hoursMatch = event.description.match(/(\d+(\.\d+)?)\s*(hour|hr|hrs)/i);
    const extractedHours = hoursMatch ? parseFloat(hoursMatch[1]) : 0;

    await this.prisma.$transaction(async (tx) => {
      // 1. Deactivate event
      await tx.event.update({
        where: { id: eventId },
        data: { isActive: false }
      });

      // 2. Find all APPROVED applications for this event
      const approvedApps = await tx.eventApplication.findMany({
        where: { eventId, status: 'APPROVED' },
        include: { volunteer: { include: { user: true } } }
      });

      // 3. Update each app to COMPLETED and log the extracted hours
      for (const app of approvedApps) {
        await tx.eventApplication.update({
          where: { id: app.id },
          data: { 
            status: 'COMPLETED', 
            hoursLogged: extractedHours, 
            attended: true 
          }
        });

        // 4. Automatically generate a certificate record
        await tx.certificate.create({
          data: {
            applicationId: app.id,
            volunteerId: app.volunteerId,
            downloadUrl: `/certificate/download/${app.id}`
          }
        });

        // 5. Notify the volunteer
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

  async apply(eventId: string, userId: string) {
    const volunteer = await this.prisma.volunteerProfile.findUnique({ where: { userId } });
    if (!volunteer) throw new UnauthorizedException('Only Volunteers can apply');

    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Event not found');
    if (!event.isActive) throw new UnauthorizedException('This event is no longer active and cannot accept new applications.');

    return this.prisma.eventApplication.create({
      data: {
        eventId,
        volunteerId: volunteer.id,
        status: 'PENDING'
      },
    });
  }

  async getEventApplications(eventId: string, userId: string) {
    const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
    if (!ngo) throw new UnauthorizedException('Access denied');

    const event = await this.prisma.event.findFirst({ where: { id: eventId, ngoId: ngo.id } });
    if (!event) throw new NotFoundException('Event not found or unauthorized access');

    return this.prisma.eventApplication.findMany({
      where: { eventId },
      include: { volunteer: { include: { user: true } } }
    });
  }

  async handleApplication(applicationId: string, status: 'APPROVED' | 'REJECTED', userId: string) {
     const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
     const app = await this.prisma.eventApplication.findUnique({ where: { id: applicationId }, include: { event: true }});
     
     if (!ngo || !app || app.event.ngoId !== ngo.id) throw new UnauthorizedException();
     
     const updated = await this.prisma.eventApplication.update({
        where: { id: applicationId },
        data: { status }
     });

     if (status === 'APPROVED') {
        const vol = await this.prisma.volunteerProfile.findUnique({where:{id:app.volunteerId}, include:{user:true}});
        if (vol) {
           await this.prisma.notification.create({
              data: { userId: vol.user.id, title: 'Application Approved', content: `You were accepted for ${app.event.title}!` }
           });
        }
     } else if (status === 'REJECTED') {
        const vol = await this.prisma.volunteerProfile.findUnique({where:{id:app.volunteerId}, include:{user:true}});
        if (vol) {
           await this.prisma.notification.create({
              data: { userId: vol.user.id, title: 'Application Update', content: `Your application to ${app.event.title} was not accepted.` }
           });
        }
     }

     return updated;
  }

   async markAttendance(applicationId: string, hours: number, userId: string) {
     const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
     const app = await this.prisma.eventApplication.findUnique({ where: { id: applicationId }, include: { event: true }});
     
     if (!ngo || !app || app.event.ngoId !== ngo.id) throw new UnauthorizedException();
     
     // Transaction to update attendance + volunteer total hours + issue certificate
     const result = await this.prisma.$transaction(async (tx) => {
        const markedApp = await tx.eventApplication.update({
           where: { id: applicationId },
           data: { attended: true, hoursLogged: hours, status: 'COMPLETED' }
        });

        // Trigger Certificate Generation dynamically via DB trigger logic handled at application layer
        await tx.certificate.create({
           data: {
              applicationId,
              volunteerId: app.volunteerId,
              downloadUrl: `/certificate/download/${applicationId}`
           }
        });

        // Notify Volunteer
        const vol = await tx.volunteerProfile.findUnique({where:{id:app.volunteerId}, include:{user:true}});
        if (vol) {
           await tx.notification.create({
              data: { userId: vol.user.id, title: 'Event Completed!', content: `You earned ${hours} hours and a new certificate for ${app.event.title}!` }
           });
        }

        return markedApp;
     });
     return result;
  }

  async getNgoTeamEvents(userId: string) {
     const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
     if (!ngo) throw new UnauthorizedException('Access denied');

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

  async notifyFollowers(eventId: string, userId: string) {
     const ngo = await this.prisma.ngoProfile.findUnique({ where: { userId } });
     if (!ngo) throw new UnauthorizedException('Access denied');

     const event = await this.prisma.event.findUnique({ where: { id: eventId } });
     if (!event || event.ngoId !== ngo.id) throw new NotFoundException('Event not found');

     const followers = await (this.prisma as any).follow.findMany({
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
}
