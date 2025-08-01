import { describe, beforeEach, it, expect, vi, afterEach } from "vitest";

import { CheckInUseCase } from "./check-in";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-in-repository";

let checkInRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase;

describe("Check in Use Case", () => {
  beforeEach(() => {
    checkInRepository = new InMemoryCheckInsRepository();
    sut = new CheckInUseCase(checkInRepository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0));
    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
    });
    console.log("data", checkIn.created_at);
    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0));
    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
    });

    expect(() =>
      sut.execute({
        userId: "user-01",
        gymId: "gym-01",
      }),
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2025, 0, 20, 8, 0, 0));
    await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
    });
    vi.setSystemTime(new Date(2025, 0, 21, 8, 0, 0));

    const { checkIn } = await sut.execute({
      userId: "user-01",
      gymId: "gym-01",
    });
    expect(checkIn.id).toEqual(expect.any(String));
  });
});
