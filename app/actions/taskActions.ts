"use server";

import { revalidatePath } from "next/cache";
import { query } from "../lib/db";
import { Task } from "../types/tasks";

export async function getTasks(): Promise<Task[]> {
    const result = await query("SELECT * FROM tasks ORDER BY created_at DESC");
    return result.rows;
  }

export async function addTask(newTask:string) {
    await query("INSERT INTO tasks (text, completed) VALUES ($1, $2)", [
        newTask,
        false,
      ]);
      revalidatePath("/");
}

export async function handleRemoveTask(taskId: number): Promise<void> {
    await query("DELETE FROM tasks WHERE id = $1", [taskId]);
    revalidatePath("/");
  }

export async function updateTask({updatedText, taskId}: {updatedText:string, taskId:number}) {
    await query("UPDATE tasks SET text = $1 WHERE id = $2", [
        updatedText,
        taskId,
      ]);
    revalidatePath("/");
}
