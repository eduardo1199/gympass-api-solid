import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQueryScheme = z.object({
    page: z.coerce.number().min(1).default(1),
  })

  const { page } = checkInHistoryQueryScheme.parse(request.query)

  const fetchUserCheckInHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()

  const userId = request.user.sub

  const { checkIns } = await fetchUserCheckInHistoryUseCase.execute({
    page,
    userId,
  })

  return reply.status(200).send({
    checkIns,
  })
}
