export interface Task {
    id: number;
    text: string;
    completed: boolean;
    created_at: Date;
  }


export interface GetTaskByIdResponse {
    task?: Task; // Optional task property
    message?: string; // Message property
  }