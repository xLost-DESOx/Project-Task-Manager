import type { Task } from '../types/task';

type TaskItemProps = {
  editingTaskId: number | null;
  editingTitle: string;
  task: Task;
  onCancelEditing: () => void;
  onDeleteTask: (task: Task) => void;
  onEditingTitleChange: (title: string) => void;
  onSaveEditing: (task: Task) => void;
  onStartEditing: (task: Task) => void;
  onToggleTask: (task: Task) => void;
};

export const TaskItem = ({
  editingTaskId,
  editingTitle,
  task,
  onCancelEditing,
  onDeleteTask,
  onEditingTitleChange,
  onSaveEditing,
  onStartEditing,
  onToggleTask
}: TaskItemProps) => {
  const isEditing = editingTaskId === task.id;

  return (
    <article className={task.completed ? 'task-item completed' : 'task-item'}>
      {isEditing ? (
        <div className="edit-row">
          <input
            aria-label="Edit task title"
            maxLength={200}
            onChange={(event) => onEditingTitleChange(event.target.value)}
            value={editingTitle}
          />
          <button onClick={() => onSaveEditing(task)} type="button">
            Save
          </button>
          <button className="secondary-action" onClick={onCancelEditing} type="button">
            Cancel
          </button>
        </div>
      ) : (
        <>
          <label className="task-check">
            <input
              checked={task.completed}
              onChange={() => onToggleTask(task)}
              type="checkbox"
            />
            <span>{task.title}</span>
          </label>

          <div className="task-actions">
            <button
              className="edit-button"
              onClick={() => onStartEditing(task)}
              type="button"
            >
              Edit
            </button>
            <button
              className="delete-button"
              onClick={() => onDeleteTask(task)}
              type="button"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </article>
  );
};
