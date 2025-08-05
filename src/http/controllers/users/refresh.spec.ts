import req from "supertest";

import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Refresh Token (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to refresh a token", async () => {
    await req(app.server).post("/users").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const authResponse = await req(app.server).post("/sessions").send({
      email: "johndoe@example.com",
      password: "123456",
    });

    const cookies = authResponse.get("Set-Cookie");

    if (!cookies) {
      return null;
    }

    const res = await req(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      token: expect.any(String),
    });
    expect(res.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
