import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { UsersRepository } from "@/repositories/users-repository";

interface RegisterUseCaseRequest {
  name: string;
  password: string;
  email: string;
}

export class RegisterUserCase {
  constructor(private usersRepository: UsersRepository) {}
  async execute({ password, email, name }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6);

    const userWithSameEmail = await this.usersRepository.findByEmail(email);
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
