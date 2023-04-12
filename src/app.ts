import fastify from 'fastify'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

console.log(prisma)

export const app = fastify({
  logger: true,
})
