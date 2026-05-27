import { useEffect, useMemo, useState } from 'react';

import {
  clearCompletedTasks,
  createTask,
  deleteTask,
  fetchTasks,
  updateTask
} from './api/tasksApi';
import { TaskForm } from './components/TaskForm';
import type { Task } from './types/task';

type Filter = 'all' | 'active' | 'completed';

const App = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const activeTaskCount = tasks.filter((task) => !task.completed).length;
  const completedTaskCount = tasks.length - activeTaskCount;

  const visibleTasks = useMemo(() => {
    if (filter === 'active') {
      return tasks.filter((task) => !task.completed);
    }

    if (filter === 'completed') {
      return tasks.filter((task) => task.completed);
    }

    return tasks;
  }, [filter, tasks]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setErrorMessage('');
        const loadedTasks = await fetchTasks();
        setTasks(loadedTasks);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Unable to load tasks.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadTasks();
  }, []);

  const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = newTaskTitle.trim();

    if (!title) {
      setErrorMessage('Please enter a task before adding it.');
      return;
    }

    const alreadyExists = tasks.some(
      (task) => task.title.trim().toLowerCase() === title.toLowerCase()
    );

    if (alreadyExists) {
      setErrorMessage('That task already exists.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage('');
      const createdTask = await createTask({ title });
      setTasks((currentTasks) => [createdTask, ...currentTasks]);
      setNewTaskTitle('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to create task.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleTask = async (task: Task) => {
    try {
      setErrorMessage('');
      const updatedTask = await updateTask(task.id, { completed: !task.completed });
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) => (currentTask.id === task.id ? updatedTask : currentTask))
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to update task.');
    }
  };

  const handleDeleteTask = async (task: Task) => {
    const shouldDelete = window.confirm(`Delete "${task.title}"? This cannot be undone.`);

    if (!shouldDelete) {
      return;
    }

    try {
      setErrorMessage('');
      await deleteTask(task.id);
      setTasks((currentTasks) => currentTasks.filter((currentTask) => currentTask.id !== task.id));

      if (editingTaskId === task.id) {
        setEditingTaskId(null);
        setEditingTitle('');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to delete task.');
    }
  };

  const handleClearCompleted = async () => {
    try {
      setErrorMessage('');
      await clearCompletedTasks();
      setTasks((currentTasks) => currentTasks.filter((task) => !task.completed));
      setEditingTaskId(null);
      setEditingTitle('');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to clear completed tasks.');
    }
  };

  const handleStartEditing = (task: Task) => {
    setErrorMessage('');
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const handleCancelEditing = () => {
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const handleSaveEditing = async (task: Task) => {
    const title = editingTitle.trim();

    if (!title) {
      setErrorMessage('Task title cannot be empty.');
      return;
    }

    if (title === task.title) {
      handleCancelEditing();
      return;
    }

    const alreadyExists = tasks.some(
      (currentTask) =>
        currentTask.id !== task.id && currentTask.title.trim().toLowerCase() === title.toLowerCase()
    );

    if (alreadyExists) {
      setErrorMessage('Another task already uses that title.');
      return;
    }

    const shouldSave = window.confirm(`Save changes to "${task.title}"?`);

    if (!shouldSave) {
      return;
    }

    try {
      setErrorMessage('');
      const updatedTask = await updateTask(task.id, { title });
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) => (currentTask.id === task.id ? updatedTask : currentTask))
      );
      handleCancelEditing();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to edit task.');
    }
  };

  return (
    <main className="app-shell">
      <section className="task-panel">
        <header className="app-header">
          <div>
            <p className="eyebrow">Project Task Manager</p>
            <h1>Organize your work.</h1>
            <p className="hero-copy">
              Add tasks, track progress, edit details, and keep completed work out of the way.
            </p>
          </div>

          <div className="task-count-card">
            <span>{activeTaskCount}</span>
            <p>{activeTaskCount === 1 ? 'task remaining' : 'tasks remaining'}</p>
          </div>
        </header>

        <TaskForm
          isSaving={isSaving}
          newTaskTitle={newTaskTitle}
          onSubmit={handleCreateTask}
          onTitleChange={setNewTaskTitle}
        />

        {errorMessage ? <p className="error-message">{errorMessage}</p> : null}

        <section className="toolbar" aria-label="Task filters">
          <div className="filter-group">
            {(['all', 'active', 'completed'] as Filter[]).map((filterOption) => (
              <button
                className={filter === filterOption ? 'filter-button active' : 'filter-button'}
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                type="button"
              >
                {filterOption}
              </button>
            ))}
          </div>

          <button
            className="secondary-button"
            disabled={completedTaskCount === 0}
            onClick={handleClearCompleted}
            type="button"
          >
            Clear completed
          </button>
        </section>

        <section className="task-list" aria-live="polite">
          {isLoading ? <p className="empty-state">Loading tasks...</p> : null}

          {!isLoading && visibleTasks.length === 0 ? (
            <p className="empty-state">No tasks to show for this filter.</p>
          ) : null}

          {visibleTasks.map((task) => {
            const isEditing = editingTaskId === task.id;

            return (
              <article className={task.completed ? 'task-item completed' : 'task-item'} key={task.id}>
                {isEditing ? (
                  <div className="edit-row">
                    <input
                      aria-label="Edit task title"
                      maxLength={200}
                      onChange={(event) => setEditingTitle(event.target.value)}
                      value={editingTitle}
                    />
                    <button onClick={() => void handleSaveEditing(task)} type="button">
                      Save
                    </button>
                    <button className="secondary-action" onClick={handleCancelEditing} type="button">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <label className="task-check">
                      <input
                        checked={task.completed}
                        onChange={() => void handleToggleTask(task)}
                        type="checkbox"
                      />
                      <span>{task.title}</span>
                    </label>

                    <div className="task-actions">
                      <button
                        className="edit-button"
                        onClick={() => handleStartEditing(task)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => void handleDeleteTask(task)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </article>
            );
          })}
        </section>
      </section>
    </main>
  );
};

export default App;




