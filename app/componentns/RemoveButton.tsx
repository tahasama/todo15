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
      <form action={handleRemoveTask}>
        <input hidden type="text" name="id" defaultValue={task.id} />
        <button
          type="submit"
          className="text-red-500 mt-1.5 hover:text-red-700 focus:outline-none"
          aria-label={`Delete task: ${task.text}`}
          disabled={ispending ? true : false}
        >
          {ispending ? "Deleting" : "❌"}
        </button>
      </form>

      <h2 className="text-md font-light text-red-500 text-center pt-2">
        {state?.message}
      </h2>
    </div>
  );
};

export default RemoveButton;
