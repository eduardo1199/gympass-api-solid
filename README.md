# GymPass

## Projeto backend desenvolvido em NodeJS para capacitação de API Rest. Introdução de conceitos de SOLID, Token, Refresh Token, JWT, Docker

## Docker comands help

view containers run

<aside>
💡 docker ps ou docker ps -a

</aside>

run container 

<aside>
💡 docker start {isdContainer} ou {nome_container}

</aside>

## image run docker database postgres

code run terminal

<aside>
💡 docker run --name api-solid-pg -e POSTGRESQL_USERNAME=docker -e POSTGRESQL_PASSWORD=docker -e POSTGRESQL_DATABASE=api_solid -p 5432:5432 bitnami/postgresql

</aside>

## 

## Use Case CheckIn

Criamos o caso de uso para criação de checkIn. Primento a implementação da interface do repository. Apenas com método create.

```
import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
}
```

Em seguida, implementamos o método dentro do repositório.

```
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { CheckInRepository } from './checkin-repository'

export class PrismaCheckInRepository implements CheckInRepository {
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
```

Em seguida, com a classe do repositório do prisma crirado, podemos fazer o caso de uso de register de um check-in. Implementando o caso de uso.

```
interface CheckInUseCaseRequest {
  userId: string
  gymId: string
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    gymId,
    userId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkIn = await this.checkInRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return {
      checkIn,
    }
  }
}
```

Com o caso de uso implementado, podemos desenvolver um teste unitário para esse caso de uso, para isso implementamos um inMemoryRepository.

```
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
}
```

Em seguida, desenvolvemos o teste unitário para verificar o nosso teste de uso.

```
let checkInRepository: InMemoryCheckInRepository
let createCheckInUseCase: CheckInUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInRepository()
    createCheckInUseCase = new CheckInUseCase(checkInRepository)
  })

  it('should be able to check-in', async () => {
    const checkIn = await createCheckInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.checkIn.id).toEqual(expect.any(String))
  })
})
```

## TDD e Mocking

Test-driving develop (TDD) é uma forma de realizar casos de uso na qual existem alguma caso de requisito de validação, como por exemplo, uma regra de negócio. Como é implementado ? primeiro, seguimos o conceito de red, green, refactory. 

red primeiro escrevemos o teste para aquele requisito funcional, já sabendo que não existe uma validação no nosso caso de uso que capture esse erro, ai nesse caso o teste quebra. 

O green vamos realizar uma modificação no caso de uso, de tal forma que o teste passe, mas com o mínino de modificações possíveis no repositório ou caso de uso., ou seja, damos muito mais atenção para resolve o problema.

O refactory é basicamente refatorar o código causando adaptações mais severas ou mais rigoras no repositório ou caso de uso, seguindo a mesma lógica abordada no caso green.

<aside>
💡 Escrevemos o teste abaixo para o caso red, verificando se para nosso caso de uso em que o usuário realize mais de um check-in no mesmo dia (Na qual não é possível).

</aside>

```
it('should not be able to check-in in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 7, 22))

    await createCheckInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    await expect(
      async () =>
        await createCheckInUseCase.execute({
          gymId: 'gym-01',
          userId: 'user-01',
        }),
    ).rejects.toBeInstanceOf(Error)
  })
```

```
beforeEach(() => {
  checkInRepository = new InMemoryCheckInRepository()
  createCheckInUseCase = new CheckInUseCase(checkInRepository)
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})
```

<aside>
💡 O método vi.useRealTimers() e vi.useFakeTimers() são mocks do vitest para cadastrar uma data sempre no formato passado. Isso evita do teste quebrar caso seja trabalhado com datas localtime, porque o teste nem sempre executa no mesmo instante de tempo.

</aside>

<aside>
💡 Abaixo escrevemos outro teste, verificando se é possível realizar check-in em dias diferentes. Porém, nesse ponto de partida, deu erro porque apenas verificamos se o ID do usuário existe. Precisamos refatorar o código de tal forma que funcione o teste.

</aside>

```
it('should not be able to check-in in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 7, 22))

    await createCheckInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    vi.setSystemTime(new Date(2023, 7, 23))

    const checkIn = await createCheckInUseCase.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.checkIn.id).toEqual(expect.any(String))
  })
```

## Validando data de check-in

Para validar data do check-in, precisamos introduzir um método dentro do repositório chamado findByUserIdOnDate, que compara se a data de criação daquele check-in está entre as datas que já possui um check-in naquele dia. Isso devido a regra de negocio que não podemos ter 2 check-ins realizados pelo menos usuário no mesmo dia.

```
async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkOnSameDate = this.checkIns.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkOnSameDate) return null

    return checkOnSameDate
  }
```

Utilizamos o dayjs que é uma biblioteca para lidar com datas. Além disso, foi implementado o repositório de gym. Devido ao fato que precisamos validar se o check-in está sendo realizado a menos de 100m da academia.

<aside>
💡 const gym = await *this*.gymsRepository.findById(*gymId*)

</aside>