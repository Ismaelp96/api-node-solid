import req from "supertest";

import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });
  afterAll(async () => {
    await app.close();
  });
  it("should be able to search a gym", async () => {
    const { token } = await createAndAuthenticateUser(app);

    await req(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Near Gym",
        description: "",
        phone: "",
        latitude: 0,
        longitude: 0,
      });

    await req(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Far Gym",
        description: "",
        phone: "",
        latitude: -27.2092052,
        longitude: -49.6401091,
      });

    const response = await req(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: 0,
        longitude: 0,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "Near Gym",
      }),
    ]);
  });
});
