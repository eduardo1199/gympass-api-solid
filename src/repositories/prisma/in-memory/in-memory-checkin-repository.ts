import { CheckIn, Prisma } from '@prisma/client'
import { CheckInRepository } from '../checkin-repository'
import { randomUUID } from 'node:crypto'

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

  async findByUserId(userId: string, date: Date): Promise<CheckIn | null> {
    const checkOnSameDate = this.checkIns.find(
      (checkIn) => checkIn.user_id === userId,
    )

    if (!checkOnSameDate) return null

    return checkOnSameDate
  }
}
