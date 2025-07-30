import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { RegisterUserCase } from "@/use-cases/register";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";

export async function register(req: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
  });

  const { email, name, password } = registerBodySchema.parse(req.body);

  try {
    const prismaUsersRepository = new PrismaUsersRepository();
    const registerUserCase = new RegisterUserCase(prismaUsersRepository);

    await registerUserCase.execute({ email, name, password });
  } catch (error) {
    return reply.status(409).send();
  }

  return reply.status(201).send();
}
