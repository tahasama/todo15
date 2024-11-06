import Link from "next/link";
import React from "react";
import { GetTasks } from "../types/tasks";
import RemoveButton from "./RemoveButton";
import UpdateButton from "./UpdateButton";
import { getTasks } from "../actions/taskActions";

const TaskList = async () => {
  const tasks: GetTasks = await getTasks(); // This function will be called in the server environment

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
