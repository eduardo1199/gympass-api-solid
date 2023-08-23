import { prisma } from '@/lib/prisma'
import { CheckIn, Prisma } from '@prisma/client'
import { CheckInRepository } from './checkin-repository'

export class PrismaCheckInRepository implements CheckInRepository {
  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    return null
  }

  async create({ gym_id, user_id }: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data: {
        gym_id,
        user_id,
      },
    })

    return checkIn
  }
}
