import { useState, useMemo } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useTasks } from '../hooks/useTasks';
import { FilterStatus, Priority } from '../types/task';
import { TaskForm } from '../components/TaskForm';
import { TaskItem } from '../components/TaskItem';
import { FilterBar } from '../components/FilterBar';
import { SearchBar } from '../components/SearchBar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Settings } from '../hooks/useSettings';

interface TasksPageProps {
  settings: Settings;
}

export function TasksPage({ settings }: TasksPageProps) {
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    deleteTasks,
    toggleTask,
    toggleTasks,
    reorderTasks,
  } = useTasks();

  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filter
      if (statusFilter === 'active' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;

      // Priority filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDescription = task.description.toLowerCase().includes(query);
        return matchesTitle || matchesDescription;
      }

      return true;
    });
  }, [tasks, statusFilter, priorityFilter, searchQuery]);

  // Task counts
  const taskCounts = useMemo(() => {
    return {
      total: tasks.length,
      active: tasks.filter((t) => !t.completed).length,
      completed: tasks.filter((t) => t.completed).length,
    };
  }, [tasks]);

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderTasks(result.source.index, result.destination.index);
  };

  // Handle task selection
  const handleSelectTask = (id: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTasks(newSelected);
  };

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    if (settings.confirmDelete) {
      setTaskToDelete(id);
      setDeleteDialogOpen(true);
    } else {
      deleteTask(id);
      setSelectedTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setSelectedTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskToDelete);
        return newSet;
      });
    }
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  // Bulk actions
  const handleBulkComplete = () => {
    toggleTasks(Array.from(selectedTasks), true);
    setSelectedTasks(new Set());
  };

  const handleBulkDeleteClick = () => {
    if (settings.confirmDelete) {
      setBulkDeleteDialogOpen(true);
    } else {
      deleteTasks(Array.from(selectedTasks));
      setSelectedTasks(new Set());
    }
  };

  const handleConfirmBulkDelete = () => {
    deleteTasks(Array.from(selectedTasks));
    setSelectedTasks(new Set());
    setBulkDeleteDialogOpen(false);
  };

  return (
    <>
      {/* Task Form */}
      <TaskForm onSubmit={addTask} />

      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Filter Bar */}
      <FilterBar
        statusFilter={statusFilter}
        priorityFilter={priorityFilter}
        onStatusFilterChange={setStatusFilter}
        onPriorityFilterChange={setPriorityFilter}
        taskCounts={taskCounts}
        selectedCount={selectedTasks.size}
        onBulkComplete={handleBulkComplete}
        onBulkDelete={handleBulkDeleteClick}
      />

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md border-2 border-gray-200">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery
              ? 'No tasks found'
              : tasks.length === 0
              ? 'No tasks yet'
              : 'No tasks match your filters'}
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? 'Try adjusting your search query'
              : tasks.length === 0
              ? 'Add your first task to get started!'
              : 'Try changing your filter settings'}
          </p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3"
              >
                {filteredTasks.map((task, index) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    index={index}
                    isSelected={selectedTasks.has(task.id)}
                    onToggle={toggleTask}
                    onUpdate={updateTask}
                    onDelete={handleDeleteClick}
                    onSelect={handleSelectTask}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {/* Footer Stats */}
      {tasks.length > 0 && (
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            {taskCounts.completed} of {taskCounts.total} tasks completed
            {taskCounts.active > 0 && ` • ${taskCounts.active} remaining`}
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setTaskToDelete(null);
        }}
      />

      <ConfirmDialog
        isOpen={bulkDeleteDialogOpen}
        title="Delete Multiple Tasks"
        message={`Are you sure you want to delete ${selectedTasks.size} task${selectedTasks.size !== 1 ? 's' : ''}? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setBulkDeleteDialogOpen(false)}
      />
    </>
  );
}
