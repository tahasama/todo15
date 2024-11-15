"use client";

import { useActionState } from "react";
import { addTask } from "../app/actions/taskActions";

const AddtaskForm = () => {
  const [state, handleAddTask, ispending] = useActionState(addTask, {
    message: "",
  });
  return (
    <section className="mb-4">
      <label
        htmlFor="taskInput"
        className="block text-lg font-semibold mb-2 text-gray-700"
      >
        Add a new task
      </label>
      <form action={handleAddTask} className="flex">
        <input
          id="taskInput"
          name="task"
          type="text"
          placeholder="Enter a task..."
          className="w-full p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700 focus:outline-none"
          disabled={ispending ? true : false}
        >
          {ispending ? "loading..." : "Add"}
        </button>
      </form>
      <h2 className="text-md font-light text-red-500 text-center pt-2">
        {state?.message}
      </h2>
    </section>
  );
};

export default AddtaskForm;
