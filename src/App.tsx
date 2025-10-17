import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useSettings } from './hooks/useSettings';
import { TasksPage } from './pages/TasksPage';
import { SettingsPage } from './pages/SettingsPage';

function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="mb-8 bg-white rounded-lg shadow-md border-2 border-gray-200 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isActive('/')
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">✓</span>
            <span className="hidden sm:inline">Tasks</span>
          </Link>
          <Link
            to="/settings"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              isActive('/settings')
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span className="text-xl">⚙️</span>
            <span className="hidden sm:inline">Settings</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  const { settings, updateSettings, resetSettings } = useSettings();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-3">
            <span className="text-5xl">⏱️</span>
            Chronos List
          </h1>
          <p className="text-gray-600 text-lg">
            Master your time, conquer your tasks
          </p>
        </header>

        {/* Navigation */}
        <Navigation />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<TasksPage settings={settings} />} />
          <Route 
            path="/settings" 
            element={
              <SettingsPage 
                settings={settings} 
                onUpdateSettings={updateSettings}
                onResetSettings={resetSettings}
              />
            } 
          />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
