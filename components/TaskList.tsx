import Link from "next/link";
import React from "react";
import { GetTasks } from "../app/types/tasks";
import RemoveButton from "./RemoveButton";
import UpdateButton from "./UpdateButton";
import { query } from "../lib/db";
import { getTasks } from "@/app/actions/taskActions";

export async function getUsers() {
  // const session = await auth();

  // if (!session?.user?.id) {
  //   return {
  //     message: "User is not authenticated.",
  //     tasks: [],
  //   };
  // }

  const result = await query(
    // "SELECT tasks.*, users.name FROM tasks INNER JOIN users ON tasks.user_id = users.id WHERE tasks.user_id = $1 ORDER BY tasks.created_at DESC"
    // [session.user.id] // Fetch tasks only for the logged-in user
    "SELECT *FROM users ORDER BY tasks.created_at DESC"
  );
  console.log("🚀 ~ getUsers ~ result:", result);

  if (!result) {
    return {
      message: "Failed to fetch users",
      users: [],
    };
  }

  return {
    users: result.rows,
    message: "",
  };
}

const TaskList = async () => {
  const tasks: GetTasks = await getTasks(); // This function will be called in the server environment
  console.log("🚀 ~ TaskList ~ tasks:", tasks);

  return (
    <ul className="space-y-4">
      {tasks.tasks.map((task) => (
        <li
          key={task.id}
          className="flex flex-col md:flex-row items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 space-y-3 md:space-y-0"
        >
          <Link
            href={`/${task.id}`}
            className="flex-grow text-gray-700 hover:bg-slate-200 rounded-md p-2"
          >
            <span
              className={`block cursor-pointer ${
                task.completed ? "line-through text-gray-400" : ""
              }`}
            >
              {task.text}
            </span>
            <span className="block text-sm text-gray-500 mt-1">
              {new Date(task.created_at).toLocaleString("en-UK", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
            <span className="text-sm text-gray-600 mt-2 md:mt-0">
              {task.name}
            </span>
          </Link>
          <div className="flex space-x-2">
            <RemoveButton task={task} />
            <UpdateButton task={task} />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
