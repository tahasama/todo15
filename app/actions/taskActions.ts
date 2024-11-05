"use server";

import { revalidatePath } from "next/cache";
import { query } from "../lib/db";
import { Task } from "../types/tasks";

export async function getTasks(): Promise<Task[]> {
  const result = await query("SELECT * FROM tasks ORDER BY created_at DESC");
  return result.rows;
}

export const addTask = async (
  prevState: { message: string } | undefined,
  formData: FormData
) => {
  const newTask = formData.get("task") as string;

  if (newTask) {
    const res = await query(
      "INSERT INTO tasks (text, completed) VALUES ($1, $2)",
      [newTask, false]
    );
    if (res.rowCount === 0) {
      return {
        message: "failed to add you task please refresh or try again later",
      };
    }
    revalidatePath("/");
    // return { message: "task added successfully!" };
    return { message: "" };
  }
};

export async function removeTask(taskId: number) {
  const res = await query("DELETE FROM tasks WHERE id = $1", [taskId]);
  if (res.rowCount === 0) {
    return {
      message: "failed to remove you task please refresh or try again later",
    };
  }
  revalidatePath("/");
  return { message: "" };
}

export async function updateTask(  prevState: { success: boolean, message:string } | undefined,
  formData: FormData) {

  const taskId = formData.get("taskId") as string;
  console.log("🚀 ~ taskId:", taskId)
  const updatedText = formData.get("draft") as string;
  console.log("🚀 ~ updatedText:", updatedText)

  const res = await query("UPDATE tasks SET text = $1 WHERE id = $2", [
    updatedText,
    taskId,
  ]);
  if (res.rowCount === 0) {
    return {
      success: false,
      message: "Failed to update your task. Please refresh or try again later.",

    };
  }
  revalidatePath("/");
  return { success: true,message:'' }; // Close modal on success
}


export const getTaskById = async (taskId: string) => {
console.log("🚀 ~ getTaskById ~ taskId:", taskId)

    const res = await query('SELECT * FROM tasks WHERE id = $1', [taskId]);

    // Check if the task was found
    if (res.rowCount === 0) {
      return {message:'No task has been found!'}; // No task found
    }

    const task: Task = res.rows[0]; // Assuming the first row is the task we want
    return {task,message:''};

};

