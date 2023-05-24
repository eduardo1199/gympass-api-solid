import { hash } from 'bcryptjs'

interface RegisterUserRequest {
  name: string
  email: string
  password: string
}

export class RegisterUserCase {
  constructor(private usersRepository: any) {}

  async execute({ name, email, password }: RegisterUserRequest) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.sameEmailByUser(email)

    if (userWithSameEmail) {
      throw new Error('E-mail already registered!')
    }

    await this.usersRepository.create({ email, name, password_hash })
  }
}
