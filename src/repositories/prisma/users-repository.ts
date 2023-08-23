import { Prisma, User } from '@prisma/client'

export interface UsersRepository {
  create(data: Prisma.UserCreateInput): Promise<User>
  findByUserId(userId: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
}
