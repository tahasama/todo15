import AddtaskForm from "@/components/AddtaskForm";
import TaskList from "@/components/TaskList";
import { Suspense } from "react";
import Loading from "./loading";

export default function MainPage() {
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
          {/* <h2 className="text-md font-light text-red-500 text-center pt-2">
            {tasks?.message}
          </h2> */}
          <Suspense fallback={<Loading />}>
            <TaskList />
          </Suspense>
        </section>
      </main>

      <footer className="w-full py-2 text-center text-gray-600 border-t border-gray-200">
        <p>&copy; 2024 To-Do App</p>
      </footer>
    </div>
  );
}
