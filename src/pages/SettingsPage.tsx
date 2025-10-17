import { Button } from '../components/ui/button';
import { Select } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { Input } from '../components/ui/input';
import { Settings } from '../hooks/useSettings';
import { useState } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';

interface SettingsPageProps {
  settings: Settings;
  onUpdateSettings: (updates: Partial<Settings>) => void;
  onResetSettings: () => void;
}

export function SettingsPage({ settings, onUpdateSettings, onResetSettings }: SettingsPageProps) {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleReset = () => {
    onResetSettings();
    setResetDialogOpen(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
          <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <span className="text-4xl">⚙️</span>
            Settings
          </h2>
          <p className="text-blue-100">Customize your Chronos List experience</p>
        </div>

        <div className="p-6 space-y-6">
          {/* Appearance Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">🎨</span>
              Appearance
            </h3>
            <div className="space-y-4 pl-7">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Theme
                </label>
                <Select
                  value={settings.theme}
                  onChange={(e) => onUpdateSettings({ theme: e.target.value as Settings['theme'] })}
                  className="max-w-xs"
                >
                  <option value="light">☀️ Light Mode</option>
                  <option value="dark">🌙 Dark Mode (Coming Soon)</option>
                  <option value="auto">🔄 Auto (System)</option>
                </Select>
                <p className="text-xs text-gray-500 mt-1">Choose your preferred color scheme</p>
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Task Defaults Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">📋</span>
              Task Defaults
            </h3>
            <div className="space-y-4 pl-7">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Priority
                </label>
                <Select
                  value={settings.defaultPriority}
                  onChange={(e) => onUpdateSettings({ defaultPriority: e.target.value as Settings['defaultPriority'] })}
                  className="max-w-xs"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </Select>
                <p className="text-xs text-gray-500 mt-1">Default priority for new tasks</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Tasks By
                </label>
                <Select
                  value={settings.sortBy}
                  onChange={(e) => onUpdateSettings({ sortBy: e.target.value as Settings['sortBy'] })}
                  className="max-w-xs"
                >
                  <option value="manual">✋ Manual (Drag & Drop)</option>
                  <option value="dueDate">📅 Due Date</option>
                  <option value="priority">⚡ Priority</option>
                  <option value="createdAt">🕐 Date Created</option>
                </Select>
                <p className="text-xs text-gray-500 mt-1">How tasks should be ordered</p>
              </div>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Behavior Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">🔔</span>
              Behavior
            </h3>
            <div className="space-y-4 pl-7">
              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox
                  checked={settings.confirmDelete}
                  onChange={(e) => onUpdateSettings({ confirmDelete: e.target.checked })}
                />
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    Confirm before deleting
                  </div>
                  <p className="text-xs text-gray-500">Show confirmation dialog when deleting tasks</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox
                  checked={settings.showCompletedTasks}
                  onChange={(e) => onUpdateSettings({ showCompletedTasks: e.target.checked })}
                />
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    Show completed tasks
                  </div>
                  <p className="text-xs text-gray-500">Display completed tasks in the list by default</p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox
                  checked={settings.notifications}
                  onChange={(e) => onUpdateSettings({ notifications: e.target.checked })}
                />
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    Enable notifications
                  </div>
                  <p className="text-xs text-gray-500">Get reminders for upcoming tasks (Coming Soon)</p>
                </div>
              </label>
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Auto Archive Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">🗄️</span>
              Auto Archive
            </h3>
            <div className="space-y-4 pl-7">
              <label className="flex items-start gap-3 cursor-pointer group">
                <Checkbox
                  checked={settings.autoArchive}
                  onChange={(e) => onUpdateSettings({ autoArchive: e.target.checked })}
                />
                <div>
                  <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    Auto-archive completed tasks
                  </div>
                  <p className="text-xs text-gray-500">Automatically archive tasks after completion</p>
                </div>
              </label>

              {settings.autoArchive && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Archive after (days)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={settings.archiveDays}
                    onChange={(e) => onUpdateSettings({ archiveDays: parseInt(e.target.value) || 30 })}
                    className="max-w-xs"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Completed tasks will be archived after {settings.archiveDays} days
                  </p>
                </div>
              )}
            </div>
          </section>

          <hr className="border-gray-200" />

          {/* Data Management Section */}
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">💾</span>
              Data Management
            </h3>
            <div className="space-y-4 pl-7">
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">ℹ️</span>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Local Storage</h4>
                    <p className="text-sm text-blue-800">
                      All your tasks and settings are stored locally in your browser.
                      Your data never leaves your device.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="destructive"
                onClick={() => setResetDialogOpen(true)}
                className="w-full sm:w-auto"
              >
                Reset All Settings
              </Button>
              <p className="text-xs text-gray-500">This will restore default settings but keep your tasks</p>
            </div>
          </section>
        </div>
      </div>

      {/* Stats Card */}
      <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg shadow-md border-2 border-green-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <span className="text-xl">📊</span>
          Quick Stats
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
            <div className="text-2xl font-bold text-blue-600">
              {localStorage.getItem('chronos-tasks') ? JSON.parse(localStorage.getItem('chronos-tasks') || '[]').length : 0}
            </div>
            <div className="text-xs text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {localStorage.getItem('chronos-tasks') ? JSON.parse(localStorage.getItem('chronos-tasks') || '[]').filter((t: any) => t.completed).length : 0}
            </div>
            <div className="text-xs text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
            <div className="text-2xl font-bold text-orange-600">
              {localStorage.getItem('chronos-tasks') ? JSON.parse(localStorage.getItem('chronos-tasks') || '[]').filter((t: any) => !t.completed).length : 0}
            </div>
            <div className="text-xs text-gray-600">Active</div>
          </div>
          <div className="bg-white rounded-lg p-3 text-center border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">
              {(localStorage.getItem('chronos-settings')?.length || 0) + (localStorage.getItem('chronos-tasks')?.length || 0)}
            </div>
            <div className="text-xs text-gray-600">Storage (chars)</div>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={resetDialogOpen}
        title="Reset Settings"
        message="Are you sure you want to reset all settings to their default values? Your tasks will not be affected."
        confirmText="Reset"
        cancelText="Cancel"
        onConfirm={handleReset}
        onCancel={() => setResetDialogOpen(false)}
      />
    </div>
  );
}
