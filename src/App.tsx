import React, { Suspense, useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, LayoutGrid, Menu, X } from 'lucide-react';
import { TaskProvider } from './contexts/TaskContext';
import { TaskDataProvider } from './contexts/TaskDataProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { TaskLoader, TaskListLoader } from './components/TaskLoader';
import { Dashboard } from './pages/Dashboard';
import { TaskList } from './pages/TaskList';
import { TaskDetail } from './pages/TaskDetail';
import { KanbanView } from './pages/KanbanView';

function App() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <ErrorBoundary>
      <Suspense fallback={<TaskLoader />}>
        <TaskDataProvider>
          <TaskProvider>
            <div className="min-h-screen bg-gray-50">
              <nav className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
                        <CheckSquare className="text-blue-600" size={24} />
                        <span className="hidden sm:block">TaskManager</span>
                        <span className="sm:hidden">TM</span>
                      </Link>
                    </div>
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-2 lg:gap-4">
                  <Link
                    to="/"
                    className={`flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Home size={16} />
                    <span className="hidden lg:inline">Dashboard</span>
                  </Link>
                  <Link
                    to="/kanban"
                    className={`flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/kanban'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <LayoutGrid size={16} />
                    <span className="hidden lg:inline">Kanban</span>
                  </Link>
                  <Link
                    to="/tasks"
                    className={`flex items-center gap-1 lg:gap-2 px-2 lg:px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === '/tasks'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <CheckSquare size={16} />
                    <span className="hidden lg:inline">Tasks</span>
                  </Link>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Open main menu</span>
                    {isMobileMenuOpen ? (
                      <X className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Menu className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {/* Mobile Navigation Menu */}
              {isMobileMenuOpen && (
                <div className="md:hidden">
                  <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
                    <Link
                      to="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        location.pathname === '/'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Home size={20} />
                      Dashboard
                    </Link>
                    <Link
                      to="/kanban"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        location.pathname === '/kanban'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <LayoutGrid size={20} />
                      Kanban
                    </Link>
                    <Link
                      to="/tasks"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        location.pathname === '/tasks'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <CheckSquare size={20} />
                      Tasks
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={
                  <Suspense fallback={<TaskListLoader />}>
                    <Dashboard />
                  </Suspense>
                } />
                <Route path="/kanban" element={
                  <Suspense fallback={<TaskListLoader />}>
                    <KanbanView />
                  </Suspense>
                } />
                <Route path="/tasks" element={
                  <Suspense fallback={<TaskListLoader />}>
                    <TaskList />
                  </Suspense>
                } />
                <Route path="/tasks/:id" element={
                  <Suspense fallback={<TaskLoader />}>
                    <TaskDetail />
                  </Suspense>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ErrorBoundary>
          </main>
        </div>
      </TaskProvider>
    </TaskDataProvider>
  </Suspense>
</ErrorBoundary>
);
}

export default App;