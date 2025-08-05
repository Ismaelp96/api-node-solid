import { FastifyReply, FastifyRequest } from "fastify";
import { uuid, z } from "zod";

import { makeValidateCheckInUseCase } from "@/use-cases/factories/make-validate-check-in-use-case";

export async function validate(req: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    checkInId: uuid(),
  });

  const { checkInId } = createCheckInParamsSchema.parse(req.params);

  const validateCheckInUseCase = makeValidateCheckInUseCase();
  await validateCheckInUseCase.execute({
    checkInId,
  });

  return reply.status(204).send();
}
