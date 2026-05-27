export type Task = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskRequest = {
  title: string;
};

export type UpdateTaskRequest = {
  title?: string;
  completed?: boolean;
};
