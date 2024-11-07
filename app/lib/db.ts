import { Pool } from "pg";

export const pool = new Pool({
  connectionString:process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false }, // Use this only if needed for remote connections
});

export async function testDatabaseConnection() {
  try {
    // Perform a simple query to check connection
    await pool.query("SELECT 1;");
    console.log("🚀 Database connection successful!");
  } catch (error) {
    console.error("🚨 Database connection failed:", error);
  }
}

// Call this function to check the connection on server startup or in a specific route
testDatabaseConnection();

// initialise first tables
// async function createTasksTable() {
//   await pool.query(`
//     ALTER TABLE users
// ADD COLUMN passwordHash TEXT;
//   `);
// }
// createTasksTable()



export const query = (text:string, params?:(string | number | boolean | null)[]) => pool.query(text, params);
