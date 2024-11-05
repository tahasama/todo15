import React from "react";
import { getTaskById, getTasks } from "../actions/taskActions";
import { GetTasks, Task } from "../types/tasks";

export async function generateStaticParams() {
  const tasks: GetTasks = await getTasks();
  return tasks.tasks?.map((task) => ({
    taskId: String(task.id),
  }));
}

type Params = Promise<{ taskId: string }>;

const TaskDetail = async ({ params }: { params: Params }) => {
  const { taskId } = await params;
  const res = await getTaskById(taskId);
  const task = res.task;

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-400 text-gray-800">
      <header className="w-full py-4 bg-blue-600 text-white text-center shadow-md">
        <h1 className="text-2xl font-bold"> {task?.text || "Task Details"}</h1>
      </header>

      <p className="text-md font-light text-gray-700 mb-2">
        <strong>Status:</strong> {task?.completed ? "Completed" : "Pending"}
      </p>

      <p className="text-md font-light text-gray-700 mb-2">
        <strong>Created At:</strong>{" "}
        {task &&
          new Date(task?.created_at).toLocaleString("en-UK", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
      </p>

      {res?.message && (
        <h2 className="text-md font-light text-red-500 text-center pt-2">
          {res.message}
        </h2>
      )}
    </div>
  );
};

export default TaskDetail;
