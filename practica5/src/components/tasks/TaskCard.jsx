import { Link } from 'react-router-dom'; 
import { updateTask, deleteTask } from '../../services/taskService'; 
import { CATEGORIES } from '../../utils/constants'; 
import { getDueDateLabel, isOverdue } from '../../utils/dateHelpers'; 
import toast from 'react-hot-toast';
 
export default function TaskCard({ task }) { 
  const category = CATEGORIES.find(c => c.id === task.category); 
  const isTaskOverdue = isOverdue(task.dueDate, task.completed);
  const dueDateLabel = getDueDateLabel(task.dueDate);
   
  const handleToggleComplete = async (e) => { 
    e.preventDefault();
    const result = await updateTask(task.id, { completed: !task.completed });
    if (result.success) {
      toast.success(task.completed ? 'Tarea marcada como pendiente' : 'Tarea completada');
    } else {
      toast.error('Error al actualizar la tarea');
    }
  }; 
   
  const handleDelete = async (e) => { 
    e.preventDefault();
    if (window.confirm('¿Deseas eliminar esta tarea?')) {
      const result = await deleteTask(task.id);
      if (result.success) {
        toast.success('Tarea eliminada');
      } else {
        toast.error('Error al eliminar la tarea');
      }
    }
  }; 
   
  return ( 
    <Link to={`/tasks/${task.id}`} className="block"> 
      <div className={`card hover:shadow-lg transition-shadow ${isTaskOverdue ? 'border-r-4 border-red-500' : ''} ${task.completed ? 'opacity-60' : ''}`}> 
        {/* Encabezado con título y categoría */}
        <div className="flex items-start justify-between mb-2">
          <h3 className={`text-lg font-semibold flex-1 dark:text-white ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
            {task.title}
          </h3>
          {category && (
            <span className={`text-xs font-medium px-2 py-1 rounded-full ml-2 bg-${category.color}-100 text-${category.color}-800`}>
              {category.label}
            </span>
          )}
        </div>

        {/* Descripción */}
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Fecha de vencimiento y estado */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm">
            {dueDateLabel && (
              <span className={`${isTaskOverdue ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                📅 {dueDateLabel}
              </span>
            )}
            <span className={`text-xs font-medium ${task.completed ? 'text-green-600' : 'text-orange-600'}`}>
              {task.completed ? '✓ Completada' : '○ Pendiente'}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={handleToggleComplete}
            className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
              task.completed
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {task.completed ? 'Marcar pendiente' : 'Marcar completada'}
          </button>
          <button
            onClick={handleDelete}
            className="py-2 px-3 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 transition-colors"
          >
            🗑️ Eliminar
          </button>
        </div>
      </div> 
    </Link> 
  ); 
}