import { useState, useEffect } from 'react'; 
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import { getTaskById, updateTask, deleteTask } from '../../services/taskService'; 
import { CATEGORIES, PRIORITIES } from '../../utils/constants'; 
import { formatDateTime, getDueDateLabel, isOverdue } from '../../utils/dateHelpers'; 
import LoadingSpinner from '../../components/common/LoadingSpinner'; 
import TaskForm from '../../components/tasks/TaskForm'; 
import toast from 'react-hot-toast';
 
export default function TaskDetails() { 
  const { taskId } = useParams(); 
  const navigate = useNavigate(); 
   
  const [task, setTask] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(''); 
  const [isEditing, setIsEditing] = useState(false); 
 
  useEffect(() => { 
    fetchTask(); 
  }, [taskId]); 
 
  const fetchTask = async () => { 
    setLoading(true); 
    const result = await getTaskById(taskId); 
    if (result.success) { 
      setTask(result.task); 
    } else { 
      setError(result.error); 
    } 
    setLoading(false); 
  }; 
 
  const handleToggleComplete = async () => { 
    const result = await updateTask(taskId, { completed: !task.completed }); 
    if (result.success) { 
      setTask({ ...task, completed: !task.completed });
      toast.success(task.completed ? 'Tarea marcada como pendiente' : 'Tarea completada');
    } else {
      toast.error('Error al actualizar la tarea');
    }
  }; 
 
  const handleDelete = async () => { 
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) { 
      const result = await deleteTask(taskId); 
      if (result.success) { 
        toast.success('Tarea eliminada');
        navigate('/dashboard'); 
      } else {
        toast.error('Error al eliminar la tarea');
      }
    } 
  }; 
 
  if (loading) return <LoadingSpinner />; 
  if (error) return ( 
    <div className="max-w-3xl mx-auto p-6 text-center"> 
      <div className="card"> 
        <p className="text-red-500 mb-4">{error}</p> 
        <Link to="/dashboard" className="btn-primary">Volver al Dashboard</Link> 
      </div> 
    </div> 
  ); 
 
  const category = CATEGORIES.find(c => c.id === task.category); 
  const priority = PRIORITIES.find(p => p.id === task.priority); 
 
  return ( 
    <div className="max-w-3xl mx-auto p-6"> 
      <div className="mb-6 flex justify-between items-center"> 
        <Link to="/dashboard" className="text-blue-600 hover:underline flex items-center gap-2"> 
          ← Volver 
        </Link> 
        <div className="flex gap-2"> 
          <button onClick={() => setIsEditing(true)} className="btn-secondary"> 
            Editar 
          </button> 
          <button onClick={handleDelete} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"> 
            Eliminar 
          </button> 
        </div> 
      </div> 
 
      {isEditing ? ( 
        <TaskForm  
          taskToEdit={task}  
          onClose={() => { 
            setIsEditing(false); 
            fetchTask(); 
          }}  
        /> 
      ) : ( 
        <div className={`card ${isOverdue(task.dueDate, task.completed) ? 'border-l-4 border-red-500' : ''}`}> 
          <div className="flex justify-between items-start mb-6"> 
            <div> 
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-2 bg-${category?.color}-100 dark:bg-${category?.color}-900 text-${category?.color}-800 dark:text-${category?.color}-200`}> 
                {category?.label} 
              </span> 
              <h1 className={`text-3xl font-bold ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}> 
                {task.title} 
              </h1> 
            </div> 
            <span className={`px-3 py-1 rounded-lg text-sm font-medium ${ 
              task.priority === 'high' ? 'bg-red-100 text-red-700' :  
              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700' 
            }`}> 
              Prioridad {priority?.label} 
            </span> 
          </div> 
 
          <div className="prose max-w-none mb-8"> 
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Descripción</h3> 
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap"> 
              {task.description || 'Sin descripción'} 
            </p> 
          </div> 
 
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-t border-b dark:border-gray-700 py-6"> 
            <div> 
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Vencimiento</dt> 
              <dd className={`text-lg font-semibold ${isOverdue(task.dueDate, task.completed) ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}> 
                {getDueDateLabel(task.dueDate) || 'Sin fecha'} 
              </dd> 
            </div> 
            <div> 
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Creada el</dt> 
              <dd className="text-lg font-semibold text-gray-900 dark:text-gray-100"> 
                {formatDateTime(task.createdAt)} 
              </dd> 
            </div> 
          </dl> 
 
          <div className="border-t pt-6 mt-6"> 
            <button 
              onClick={handleToggleComplete} 
              className={task.completed ? 'btn-secondary w-full' : 'btn-primary w-full'} 
            > 
              {task.completed ? 'Marcar como pendiente' : 'Marcar como completada'} 
            </button> 
          </div> 
        </div> 
      )} 
    </div> 
  ); 
}