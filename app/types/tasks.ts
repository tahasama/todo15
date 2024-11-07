export interface Task {
    id: number;
    text: string;
    completed: boolean;
    created_at: Date;
  }

  export interface TaskWithName extends Task {
    name: string; // Add the `name` property for tasks that have the user's name
  }


export interface GetTaskByIdResponse {
    task?: Task; // Optional task property
    message?: string; // Message property
  }

export interface GetTasks {
    tasks: TaskWithName[];
    message: string;
  };