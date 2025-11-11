<template>
  <AppLayout>
    <div class="flex flex-col h-full">
      <div class="mb-6">
        <h2 class="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
          Task Dashboard
        </h2>
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Manage your tasks efficiently
        </p>
      </div>
      
      <TaskList 
        class="flex-grow"
        :allTasks="tasks"
        @create-task="handleCreateTask"
        @view-task="handleViewTask"
        @edit-task="handleEditTask"
        @update-task="handleSaveTask"
        @delete-task="handleDeleteTask"
      /> 
    </div>
    
    <TaskForm
      :isVisible="isModalVisible"
      :task="taskToEdit"
      :isReadOnly="isViewing"
      @close="closeModal"
      @save="handleSaveTask"
    />
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import TaskList from '../components/TaskList.vue'
import TaskForm from '../components/TaskForm.vue'
import { ref } from 'vue'; 

const isModalVisible = ref(false);
const isViewing = ref(false);
const taskToEdit = ref(null);

const tasks = ref([
  {
    id: 1,
    title: 'Complete Kanban Board Structure (Task 2.2.3)',
    description: 'Finalize the TaskItem card, ensuring all required fields are displayed and colors are correctly applied.',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().substring(0, 10), 
    timeSpent: 45,
    recurrence: 'none',
    status: 'to-do',
    subtasks: [
      { id: 101, title: 'Define TaskItem component structure', status: 'done' },
      { id: 102, title: 'Implement status change dropdown', status: 'in-progress' },
      { id: 103, title: 'Finalize layout and styling', status: 'to-do' },
    ]
  },
  { 
    id: 2, 
    title: 'Review and Commit New Color Palette', 
    description: 'Verify all AppLayout and DashboardView components use the new semantic Tailwind classes for perfect contrast in both light and dark modes.', 
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().substring(0, 10), 
    timeSpent: 120, 
    recurrence: 'weekly', 
    status: 'in-progress', 
    subtasks: [] 
  },
  { 
    id: 3, 
    title: 'Set up Backend Task Routes (Task 1.3)', 
    description: 'Verify CRUD operations for Task model against MongoDB and ensure RBAC/Ownership checks are enforced.', 
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString().substring(0, 10), 
    timeSpent: 240, 
    recurrence: 'none', 
    status: 'review', 
    subtasks: [] 
  },
  { 
    id: 4, 
    title: 'Complete Initial Wireframes', 
    description: 'Initial low-fidelity design mockups for the main Kanban and Dashboard views.', 
    dueDate: new Date(Date.now() - 86400000 * 3).toISOString().substring(0, 10), 
    timeSpent: 180, 
    recurrence: 'none', 
    status: 'done', 
    subtasks: [] 
  },
]);

const closeModal = () => {
  isModalVisible.value = false;
  isViewing.value = false;
  taskToEdit.value = null; 
};

const handleCreateTask = (payload) => {
  taskToEdit.value = { 
    id: null, 
    title: '',
    description: '',
    dueDate: new Date().toISOString().substring(0, 10), 
    timeSpent: 0,
    recurrence: 'none',
    status: payload.status, 
    subtasks: []
  };
  isViewing.value = false; 
  isModalVisible.value = true; 
};

const handleViewTask = (task) => {
  taskToEdit.value = task;
  isViewing.value = true;
  isModalVisible.value = true;
};

const handleEditTask = (task) => {
  taskToEdit.value = task;
  isViewing.value = false;
  isModalVisible.value = true;
};

const handleDeleteTask = (task) => {
  if (confirm(`Are you sure you want to delete the task: "${task.title}"?`)) {
    tasks.value = tasks.value.filter(t => t.id !== task.id);
  }
};

const handleSaveTask = (updatedTask) => {
  if (updatedTask.id) {
    const index = tasks.value.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      tasks.value[index] = updatedTask; 
    }
  } else {
    const newId = Math.max(...tasks.value.map(t => t.id), 0) + 1;
    tasks.value.push({ ...updatedTask, id: newId });
  }
  
  if (isModalVisible.value) {
    closeModal();
  }
};
</script>