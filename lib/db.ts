import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
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

// export async function createUserTable() {
//   await pool.query(`
//     CREATE TABLE users (
//       id SERIAL PRIMARY KEY,
//       email VARCHAR(255) UNIQUE NOT NULL,
//       passwordHash TEXT NOT NULL
//     );
//   `);
// }

// createUserTable();




export const query = (
  text: string,
  params?: (string | number | boolean | null)[]
) => pool.query(text, params);
