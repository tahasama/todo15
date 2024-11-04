import { query } from "../lib/db";

interface Task {
    text: string;
    completed: boolean;
    created_at: Date;
  }
  
export async function getTasks(): Promise<Task[]> {
    const result = await query("SELECT * FROM tasks ORDER BY created_at DESC");
    return result.rows;
  }