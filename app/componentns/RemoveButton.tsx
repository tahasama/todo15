"use client";
import React, { useActionState } from "react";
import { Task } from "../types/tasks";
import { removeTask } from "../actions/taskActions";

const RemoveButton = ({ task }: { task: Task }) => {
  const [state, handleRemoveTask, ispending] = useActionState(
    () => removeTask(task.id),
    {
      message: "",
    }
  );

  return (
    <div>
      <button
        onClick={handleRemoveTask}
        className="text-red-500 text-md hover:text-red-700 focus:outline-none hover:bg-slate-300 p-1 rounded-sm"
        aria-label={`Delete task: ${task.text}`}
        disabled={ispending ? true : false}
      >
        {ispending ? "Loading" : "❌"}
      </button>
      <h2 className="text-md font-light text-red-500 text-center pt-2">
        {state?.message}
      </h2>
    </div>
  );
};

export default RemoveButton;
