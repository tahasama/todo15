"use client";
import React, { useState } from "react";
import { Task } from "../types/tasks";
import { updateTask } from "../actions/taskActions";

const UpdateButton = ({ task }: { task: Task }) => {
  const [draft, setDraft] = useState<string>(task.text);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Server action to update a task
  const handleUpdateTask = async (): Promise<void> => {
    if (draft.trim()) {
      await updateTask({ taskId: task.id, updatedText: draft });
      setIsEditing(!isEditing);
    }
  };

  return (
    <div className="relative">
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-slate-500 bg-opacity-50 backdrop-blur-[2px] z-50 transition duration-200 ease-out">
          <form
            action={handleUpdateTask}
            className="flex items-center space-x-2 w-full max-w-sm bg-white p-4 rounded shadow-lg"
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="flex-grow border border-gray-300 rounded-l p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Edit task text"
              style={{ minWidth: "200px" }}
            />
            <button
              type="button"
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleUpdateTask}
            >
              &#10004;
            </button>
            <button
              type="button"
              className="text-red-500 text-3xl hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={() => setIsEditing(false)}
            >
              &times;
            </button>
          </form>
        </div>
      )}

      {!isEditing && (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-blue-500 hover:bg-slate-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          🖊️
        </button>
      )}
    </div>
  );
};

export default UpdateButton;
