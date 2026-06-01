import { Injectable, NotFoundException } from '@nestjs/common';
import { property_status_enum } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { UpdateKycStatusDto } from './dto/update-kyc-status.dto';
import { UpdatePropertyStatusDto } from './dto/update-property-status.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async updateKycStatus(
    adminUser: AuthenticatedUser,
    partnerProfileId: string,
    dto: UpdateKycStatusDto,
  ) {
    const id = this.parseBigIntParam(partnerProfileId, 'partnerProfileId');
    const reviewerId = BigInt(adminUser.id);

    const partner = await this.prisma.partnerProfile.findUnique({
      where: { id },
    });

    if (!partner) {
      throw new NotFoundException(`PartnerProfile #${partnerProfileId} not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.partnerProfile.update({
        where: { id },
        data: {
          kycStatus: dto.status,
          kycReviewerId: reviewerId,
          kycReviewedAt: new Date(),
        },
      });

      await this.createNotification(tx, {
        userId: updated.userId,
        type: dto.status === 'approved' ? 'partner_approved' : 'partner_rejected',
        title: dto.status === 'approved' ? 'Ho so doi tac da duoc duyet' : 'Ho so doi tac bi tu choi',
        body: dto.status === 'approved'
          ? 'Ho so doi tac cua ban da duoc phe duyet.'
          : 'Ho so doi tac cua ban chua duoc phe duyet. Vui long cap nhat thong tin.',
        entityType: 'partner',
        entityId: updated.id,
        data: { partnerId: Number(updated.id), status: dto.status },
      });

      return updated;
    });
  }

  async updatePropertyStatus(
    adminUser: AuthenticatedUser,
    propertyId: string,
    dto: UpdatePropertyStatusDto,
  ) {
    const id = this.parseBigIntParam(propertyId, 'propertyId');
    const reviewerId = BigInt(adminUser.id);

    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new NotFoundException(`Property #${propertyId} not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.property.update({
        where: { id },
        data: {
          status: dto.status,
          reviewerId,
          reviewedAt: new Date(),
        },
        include: { partner: true },
      });

      if (dto.status === property_status_enum.active || dto.status === property_status_enum.rejected) {
        await this.createNotification(tx, {
          userId: updated.partner.userId,
          type: dto.status === property_status_enum.active ? 'property_approved' : 'property_rejected',
          title: dto.status === property_status_enum.active ? 'Khach san da duoc duyet' : 'Khach san bi tu choi',
          body: dto.status === property_status_enum.active
            ? `${updated.name} da duoc phe duyet va co the mo ban.`
            : `${updated.name} chua duoc phe duyet. Vui long kiem tra va cap nhat thong tin.`,
          entityType: 'property',
          entityId: updated.id,
          data: { propertyId: Number(updated.id), status: dto.status },
        });
      }

      return updated;
    });
  }

  private async createNotification(
    db: { $executeRaw: PrismaService['$executeRaw'] },
    notification: {
      userId: bigint;
      type: string;
      title: string;
      body?: string | null;
      data?: unknown;
      entityType?: string | null;
      entityId?: bigint | null;
    },
  ) {
    const dataJson = JSON.stringify(notification.data ?? {});
    await db.$executeRaw`
      INSERT INTO notifications (
        user_id,
        type,
        channel,
        title,
        body,
        data,
        entity_type,
        entity_id
      )
      VALUES (
        ${notification.userId},
        ${notification.type},
        'in_app',
        ${notification.title},
        ${notification.body ?? null},
        ${dataJson}::jsonb,
        ${notification.entityType ?? null},
        ${notification.entityId ?? null}
      )
    `;
  }

  async fetchBookingReport() {
    const properties = await this.prisma.property.findMany({
      include: {
        partner: {
          include: {
            user: true,
          },
        },
        bookings: {
          include: {
            customer: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    const report = properties.map((property) => {
      const bookingsList = property.bookings;
      const totalBookings = bookingsList.length;

      let earnedRevenue = 0;
      let pendingRevenue = 0;
      let earnedCommission = 0;
      let pendingCommission = 0;
      let earnedPartnerPayout = 0;
      let pendingPartnerPayout = 0;

      const mappedBookings = bookingsList.map((booking) => {
        const total = Number(booking.totalAmount);
        const platformFee = Number(booking.platformFeeAmount);
        const partnerPayout = Number(booking.partnerPayoutAmount);

        const isPaid = booking.paymentStatus === 'paid';
        const isCancelled = booking.status === 'cancelled';

        if (!isCancelled) {
          if (isPaid) {
            earnedRevenue += total;
            earnedCommission += platformFee;
            earnedPartnerPayout += partnerPayout;
          } else {
            pendingRevenue += total;
            pendingCommission += platformFee;
            pendingPartnerPayout += partnerPayout;
          }
        }

        const today = new Date();
        const checkIn = new Date(booking.checkInDate);
        const checkOut = new Date(booking.checkOutDate);

        const isCompleted = booking.status === 'checked_out' || (booking.status === 'confirmed' && today > checkOut);
        const isCurrentStay = booking.status === 'checked_in' || (booking.status === 'confirmed' && today >= checkIn && today <= checkOut);
        const isFutureStay = booking.status === 'confirmed' && today < checkIn;

        return {
          id: Number(booking.id),
          bookingCode: booking.bookingCode,
          customerName: booking.customer.fullName,
          customerEmail: booking.customer.email,
          customerPhone: booking.customer.phone,
          priceLabel: booking.totalAmount.toString() + ' ' + booking.currency,
          checkInDate: booking.checkInDate.toISOString(),
          checkOutDate: booking.checkOutDate.toISOString(),
          nights: booking.numNights,
          adults: booking.numAdults,
          children: booking.numChildren,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          total,
          platformFee,
          partnerPayout,
          createdAt: booking.createdAt.toISOString(),
          specialRequests: booking.specialRequests,
          cancellationReason: booking.cancellationReason,
          isCompleted,
          isCurrentStay,
          isFutureStay,
        };
      });

      const currentStayCount = mappedBookings.filter(b => b.isCurrentStay).length;

      return {
        propertyId: Number(property.id),
        propertyName: property.name,
        city: property.city,
        address: property.address,
        partnerHotelName: property.name,
        partnerEmail: property.partner?.user?.email ?? null,
        propertyStatus: property.status,
        isArchived: !!property.deletedAt,
        archivedLabel: property.deletedAt ? 'Archived' : null,
        isActiveHotel: property.status === 'active' && !property.deletedAt,
        currentStayCount,
        totalBookings,
        earnedRevenue,
        pendingRevenue,
        earnedCommission,
        pendingCommission,
        earnedPartnerPayout,
        pendingPartnerPayout,
        bookings: mappedBookings,
      };
    });

    return report;
  }

  async markBookingPaid(adminUser: AuthenticatedUser, bookingIdStr: string) {
    const id = this.parseBigIntParam(bookingIdStr, 'bookingId');
    return this.prisma.booking.update({
      where: { id },
      data: {
        paymentStatus: 'paid',
      },
    });
  }

  async cancelBooking(adminUser: AuthenticatedUser, bookingIdStr: string) {
    const id = this.parseBigIntParam(bookingIdStr, 'bookingId');
    return this.prisma.booking.update({
      where: { id },
      data: {
        status: 'cancelled',
        cancelledById: BigInt(adminUser.id),
        cancelledAt: new Date(),
      },
    });
  }

  async rejectCancelBooking(adminUser: AuthenticatedUser, bookingIdStr: string) {
    const id = this.parseBigIntParam(bookingIdStr, 'bookingId');
    return this.prisma.booking.update({
      where: { id },
      data: {
        status: 'confirmed',
      },
    });
  }

  private parseBigIntParam(value: string, paramName: string): bigint {
    if (!/^\d+$/.test(value)) {
      throw new NotFoundException(`${paramName} must be a positive integer`);
    }
    return BigInt(value);
  }
}
