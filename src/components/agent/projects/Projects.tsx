import React, { useState, useEffect, useRef } from 'react';
import {
  Plus,
  MoreHorizontal,
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  Circle,
  AlertTriangle,
  FolderOpen,
  X,
  Edit3,
  Trash2
} from 'lucide-react';

interface ProjectTask {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: Date;
  tags?: string[];
  estimatedHours?: number;
  actualHours?: number;
}

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed';
  progress: number;
  startDate: Date;
  endDate?: Date;
  team: string[];
  tasks: ProjectTask[];
  color: string;
}

const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'kanban' | 'timeline'>('grid');
  const [showNewTask, setShowNewTask] = useState(false);
  const [selectedProjectForTask, setSelectedProjectForTask] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProjectMenu(false);
      }
    };

    if (showProjectMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProjectMenu]);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    team: [] as string[],
    color: '#3B82F6'
  });
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'todo' as 'todo' | 'in-progress' | 'review' | 'done',
    priority: 'medium' as 'low' | 'medium' | 'high',
    assignee: '',
    dueDate: '',
    estimatedHours: 0
  });

  // Mock projects data
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design and improved UX',
      status: 'active',
      progress: 65,
      startDate: new Date(2024, 10, 1),
      endDate: new Date(2024, 11, 31),
      team: ['Alice', 'Bob', 'Charlie'],
      color: 'bg-blue-500',
      tasks: [
        {
          id: '1-1',
          title: 'Design mockups',
          status: 'done',
          priority: 'high',
          assignee: 'Alice',
          dueDate: new Date(2024, 10, 15)
        },
        {
          id: '1-2',
          title: 'Frontend development',
          status: 'in-progress',
          priority: 'high',
          assignee: 'Bob',
          dueDate: new Date(2024, 11, 20)
        },
        {
          id: '1-3',
          title: 'Content migration',
          status: 'todo',
          priority: 'medium',
          assignee: 'Charlie',
          dueDate: new Date(2024, 11, 25)
        }
      ]
    },
    {
      id: '2',
      name: 'Mobile App Development',
      description: 'Native mobile app for iOS and Android platforms',
      status: 'planning',
      progress: 15,
      startDate: new Date(2024, 11, 15),
      endDate: new Date(2025, 2, 28),
      team: ['David', 'Eve'],
      color: 'bg-green-500',
      tasks: [
        {
          id: '2-1',
          title: 'Requirements gathering',
          status: 'in-progress',
          priority: 'high',
          assignee: 'David'
        },
        {
          id: '2-2',
          title: 'UI/UX Design',
          status: 'todo',
          priority: 'high',
          assignee: 'Eve'
        }
      ]
    },
    {
      id: '3',
      name: 'Data Migration',
      description: 'Migrate legacy data to new system',
      status: 'completed',
      progress: 100,
      startDate: new Date(2024, 9, 1),
      endDate: new Date(2024, 10, 30),
      team: ['Frank', 'Grace'],
      color: 'bg-purple-500',
      tasks: [
        {
          id: '3-1',
          title: 'Data analysis',
          status: 'done',
          priority: 'high',
          assignee: 'Frank'
        },
        {
          id: '3-2',
          title: 'Migration scripts',
          status: 'done',
          priority: 'high',
          assignee: 'Grace'
        }
      ]
    }
  ]);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'on-hold': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getPriorityColor = (priority: ProjectTask['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const getTaskStatusIcon = (status: ProjectTask['status']) => {
    switch (status) {
      case 'done': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'review': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Circle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const calculateProjectStats = () => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'active').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const overdue = projects.filter(p => 
      p.endDate && p.endDate < new Date() && p.status !== 'completed'
    ).length;

    return { total, active, completed, overdue };
  };

  const stats = calculateProjectStats();

  // Project creation handler
  const handleCreateProject = () => {
    if (!newProject.name.trim()) return;

    const project: Project = {
      id: `project_${Date.now()}`,
      name: newProject.name,
      description: newProject.description,
      status: 'planning',
      progress: 0,
      startDate: new Date(newProject.startDate),
      endDate: newProject.endDate ? new Date(newProject.endDate) : undefined,
      team: newProject.team,
      color: newProject.color,
      tasks: []
    };

    setProjects(prev => [...prev, project]);
    setNewProject({
      name: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      team: [],
      color: '#3B82F6'
    });
    setShowNewProject(false);
  };

  // Task creation handler
  const handleCreateTask = () => {
    if (!newTask.title.trim() || !selectedProjectForTask) return;

    const task: ProjectTask = {
      id: `task_${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      priority: newTask.priority,
      assignee: newTask.assignee,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      estimatedHours: newTask.estimatedHours
    };

    setProjects(prev => prev.map(project =>
      project.id === selectedProjectForTask
        ? { ...project, tasks: [...project.tasks, task] }
        : project
    ));

    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assignee: '',
      dueDate: '',
      estimatedHours: 0
    });
    setShowNewTask(false);
    setSelectedProjectForTask(null);
  };

  // Task editing handlers
  const handleEditTask = (task: ProjectTask) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      assignee: task.assignee || '',
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '',
      estimatedHours: task.estimatedHours || 0
    });
    setSelectedProjectForTask(selectedProject);
    setShowNewTask(true);
  };

  const handleUpdateTask = () => {
    if (!newTask.title.trim() || !selectedProjectForTask || !editingTask) return;

    const updatedTask: ProjectTask = {
      ...editingTask,
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      priority: newTask.priority,
      assignee: newTask.assignee,
      dueDate: newTask.dueDate ? new Date(newTask.dueDate) : undefined,
      estimatedHours: newTask.estimatedHours
    };

    setProjects(prev => prev.map(project =>
      project.id === selectedProjectForTask
        ? {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === editingTask.id ? updatedTask : task
            )
          }
        : project
    ));

    setNewTask({
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      assignee: '',
      dueDate: '',
      estimatedHours: 0
    });
    setShowNewTask(false);
    setSelectedProjectForTask(null);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!selectedProject) return;

    setProjects(prev => prev.map(project =>
      project.id === selectedProject
        ? { ...project, tasks: project.tasks.filter(task => task.id !== taskId) }
        : project
    ));
  };

  const handleDeleteProject = () => {
    if (!selectedProject) return;

    setProjects(prev => prev.filter(project => project.id !== selectedProject));
    setSelectedProject(null);
    setShowDeleteConfirm(false);
    setShowProjectMenu(false);
  };

  // Render modals function to be used in both views
  const renderModals = () => (
    <>
      {/* Task Creation/Edit Modal */}
      {showNewTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              <button
                onClick={() => {
                  setShowNewTask(false);
                  setSelectedProjectForTask(null);
                  setEditingTask(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  rows={3}
                  placeholder="Task description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as 'low' | 'medium' | 'high'})}
                    className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Assignee</label>
                  <input
                    type="text"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({...newTask, assignee: e.target.value})}
                    className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                    placeholder="Assign to..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowNewTask(false);
                    setSelectedProjectForTask(null);
                    setEditingTask(null);
                  }}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={editingTask ? handleUpdateTask : handleCreateTask}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Project Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Delete Project</h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-muted-foreground">
                Are you sure you want to delete this project? This action cannot be undone and will permanently remove all tasks and data associated with this project.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProject}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Task status update handler
  const handleUpdateTaskStatus = (projectId: string, taskId: string, newStatus: ProjectTask['status']) => {
    setProjects(prev => prev.map(project =>
      project.id === projectId
        ? {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === taskId ? { ...task, status: newStatus } : task
            )
          }
        : project
    ));
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: ProjectTask['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (selectedProject) {
      handleUpdateTaskStatus(selectedProject, taskId, newStatus);
    }
  };

  // Main render function
  const selectedProjectData = selectedProject ? projects.find(p => p.id === selectedProject) : null;

  return (
    <div className="h-full overflow-y-auto pb-4">
      {selectedProject && selectedProjectData ? (
        // Kanban Board View
        (() => {
          const kanbanColumns = [
            { id: 'todo', title: 'To Do', tasks: selectedProjectData.tasks.filter(t => t.status === 'todo') },
            { id: 'in-progress', title: 'In Progress', tasks: selectedProjectData.tasks.filter(t => t.status === 'in-progress') },
            { id: 'review', title: 'Review', tasks: selectedProjectData.tasks.filter(t => t.status === 'review') },
            { id: 'done', title: 'Done', tasks: selectedProjectData.tasks.filter(t => t.status === 'done') }
          ];

          return (
      <div className="h-full overflow-y-auto pb-4">
        {/* Project Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedProject(null)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                ←
              </button>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">{selectedProjectData.name}</h2>
                <p className="text-muted-foreground">{selectedProjectData.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProjectData.status)}`}>
                {selectedProjectData.status.replace('-', ' ')}
              </span>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowProjectMenu(!showProjectMenu)}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {showProjectMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(true);
                          setShowProjectMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-accent transition-colors"
                      >
                        Delete Project
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-muted-foreground">Progress</span>
              </div>
              <p className="text-lg font-semibold text-foreground">{selectedProjectData.progress}%</p>
              <div className="w-full bg-secondary rounded-full h-2 mt-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${selectedProjectData.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Tasks</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {selectedProjectData.tasks.filter(t => t.status === 'done').length}/{selectedProjectData.tasks.length}
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Users className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-muted-foreground">Team</span>
              </div>
              <p className="text-lg font-semibold text-foreground">{selectedProjectData.team.length}</p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">Deadline</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {selectedProjectData.endDate ? formatDate(selectedProjectData.endDate) : 'No deadline'}
              </p>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {kanbanColumns.map((column) => (
            <div
              key={column.id}
              className="bg-card border border-border rounded-lg p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id as ProjectTask['status'])}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">{column.title}</h3>
                <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs">
                  {column.tasks.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                    className="bg-background border border-border rounded-lg p-3 hover:shadow-md transition-shadow cursor-move"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-foreground text-sm">{task.title}</h4>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                    </div>
                    
                    {task.description && (
                      <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const nextStatus = task.status === 'todo' ? 'in-progress' :
                                             task.status === 'in-progress' ? 'review' :
                                             task.status === 'review' ? 'done' : 'todo';
                            handleUpdateTaskStatus(selectedProject!, task.id, nextStatus);
                          }}
                          className="hover:scale-110 transition-transform"
                        >
                          {getTaskStatusIcon(task.status)}
                        </button>
                        {task.assignee && (
                          <span className="text-xs text-muted-foreground">{task.assignee}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {task.dueDate && (
                          <span className="text-xs text-muted-foreground mr-2">
                            {formatDate(task.dueDate)}
                          </span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTask(task);
                          }}
                          className="p-1 hover:bg-accent rounded transition-colors"
                          title="Edit task"
                        >
                          <Edit3 className="w-3 h-3 text-muted-foreground hover:text-foreground" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(task.id);
                          }}
                          className="p-1 hover:bg-accent rounded transition-colors"
                          title="Delete task"
                        >
                          <Trash2 className="w-3 h-3 text-muted-foreground hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={() => {
                    setSelectedProjectForTask(selectedProject);
                    setNewTask(prev => ({...prev, status: column.id as ProjectTask['status']}));
                    setEditingTask(null); // Ensure we're not in edit mode
                    setShowNewTask(true);
                  }}
                  className="w-full p-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-muted-foreground hover:text-primary"
                >
                  <Plus className="w-4 h-4 mx-auto" />
                </button>
              </div>
            </div>
          ))}
        </div>
            </div>
          );
        })()
      ) : (
        // Projects Grid View
        <div className="h-full overflow-y-auto pb-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-foreground">Projects</h2>
          <button
            onClick={() => setShowNewProject(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>

        {/* Project Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FolderOpen className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{stats.total}</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{stats.active}</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{stats.completed}</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Overdue</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{stats.overdue}</p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project.id)}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${project.color}`}></div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {project.name}
                </h3>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                {project.status.replace('-', ' ')}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {project.description}
            </p>
            
            <div className="space-y-3">
              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${project.color}`}
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Team and Tasks */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{project.team.length} members</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {project.tasks.filter(t => t.status === 'done').length}/{project.tasks.length} tasks
                  </span>
                </div>
              </div>
              
              {/* Deadline */}
              {project.endDate && (
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Due {formatDate(project.endDate)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Project Creation Modal */}
      {showNewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Create New Project</h3>
              <button
                onClick={() => setShowNewProject(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  rows={3}
                  placeholder="Project description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({...newProject, startDate: e.target.value})}
                    className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">End Date</label>
                  <input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({...newProject, endDate: e.target.value})}
                    className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowNewProject(false)}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        </div>
      )}

      {/* Render modals */}
      {renderModals()}
    </div>
  );
};

export default Projects;
