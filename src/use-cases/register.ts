import { hash } from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";

interface RegisterUseCaseRequest {
  name: string;
  password: string;
  email: string;
}

export async function registerUseCase({
  password,
  email,
  name,
}: RegisterUseCaseRequest) {
  const password_hash = await hash(password, 6);

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userWithSameEmail) {
    throw new Error("E-mail already exists.");
  }

  const prismaUsersRepository = new PrismaUsersRepository();
  await prismaUsersRepository.create({
    name,
    email,
    password_hash,
  });
}
