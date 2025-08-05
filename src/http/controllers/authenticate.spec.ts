import req from "supertest";

import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Authenticate (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to authenticate", async () => {
    await req(app.server).post("/users").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const res = await req(app.server).post("/sessions").send({
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      token: expect.any(String),
    });
  });
});
