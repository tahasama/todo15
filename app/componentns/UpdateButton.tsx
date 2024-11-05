"use client";
import React, { useState } from "react";
import { Task } from "../types/tasks";
import { updateTask } from "../actions/taskActions";

const UpdateButton = ({ task }: { task: Task }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draft, setDraft] = useState<string>(task.text);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Server action to update a task
  const handleUpdateTask = async (formData: FormData): Promise<void> => {
    const updatedText = formData.get("draft") as string;
    if (updatedText.trim()) {
      const response = await updateTask({ taskId: task.id, updatedText });
      console.log("🚀 ~ handleUpdateTask ~ response:", response);
      if (response.message) {
        // If there's an error message, set it in the state
        setErrorMessage(response.message);
      } else {
        // Clear error message and close the modal on success
        setErrorMessage("");
        setIsEditing(false);
      }
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
              name="draft"
              defaultValue={task.text}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDraft(e.target.value)
              }
              className="flex-grow border border-gray-300 rounded-l p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Edit task text"
              style={{ minWidth: "200px" }}
            />
            <button
              type="submit"
              className={`${
                draft !== task.text
                  ? "bg-green-400 hover:bg-green-500"
                  : "bg-slate-200"
              } text-white p-1.5 rounded  focus:outline-none focus:ring-2 focus:ring-blue-500`}
              //   className="text-blue-500 hover:bg-slate-300 text-lg rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={draft === task.text ? true : false}
            >
              ✔️
            </button>
            <button
              type="button"
              className="text-red-500 text-md hover:text-red-700 focus:outline-none hover:bg-slate-300 p-1.5 rounded-md"
              onClick={() => setIsEditing(false)}
            >
              ❌
            </button>
          </form>
        </div>
      )}

      {!isEditing && (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-blue-500 hover:bg-slate-300 text-lg rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          🖊️
        </button>
      )}
    </div>
  );
};

export default UpdateButton;
