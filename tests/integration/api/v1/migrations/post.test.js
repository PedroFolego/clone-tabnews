import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      const url = "http://localhost:3000/api/v1/migrations";

      test("For the first time", async () => {
        const response1 = await fetch(url, {
          method: "POST",
        });
        expect(response1.status).toBe(201);

        const responseBody = await response1.json();
        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBeGreaterThan(0);
      });
      test("For the second time", async () => {
        const response2 = await fetch(url, {
          method: "POST",
        });
        expect(response2.status).toBe(200);

        const response2Body = await response2.json();
        expect(Array.isArray(response2Body)).toBe(true);
        expect(response2Body.length).toBe(0);
      });
    });
  });
});
