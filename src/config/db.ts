import { Pool } from "pg";
import config from "./config";

export const pool=new Pool({
    connectionString:config.connection_string
})

export const initDB=async()=>{

    await pool.query(`
          CREATE TABLE IF NOT EXISTS users(
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(150) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'contributor'
          CHECK(role IN ('contributor','maintainer')),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ) 
        `)
    await pool.query(`
          CREATE TABLE IF NOT EXISTS issues(
          id SERIAL PRIMARY KEY,
          title VARCHAR(150) NOT NULL,
          description TEXT
          CHECK(char_length(description) >= 20) NOT NULL,
          type TEXT
          CHECK(type IN ('bug','feature')) NOT NULL,
          status TEXT DEFAULT 'open',
          CHECK(status IN ('open','in_progress','resolved')),
          reporter_id INT REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ) 
        `)
}
let isConnected = false;

export const initDBSafe = async () => {
  if (isConnected) return;

  try {
    await initDB();
    isConnected = true;
    console.log("Database connected connected");
  } catch (err) {
    console.error("DB error:", err);
  }
};