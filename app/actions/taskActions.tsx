"use server";

import { revalidatePath } from "next/cache";
import { query } from "../lib/db";
import { GetTasks, Task } from "../types/tasks";

export async function getTasks(): Promise<GetTasks> {
  const result = await query("SELECT * FROM tasks ORDER BY created_at DESC");

  if (!result) {
    return {
      message: "Failed to fetch tasks",
      tasks: [],
    };
  }

  return {
    tasks: result.rows,
    message: "",
  };
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

export async function removeTask(
  prevState: { message: string } | undefined,
  formData: FormData
) {
  const taskId = Number(formData.get("id"));

  const res = await query("DELETE FROM tasks WHERE id = $1", [taskId]);
  if (res.rowCount === 0) {
    return {
      message: "failed to remove you task please refresh or try again later",
    };
  }
  revalidatePath("/");
  return { message: "" };
}

export async function updateTask(
  prevState: { success: boolean; message: string } | undefined,
  formData: FormData
) {
  const taskId = formData.get("taskId") as string;
  const updatedText = formData.get("draft") as string;
  if (updatedText.trim()) {
    const res = await query("UPDATE tasks SET text = $1 WHERE id = $2", [
      updatedText,
      taskId,
    ]);
    if (res.rowCount === 0) {
      return {
        success: false,
        message:
          "Failed to update your task. Please refresh or try again later.",
      };
    }
    revalidatePath("/");
    return { success: true, message: "" }; // Close modal on success
  }
  return { success: false, message: "please add a task" };
}

export const getTaskById = async (taskId: string) => {
  const res = await query("SELECT * FROM tasks WHERE id = $1", [taskId]);

  // Check if the task was found
  if (res.rowCount === 0) {
    return { message: "No task has been found!" }; // No task found
  }

  const task: Task = res.rows[0]; // Assuming the first row is the task we want
  return { task, message: "" };
};
