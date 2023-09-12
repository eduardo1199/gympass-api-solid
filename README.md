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

## Validando distância de check-in

Aqui adicionamos uma função para calcular a distância entre coordendas da latitute de longitude entre o check-in da acadamia e a academia. Criamos um teste para falhar caso o checkin esteja acima de 100m da academia.

```
it('should not be able to check-in in on distance gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      description: 'Gym',
      title: 'Gym test',
      latitude: new Decimal(-5.8344579),
      longitude: new Decimal(-35.2075184),
      phone: '(84)846161861',
    })

    expect(
      createCheckInUseCase.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -5.8980271,
        userLongitude: -35.2697794,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
```

```
const MAX_DISTANCE_BETWEEN_COORDINATES = 0.1 // KM UNIT

    if (distance > MAX_DISTANCE_BETWEEN_COORDINATES) {
      throw new Error()
    }
```

## Caso de uso de criação da academia

Criamos um caso de uso de criação de uma academia, bem como seu teste unitário e seu método create no repositório.

```
export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    description,
    latitude,
    longitude,
    phone,
    title,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      latitude,
      longitude,
      title,
      description,
      phone,
    })

    return { gym }
  }
}
```

```
it('should be able to create gym', async () => {
    const { gym } = await createGymUseCase.execute({
      title: 'Javascript Gym',
      latitude: -5.8344579,
      longitude: -35.2075184,
      description: null,
      phone: null,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
```

## Caso de uso de histórico de checkIns

Para esse caso de uso, basicamente através do ID do usuário seremos capazes de retornamos todos os check-ins realizados desse usuário de referência.

<aside>
💡 Case use

</aside>

```
export class FetchUserCheckInsUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInsUseCaseRequest): Promise<FetchUserCheckInsResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(userId, page)

    return {
      checkIns,
    }
  }
}
```

Desevolvemos o teste unitário.

<aside>
💡 Primeiro teste para verificar se possui os dois check-ins criados pelo mesmo usuário.
Segundo teste, para verificar a paginação implementada no repository.

</aside>

```
it('should be able to fetch check-in history', async () => {
    await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkIns } = await fetchUserCheckInsUseCase.execute({
      userId: 'user-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-01' }),
      expect.objectContaining({ gym_id: 'gym-02' }),
    ])
  })

  it('should be able to fetch paginated check-ins history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInRepository.create({
        gym_id: `gym-${i}`,
        user_id: 'user-01',
      })
    }

    const { checkIns } = await fetchUserCheckInsUseCase.execute({
      userId: 'user-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-21' }),
      expect.objectContaining({ gym_id: 'gym-22' }),
    ])
  })
```

<aside>
💡 InMemoryRepository apresenta um novo método implementado na interface de CheckInRepository para buscar de forma paginada os check-ins.

</aside>

```
async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    const checkIns = this.checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)

    return checkIns
  }
```

## Caso de uso de métricas

Desenvolvemos o caso de uso para buscar a quantitdade de check-ins realizados pelo usuário. 

<aside>
💡 Foi necessário implementar mais um método no repositório para buscar a quantidade de métricas realizadas.

</aside>

```
export class GetUserMetricsUseCaseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    userId,
  }: GetUserMetricsUseCaseCaseRequest): Promise<GetMetricsUseCaseResponse> {
    const checkInsCount = await this.checkInRepository.countByUserId(userId)

    return {
      checkInsCount,
    }
  }
}
```

## Caso de uso de busca de academias

Implementação do caso de uso de busca pagina de academias, criamos um métodos para pesquisar uma academia através do título.

```
export class SearchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    search,
    page,
  }: SearchGymsUseCaseRequest): Promise<SearchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findMany(search, page)

    return { gyms }
  }
}
```

Implementação do método no repositório.

```
async findMany(search: string, page: number): Promise<Gym[]> {
    const gyms = this.items
      .filter((gym) => gym.title.includes(search))
      .slice((page - 1) * 20, page * 20)

    return gyms
  }
```

## Caso de uso de academias próximas

Implementação do caso de uso de buscar academias mais próxima da minha localização. 

```
export class FetchNearbyGyms {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitute,
    userLongitude,
  }: FetchNearbyGymsRequest): Promise<FetchNearbyGymsResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitute,
      longitude: userLongitude,
    })

    return { gyms }
  }
}
```

Implementação do método de calculo de distância, para isso filtramos as academias que apresentam uma distância menor que 10km

```
async findManyNearby({
    latitude,
    longitude,
  }: findManyNearby): Promise<Gym[]> {
    const gyms = this.items.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude,
          longitude,
        },
        {
          latitude: Number(gym.latitude),
          longitude: Number(gym.longitude),
        },
      )

      return distance < 10
    })

    return gyms
  }
```

## Caso de uso de validação de check-in

Implementação do caso de uso de validação de check-in. Na primeira etapa, primeiros precisamos alterar a data de validação do check-in quando for passado um id de um check-in existente. Caso não existe, é disparado um erro de not exist. 

```
export class ValidateCheckInUseCase {
  constructor(private checkInRepository: CheckInRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkIn = await this.checkInRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFountError('Check-in not exist')
    }

    checkIn.validated_at = new Date()

    await this.checkInRepository.save(checkIn)

    return {
      checkIn,
    }
  }
}
```

Implementação do método save para alterar a data de validação do check-in caso exista.

```
async save(checkIn: CheckIn): Promise<CheckIn> {
  const checkInIndex = this.checkIns.findIndex(
    (item) => item.id === checkIn.id,
  )

  if (checkInIndex >= 0) {
    this.checkIns[checkInIndex] = checkIn
  }

  return checkIn
}
```

Para segunda validação, precisamos verificar se a data de validação do check-in não excedeu 20 minutos da data de criação do check-in. Caso isso ocorra, é necessário disparar um erro. Então, após buscar o check-in pelo ID, verificamos qual a diferença entre a data atual e a data de criação do check-in em minutos, usando dayjs.

```
const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
  checkIn.created_at,
  'minutes',
)

if (distanceInMinutesFromCheckInCreation > 20) {
  throw new LateCheckInValidate()
}
```

Com todas essas validações, desenvolvemos os testes unitários.

```
it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await validateCheckInUseCase.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInRepository.checkIns[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    expect(() =>
      validateCheckInUseCase.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFountError)
  })

  it('should not be able to validate the check-in afeter 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2023, 8, 12, 10, 23))

    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const twentyOneMinutesOnMS = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesOnMS)

    await expect(() =>
      validateCheckInUseCase.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(LateCheckInValidate)
  })
```