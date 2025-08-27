import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { useTasks } from '../hooks/useTasks';
import { format } from 'date-fns';

export function Dashboard() {
  const { taskStats, priorityStats, upcomingTasks, allTasks } = useTasks();

  const recentTasks = useMemo(() => 
    allTasks
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 6),
    [allTasks]
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your tasks and current progress
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tasks"
          value={taskStats.total}
          icon={CheckCircle}
          color="blue"
          subtitle={`${taskStats.completionRate}% completed`}
        />
        <StatsCard
          title="Completed"
          value={taskStats.completed}
          icon={CheckCircle}
          color="green"
          subtitle="Finished tasks"
        />
        <StatsCard
          title="In Progress"
          value={taskStats.inProgress}
          icon={Clock}
          color="orange"
          subtitle="Active tasks"
        />
        <StatsCard
          title="High Priority"
          value={priorityStats.high}
          icon={AlertTriangle}
          color="red"
          subtitle="Urgent tasks"
        />
      </div>

      {upcomingTasks.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-yellow-600" size={20} />
            <h2 className="text-lg font-semibold text-yellow-800">
              Upcoming Due Dates
            </h2>
          </div>
          <div className="space-y-3">
            {upcomingTasks.slice(0, 3).map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between bg-white p-3 rounded-md"
              >
                <div>
                  <p className="font-medium text-gray-900">{task.title}</p>
                  <p className="text-sm text-gray-600">
                    Due on {task.dueDate ? format(task.dueDate, 'MM/dd/yyyy') : 'N/A'}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.priority === 'High' ? 'bg-red-100 text-red-800' :
                  task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
            {upcomingTasks.length > 3 && (
              <p className="text-sm text-yellow-700 text-center">
                And {upcomingTasks.length - 3} more tasks...
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Tasks by Priority</h2>
            <TrendingUp className="text-gray-400" size={20} />
          </div>
          <div className="space-y-4">
            {[
              { label: 'High', value: priorityStats.high, color: 'bg-red-500' },
              { label: 'Medium', value: priorityStats.medium, color: 'bg-yellow-500' },
              { label: 'Low', value: priorityStats.low, color: 'bg-green-500' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded-full ${color}`}></div>
                  <span className="text-gray-700">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${color}`}
                      style={{
                        width: `${taskStats.total > 0 ? (value / taskStats.total) * 100 : 0}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-8">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <Link
              to="/tasks"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {recentTasks.slice(0, 4).map(task => (
              <div
                key={task.id}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <Link 
                    to={`/tasks/${task.id}`}
                    className="font-medium text-gray-900 truncate flex-1 hover:text-blue-600 transition-colors"
                  >
                    {task.title}
                  </Link>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === 'Done' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status === 'Done' ? 'Done' :
                     task.status === 'In Progress' ? 'In Progress' : 'To Do'}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Updated {format(task.updatedAt, 'MM/dd/yyyy HH:mm')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          View All Tasks
          <CheckCircle size={20} />
        </Link>
      </div>
    </div>
  );
}