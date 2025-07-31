import { expect, describe, it } from "vitest";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

describe("Authenticate Use Case", () => {
  it("should be able to authenticated", async () => {
    const userRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUseCase(userRepository);

    await userRepository.create({
      name: "Ismael Patrick",
      email: "ismael@teste1.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      email: "ismael@teste1.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with wrong password", async () => {
    const userRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUseCase(userRepository);

    expect(() =>
      sut.execute({
        email: "ismael@teste1.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with wrong email", async () => {
    const userRepository = new InMemoryUserRepository();
    const sut = new AuthenticateUseCase(userRepository);

    await userRepository.create({
      name: "Ismael Patrick",
      email: "ismael@teste1.com",
      password_hash: await hash("123456", 6),
    });

    expect(() =>
      sut.execute({
        email: "ismael@teste1.com",
        password: "123123",
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
