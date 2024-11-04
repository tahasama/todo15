"use client";

import { useState } from "react";

export default function MainPage() {
  const [task, setTask] = useState<any>("");
  const [tasks, setTasks] = useState<any>([]);

  const handleAddTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { text: task, completed: false }]);
      setTask("");
    }
  };

  const toggleTaskCompletion = (index: any) => {
    setTasks((prevTasks: any) =>
      prevTasks.map((t: any, i: any) =>
        i === index ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const handleDeleteTask = (index: any) => {
    setTasks((prevTasks: any) =>
      prevTasks.filter((_: any, i: any) => i !== index)
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 text-gray-800">
      <header className="w-full py-4 bg-blue-600 text-white text-center">
        <h1 className="text-2xl font-bold">To-Do App</h1>
      </header>

      <main className="flex-grow w-full max-w-md mx-auto p-4">
        <section className="mb-4">
          <label
            htmlFor="taskInput"
            className="block text-lg font-semibold mb-2"
          >
            Add a new task
          </label>
          <div className="flex">
            <input
              id="taskInput"
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter a task..."
              className="w-full p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddTask}
              className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700 focus:outline-none"
            >
              Add
            </button>
          </div>
        </section>

        <section aria-label="Task List">
          <h2 className="text-xl font-semibold mb-3">Tasks</h2>
          <ul className="space-y-2">
            {tasks.map((task: any, index: any) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 bg-white rounded shadow"
              >
                <span
                  onClick={() => toggleTaskCompletion(index)}
                  className={`cursor-pointer ${
                    task.completed ? "line-through text-gray-400" : ""
                  }`}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => handleDeleteTask(index)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                  aria-label={`Delete task: ${task.text}`}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="w-full py-2 text-center text-gray-600">
        <p>&copy; 2024 To-Do App</p>
      </footer>
    </div>
  );
}
