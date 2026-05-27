export type Task = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskInput = {
  title: string;
};

export type UpdateTaskInput = {
  title?: string;
  completed?: boolean;
};
