import { Task } from "./types/tasks";
import RemoveButton from "./componentns/RemoveButton";
import { getTasks } from "./actions/taskActions";
import UpdateButton from "./componentns/UpdateButton";
import AddtaskForm from "./componentns/AddtaskForm";
import Link from "next/link";

export default async function MainPage() {
  const tasks: Task[] = await getTasks();

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 text-gray-800">
      <header className="w-full py-4 bg-blue-600 text-white text-center shadow-md">
        <h1 className="text-2xl font-bold">To-Do App</h1>
      </header>

      <main className="flex-grow w-full max-w-md mx-auto p-4 space-y-6">
        {/* Add Task Section */}

        <AddtaskForm />

        {/* Task List Section */}
        <section aria-label="Task List">
          <h2 className="text-xl font-semibold mb-3 text-gray-800">Tasks</h2>
          <ul className="space-y-4">
            {tasks.map((task: Task) => (
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
                    {new Date(task.created_at).toLocaleString("en-uk", {
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
        </section>
      </main>

      <footer className="w-full py-2 text-center text-gray-600 border-t border-gray-200">
        <p>&copy; 2024 To-Do App</p>
      </footer>
    </div>
  );
}
