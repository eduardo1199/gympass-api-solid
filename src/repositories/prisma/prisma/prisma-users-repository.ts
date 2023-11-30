import { prisma } from '@/lib/prisma'
import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findByUserId(userId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    return user
  }

  async create({ name, password_hash, email }: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data: {
        name,
        password_hash,
        email,
      },
    })

    return user
  }

  async findByEmail(email: string) {
    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return userWithSameEmail
  }
}
