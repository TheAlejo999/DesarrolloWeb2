import { useTaskStore } from '../../store/taskStore';
import { isOverdue } from '../../utils/dateHelpers';

export default function TaskStats() {
  const tasks = useTaskStore((state) => state.tasks);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => isOverdue(t.dueDate, t.completed)).length,
    completionPercentage: tasks.length > 0 
      ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
      : 0
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      {/* Total de tareas */}
      <div className="card bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500">
        <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Total de tareas</p>
        <h3 className="text-3xl font-bold text-blue-700 dark:text-blue-200 mt-2">{stats.total}</h3>
      </div>

      {/* Tareas completadas */}
      <div className="card bg-green-50 dark:bg-green-900 border-l-4 border-green-500">
        <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Completadas</p>
        <h3 className="text-3xl font-bold text-green-700 dark:text-green-200 mt-2">{stats.completed}</h3>
      </div>

      {/* Tareas pendientes */}
      <div className="card bg-orange-50 dark:bg-orange-900 border-l-4 border-orange-500">
        <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Pendientes</p>
        <h3 className="text-3xl font-bold text-orange-700 dark:text-orange-200 mt-2">{stats.pending}</h3>
      </div>

      {/* Tareas vencidas */}
      <div className="card bg-red-50 dark:bg-red-900 border-l-4 border-red-500">
        <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Vencidas</p>
        <h3 className="text-3xl font-bold text-red-700 dark:text-red-200 mt-2">{stats.overdue}</h3>
      </div>

      {/* Porcentaje de completitud */}
      <div className="card bg-purple-50 dark:bg-purple-900 border-l-4 border-purple-500">
        <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Completitud</p>
        <div className="flex items-center gap-2 mt-2">
          <h3 className="text-3xl font-bold text-purple-700 dark:text-purple-200">{stats.completionPercentage}%</h3>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500 transition-all duration-300"
            style={{ width: `${stats.completionPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
