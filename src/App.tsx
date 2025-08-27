import React, { Suspense } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, LayoutGrid } from 'lucide-react';
import { TaskProvider } from './contexts/TaskContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TaskLoader } from './components/TaskLoader';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Dashboard } from './pages/Dashboard';
import { TaskList } from './pages/TaskList';
import { TaskDetail } from './pages/TaskDetail';
import { KanbanView } from './pages/KanbanView';

function App() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <TaskProvider>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center">
                  <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
                    <CheckSquare className="text-blue-600" size={24} />
                    TaskManager
                  </Link>
                </div>
                
                <div className="flex items-center gap-6">
                  <Link
                    to="/"
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Home size={16} />
                    Dashboard
                  </Link>
                  <Link
                    to="/kanban"
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/kanban'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <LayoutGrid size={16} />
                    Kanban
                  </Link>
                  <Link
                    to="/tasks"
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/tasks'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <CheckSquare size={16} />
                    Tasks
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/kanban" element={<KanbanView />} />
                <Route path="/tasks" element={<TaskList />} />
                <Route path="/tasks/:id" element={<TaskDetail />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ErrorBoundary>
          </main>
        </div>
      </TaskProvider>
    </ErrorBoundary>
  );
}

export default App;