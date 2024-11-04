"use client";
import React from "react";
import { Task } from "../types/tasks";
import { handleRemoveTask } from "../actions/taskActions";

const RemoveButton = ({ task }: { task: Task }) => {
  return (
    <button
      onClick={async () => await handleRemoveTask(task.id)}
      className="text-red-500 text-3xl hover:text-red-700 focus:outline-none"
      aria-label={`Delete task: ${task.text}`}
    >
      &times;
    </button>
  );
};

export default RemoveButton;
