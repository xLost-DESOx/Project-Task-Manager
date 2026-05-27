type TaskFormProps = {
  isSaving: boolean;
  newTaskTitle: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  onTitleChange: (title: string) => void;
};

export const TaskForm = ({
  isSaving,
  newTaskTitle,
  onSubmit,
  onTitleChange
}: TaskFormProps) => {
  return (
    <form className="task-form" onSubmit={onSubmit}>
      <label htmlFor="task-title">New task</label>
      <div className="task-form-row">
        <input
          id="task-title"
          maxLength={200}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Add a task..."
          value={newTaskTitle}
        />
        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Adding...' : 'Add task'}
        </button>
      </div>
    </form>
  );
};
