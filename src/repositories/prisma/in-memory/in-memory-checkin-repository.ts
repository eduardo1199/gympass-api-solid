import { CheckIn, Prisma } from '@prisma/client'
import { CheckInRepository } from '../checkin-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInRepository implements CheckInRepository {
  public checkIns: CheckIn[] = []

  async create({
    gym_id,
    user_id,
    validated_at,
  }: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: randomUUID(),
      created_at: new Date(),
      user_id,
      gym_id,
      validated_at: validated_at ? new Date(validated_at) : null,
    }

    this.checkIns.push(checkIn)

    return checkIn
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkOnSameDate = this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        (checkInDate.isAfter(startOfTheDay) &&
          checkInDate.isBefore(endOfTheDay)) ||
        checkInDate.isSame(startOfTheDay) ||
        checkInDate.isSame(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkOnSameDate) return null

    return checkOnSameDate
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = this.checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)

    return checkIns
  }
}
