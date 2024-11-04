import { revalidatePath } from "next/cache";
import { Task } from "./types/tasks";
import RemoveButton from "./componentns/RemoveButton";
import { addTask, getTasks } from "./actions/taskActions";
import UpdateButton from "./componentns/UpdateButton";
import { query } from "./lib/db";

export default async function MainPage() {
  const tasks: Task[] = await getTasks();

  const handleAddTask = async (formData: FormData): Promise<void> => {
    "use server";
    const newTask = formData.get("task") as string;

    if (newTask) {
      await addTask(newTask);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 text-gray-800">
      <header className="w-full py-4 bg-blue-600 text-white text-center shadow-md">
        <h1 className="text-2xl font-bold">To-Do App</h1>
      </header>

      <main className="flex-grow w-full max-w-md mx-auto p-4 space-y-6">
        {/* Add Task Section */}
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
            <button className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700 focus:outline-none">
              Add
            </button>
          </form>
        </section>

        {/* Task List Section */}
        <section aria-label="Task List">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Tasks</h2>
          <ul className="space-y-4">
            {tasks.map((task: Task) => (
              <li
                key={task.id}
                className="flex flex-col md:flex-row items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 space-y-3 md:space-y-0"
              >
                <div className="flex-grow text-gray-700">
                  <span
                    className={`block cursor-pointer ${
                      task.completed ? "line-through text-gray-400" : ""
                    }`}
                  >
                    {task.text}
                  </span>
                  <span className="block text-sm text-gray-500 mt-1">
                    {new Date(task.created_at).toLocaleString("en-uk", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <RemoveButton task={task} />
                  <UpdateButton task={task} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="w-full py-2 text-center text-gray-600 border-t border-gray-200">
        <p>&copy; 2024 To-Do App</p>
      </footer>
    </div>
  );
}
