import orchestrator from "tests/orchestrator.js";
import { version as uuidVersion } from "uuid";
beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    const url = "http://localhost:3000/api/v1/users";

    test("With unique and valid data", async () => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "teste",
          email: "teste@teste.com",
          password: "teste",
        }),
      });
      expect(response.status).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "teste",
        email: "teste@teste.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });
      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    });

    test("With duplicated 'email'", async () => {
      const response1 = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado",
          email: "duplicado1@teste.com",
          password: "teste",
        }),
      });
      expect(response1.status).toBe(201);

      const response2 = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "emailduplicado2",
          email: "Duplicado1@teste.com",
          password: "teste",
        }),
      });
      expect(response2.status).toBe(400);

      const responseBody = await response2.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O campo email já está em uso.",
        action: "Utilize outro email para cadastro.",
        status_code: 400,
      });
    });
    test("With duplicated 'username'", async () => {
      const response1 = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usernameduplicado",
          email: "duplicado2@teste.com",
          password: "teste",
        }),
      });
      expect(response1.status).toBe(201);

      const response2 = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "usernameduplicado",
          email: "duplicado3@teste.com",
          password: "teste",
        }),
      });
      expect(response2.status).toBe(400);

      const responseBody = await response2.json();
      expect(responseBody).toEqual({
        name: "ValidationError",
        message: "O campo username já está em uso.",
        action: "Utilize outro username para cadastro.",
        status_code: 400,
      });
    });
  });
});
