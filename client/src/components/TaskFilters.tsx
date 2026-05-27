export type TaskFilter = 'all' | 'active' | 'completed';

type TaskFiltersProps = {
  completedTaskCount: number;
  filter: TaskFilter;
  onClearCompleted: () => void;
  onFilterChange: (filter: TaskFilter) => void;
};

const filterOptions: TaskFilter[] = ['all', 'active', 'completed'];

export const TaskFilters = ({
  completedTaskCount,
  filter,
  onClearCompleted,
  onFilterChange
}: TaskFiltersProps) => {
  return (
    <section className="toolbar" aria-label="Task filters">
      <div className="filter-group">
        {filterOptions.map((filterOption) => (
          <button
            className={filter === filterOption ? 'filter-button active' : 'filter-button'}
            key={filterOption}
            onClick={() => onFilterChange(filterOption)}
            type="button"
          >
            {filterOption}
          </button>
        ))}
      </div>

      <button
        className="secondary-button"
        disabled={completedTaskCount === 0}
        onClick={onClearCompleted}
        type="button"
      >
        Clear completed
      </button>
    </section>
  );
};
