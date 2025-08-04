import { beforeEach, describe, expect, it } from "vitest";

import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";

let gymRepository: InMemoryGymsRepository;

let sut: CreateGymUseCase;

describe("Create gym Use Case", () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymRepository);
  });

  it("should be able to create gym", async () => {
    const { gym } = await sut.execute({
      title: "Gym javaScript",
      description: "",
      phone: "",
      latitude: 0,
      longitude: 0,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
