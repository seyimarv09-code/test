import { FilterStatus, Priority } from '../types/task';
import { Select } from './ui/select';
import { Button } from './ui/button';

interface FilterBarProps {
  statusFilter: FilterStatus;
  priorityFilter: Priority | 'all';
  onStatusFilterChange: (filter: FilterStatus) => void;
  onPriorityFilterChange: (filter: Priority | 'all') => void;
  taskCounts: {
    total: number;
    active: number;
    completed: number;
  };
  selectedCount: number;
  onBulkComplete: () => void;
  onBulkDelete: () => void;
}

export function FilterBar({
  statusFilter,
  priorityFilter,
  onStatusFilterChange,
  onPriorityFilterChange,
  taskCounts,
  selectedCount,
  onBulkComplete,
  onBulkDelete,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 border-2 border-gray-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <Select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value as FilterStatus)}
              className="w-32"
            >
              <option value="all">All ({taskCounts.total})</option>
              <option value="active">Active ({taskCounts.active})</option>
              <option value="completed">Completed ({taskCounts.completed})</option>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Priority:</label>
            <Select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value as Priority | 'all')}
              className="w-32"
            >
              <option value="all">All</option>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </Select>
          </div>
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center gap-2 animate-fade-in">
            <span className="text-sm font-medium text-gray-700">
              {selectedCount} selected
            </span>
            <Button size="sm" variant="outline" onClick={onBulkComplete}>
              Mark Complete
            </Button>
            <Button size="sm" variant="destructive" onClick={onBulkDelete}>
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
