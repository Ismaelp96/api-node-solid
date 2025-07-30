import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";

interface RegisterUseCaseRequest {
  name: string;
  password: string;
  email: string;
}

export class RegisterUserCase {
  constructor(private usersRepository: any) {}
  async execute({ password, email, name }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new Error("E-mail already exists.");
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    });
  }
}
