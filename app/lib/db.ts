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

// initialise first tasks tables
// async function createTasksTable() {
//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS tasks (
//       id SERIAL PRIMARY KEY,
//       text VARCHAR(255) NOT NULL,
//       completed BOOLEAN NOT NULL DEFAULT FALSE,
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
//   `);
// }
// createTasksTable()

// async function createUsersTable() {
  // CREATE TABLE verification_token
  // (
  //   identifier TEXT NOT NULL,
  //   expires TIMESTAMPTZ NOT NULL,
  //   token TEXT NOT NULL,
   
  //   PRIMARY KEY (identifier, token)
  // );
   
  // CREATE TABLE accounts
  // (
  //   id SERIAL,
  //   "userId" INTEGER NOT NULL,
  //   type VARCHAR(255) NOT NULL,
  //   provider VARCHAR(255) NOT NULL,
  //   "providerAccountId" VARCHAR(255) NOT NULL,
  //   refresh_token TEXT,
  //   access_token TEXT,
  //   expires_at BIGINT,
  //   id_token TEXT,
  //   scope TEXT,
  //   session_state TEXT,
  //   token_type TEXT,
   
  //   PRIMARY KEY (id)
  // );
   
  // CREATE TABLE sessions
  // (
  //   id SERIAL,
  //   "userId" INTEGER NOT NULL,
  //   expires TIMESTAMPTZ NOT NULL,
  //   "sessionToken" VARCHAR(255) NOT NULL,
   
  //   PRIMARY KEY (id)
  // );
   
  // CREATE TABLE users
  // (
  //   id SERIAL,
  //   name VARCHAR(255),
  //   email VARCHAR(255),
  //   "emailVerified" TIMESTAMPTZ,
  //   image TEXT,
   
  //   PRIMARY KEY (id)
  // );

// createUsersTable()

// add passwordHash to users table
// async function addUsersToTable() {
//   await pool.query(`
//     ALTER TABLE users
// ADD COLUMN passwordHash TEXT;
//   `);
// }
// addUsersToTable()

// add users to tasks table
// async function addUsersToTasks() {
//   await pool.query(`
//    ALTER TABLE tasks
//    ADD COLUMN user_id INT,
//    ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
//   `);
// }
// addUsersToTasks()



export const query = (text:string, params?:(string | number | boolean | null)[]) => pool.query(text, params);
