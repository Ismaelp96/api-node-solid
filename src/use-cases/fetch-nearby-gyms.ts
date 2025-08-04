import { Gym } from "generated/prisma";
import { GymsRepository } from "@/repositories/gyms-repository";

interface FeatchNearbyGymsUseCaseRequest {
  userLatitude: number;
  userLongitude: number;
}

interface FeatchNearbyGymsUseCaseResponse {
  gyms: Gym[];
}

export class FeatchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLongitude,
    userLatitude,
  }: FeatchNearbyGymsUseCaseRequest): Promise<FeatchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    });
    return { gyms };
  }
}
