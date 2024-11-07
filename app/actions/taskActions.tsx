"use server";

import { revalidatePath } from "next/cache";
import { query } from "../lib/db";
import { GetTasks, Task } from "../types/tasks";
import { auth } from "@/auth";

export async function getTasks(): Promise<GetTasks> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      message: "User is not authenticated.",
      tasks: [],
    };
  }

  const result = await query(
    "SELECT tasks.*, users.name FROM tasks INNER JOIN users ON tasks.user_id = users.id WHERE tasks.user_id = $1 ORDER BY tasks.created_at DESC",
    [session.user.id] // Fetch tasks only for the logged-in user
  );

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
    // Get the current user's session
    const session = await auth();
    if (!session?.user?.id) {
      return {
        message: "You must be logged in to add a task.",
      };
    }

    // Insert the task with the user_id
    const res = await query(
      "INSERT INTO tasks (text, completed, user_id) VALUES ($1, $2, $3)",
      [newTask, false, session.user.id] // Adding the user_id from the session
    );

    if (res.rowCount === 0) {
      return {
        message: "Failed to add your task. Please try again later.",
      };
    }

    revalidatePath("/"); // Trigger revalidation to reflect the change
    return { message: "Task added successfully!" };
  }

  return {
    message: "Please provide a task description.",
  };
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
