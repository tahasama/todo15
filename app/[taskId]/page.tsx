import React from "react";
import { getTaskById, getTasks } from "../actions/taskActions";
import { Task } from "../types/tasks";

export async function generateStaticParams() {
  const tasks: Task[] = await getTasks();
  return tasks.map((task) => ({
    taskId: String(task.id),
  }));
}

type Params = Promise<{ taskId: string }>;

const TaskDetail = async ({ params }: { params: Params }) => {
  const { taskId } = await params;
  console.log("1111:", taskId);
  const res = await getTaskById(taskId);
  return <div>{res?.task?.text}</div>;
};

export default TaskDetail;
