import { CheckIn } from "generated/prisma";
import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface CheckInUseCaseRequest {
  userId: string;
  gymId: string;
}
interface CheckInUseCaseResponse {
  checkIn: CheckIn;
}

export class CheckInUseCase {
  constructor(private checkinsRepository: CheckInsRepository) {}

  async execute({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const checkInOnSameDay = await this.checkinsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    );

    if (checkInOnSameDay) {
      throw new Error();
    }
    const checkIn = await this.checkinsRepository.create({
      gym_id: gymId,
      user_id: userId,
    });
    if (!checkIn) {
      throw new Error("");
    }
    return { checkIn };
  }
}
