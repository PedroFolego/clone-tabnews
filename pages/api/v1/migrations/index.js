import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";

export default async function migrations(req, res) {
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(req.method)) {
    return res.status(405).json({
      error: `Method "${req.method}" not allowed`,
    });
  }
  let dbClient;
  try {
    dbClient = await database.getNewClient();

    const defaultMigrationOptions = {
      dbClient,
      dryRun: true,
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
    };
    if (req.method === "GET") {
      const pendingMigrations = await migrationRunner(defaultMigrationOptions);

      return res.status(200).json(pendingMigrations);
    }
    if (req.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return res.status(201).json(migratedMigrations);
      }
      return res.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}
