import { pool } from "./client";

async function seed() {
  console.log("Starting seed...");

  const result = await pool.query("SELECT NOW()");

  console.log(result.rows);

  await pool.end();
}

seed().catch(console.error);