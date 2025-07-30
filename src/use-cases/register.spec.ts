import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUserRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("register Use Case", () => {
  it("should be able to register", async () => {
    const userRepository = new InMemoryUserRepository();
    const registerUseCase = new RegisterUseCase(userRepository);

    const { user } = await registerUseCase.execute({
      name: "Ismael",
      email: "ismael@teste1.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it("should hash user password upon registration", async () => {
    const userRepository = new InMemoryUserRepository();
    const registerUseCase = new RegisterUseCase(userRepository);

    const { user } = await registerUseCase.execute({
      name: "Ismael",
      email: "ismael@teste1.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash,
    );
    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const userRepository = new InMemoryUserRepository();
    const registerUseCase = new RegisterUseCase(userRepository);

    const email = "johndoe@example.com";

    await registerUseCase.execute({
      name: "Ismael",
      email,
      password: "123456",
    });
    expect(() =>
      registerUseCase.execute({
        name: "Ismael",
        email,
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
