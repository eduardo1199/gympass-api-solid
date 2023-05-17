import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class PrismaUsersRepository {
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

  async sameEmailByUser(email: string) {
    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    return userWithSameEmail
  }
}
