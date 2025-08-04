import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { describe, beforeEach, it, expect } from "vitest";
import { FeatchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FeatchNearbyGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FeatchNearbyGymsUseCase(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      description: "",
      phone: "",
      latitude: 0,
      longitude: 0,
    });
    await gymsRepository.create({
      title: "Far Gym",
      description: "",
      phone: "",
      latitude: -27.2092052,
      longitude: -49.6401091,
    });

    const { gyms } = await sut.execute({
      userLatitude: 0,
      userLongitude: 0,
    });
    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
