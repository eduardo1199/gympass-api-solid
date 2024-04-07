import { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const fetchUserMetricsUseCase = makeGetUserMetricsUseCase()

  const userId = request.user.sub

  const { checkInsCount } = await fetchUserMetricsUseCase.execute({
    userId,
  })

  return reply.status(200).send({
    checkInsCount,
  })
}
