<template>
  <AppLayout>
    <div class="flex flex-col h-full">
      <div class="mb-6">
        <h2 class="text-3xl font-bold mb-2 transition-colors duration-300" 
            :class="[isDark ? 'text-text-dark-primary' : 'text-text-light-primary']">
          Task Dashboard
        </h2>
        <p class="text-sm transition-colors duration-300"
           :class="[isDark ? 'text-text-dark-tertiary' : 'text-text-light-tertiary']">
          Manage your tasks efficiently with our Ocean Blue Serenity theme
        </p>
      </div>
      
      <TaskList 
        class="flex-grow"
        :allTasks="tasks"
        @create-task="handleCreateTask"
        @view-task="handleViewTask"
        @update-task="handleUpdateTask"
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
import { ref, onMounted, onBeforeUnmount } from 'vue'; 

const isModalVisible = ref(false);
const isViewing = ref(false); 
const taskToEdit = ref(null); 

const tasks = ref([
  { 
    id: 1, 
    title: 'Finalize Frontend UI Interactions', 
    description: 'Implement the requested dropdown menu actions (View, Update, Delete) for TaskItem.', 
    status: 'to-do', 
    dueDate: '2025-05-15', 
    recurrence: 'none', 
    timeSpent: 0,
    subtasks: [ 
      { id: 101, title: 'Refactor TaskItem for title-only display', status: 'done' },
      { id: 102, title: 'Implement TaskItem dropdown', status: 'to-do' },
      { id: 103, title: 'Update Dashboard handlers for View/Delete', status: 'to-do' },
    ]
  },
  { 
    id: 2, 
    title: 'Start API Service Layer (Task 3.1)', 
    description: 'Create the axios wrapper and initial API calls.', 
    status: 'in-progress', 
    dueDate: '2025-05-18', 
    recurrence: 'none', 
    timeSpent: 30,
    subtasks: [
      { id: 201, title: 'Create api.js file', status: 'done' },
      { id: 202, title: 'Setup Task API calls (GET/POST)', status: 'in-progress' },
    ]
  },
  { 
    id: 3, 
    title: 'Deploy Backend to Cloud', 
    description: 'Configure environment variables and deploy the Node/Express server.', 
    status: 'review', 
    dueDate: '2025-05-20', 
    recurrence: 'weekly', 
    timeSpent: 60,
    subtasks: []
  },
  { 
    id: 4, 
    title: 'UI Structure Complete (Task 2.2.5)', 
    description: 'Task 2.2.5 is finished and committed.', 
    status: 'done', 
    dueDate: '2025-05-10', 
    recurrence: 'none', 
    timeSpent: 240,
    subtasks: []
  },
]);

const closeModal = () => {
  isModalVisible.value = false;
  isViewing.value = false; 
  taskToEdit.value = null; 
};

const handleCreateTask = (status) => {
  isViewing.value = false; 
  taskToEdit.value = { 
    id: null, 
    title: '', 
    description: '', 
    status: status,
    dueDate: new Date().toISOString().substring(0, 10),
    recurrence: 'none',
    timeSpent: 0,
    subtasks: [] 
  }; 
  isModalVisible.value = true;
};

const handleViewTask = (task) => {
  isViewing.value = true; 
  taskToEdit.value = task;
  isModalVisible.value = true;
};

const handleUpdateTask = (task) => {
  isViewing.value = false; 
  taskToEdit.value = task;
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
      tasks.value[index] = { ...updatedTask, subtasks: tasks.value[index].subtasks || [] };
    }
  } else {
    const newId = Math.max(...tasks.value.map(t => t.id), 0) + 1;
    tasks.value.push({ ...updatedTask, id: newId, subtasks: updatedTask.subtasks || [] });
  }
  closeModal();
};

const isDark = ref(false);

const checkTheme = () => {
  isDark.value = document.documentElement.classList.contains('dark');
};

let themeObserver = null;

onMounted(() => {
  checkTheme();
  
  const handleThemeChange = (event) => {
    isDark.value = event.detail.isDark;
  };
  window.addEventListener('theme-changed', handleThemeChange);
  
  themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        checkTheme();
      }
    });
  });
  
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener('theme-changed', handleThemeChange);
    if (themeObserver) {
      themeObserver.disconnect();
    }
  });
});
</script>