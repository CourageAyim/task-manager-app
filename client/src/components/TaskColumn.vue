<template>
  <div class="flex flex-col rounded-xl p-5 shadow-lg transition-all duration-300 h-full"
       :class="[isDark ? 'bg-bg-dark-elevated border border-border-dark' : 'bg-bg-light-elevated border border-border-light']">
    
    <header class="flex justify-between items-center pb-4 mb-4 border-b transition-colors duration-300"
            :class="[isDark ? 'border-border-dark' : 'border-border-light']">
      <div class="flex items-center gap-3">
        <h3 class="text-lg font-bold transition-colors duration-300" 
            :class="[isDark ? 'text-text-dark-primary' : 'text-text-light-primary']">
          {{ title }}
        </h3>
        <span class="px-2.5 py-1 rounded-full text-xs font-bold transition-colors duration-300" 
              :class="statusClasses">
          {{ mockTasks.length }} </span>
      </div>
      
      <button @click="addTask" 
              class="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
              :class="[isDark ? 'text-accent-primary hover:bg-bg-dark-base' : 'text-accent-dark-primary hover:bg-bg-light-hover']">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
      </button>
    </header>
    
    <div class="flex-grow overflow-y-auto space-y-4">
      
      <TaskItem 
        v-for="task in mockTasks" 
        :key="task.id" 
        :task="task" 
      />
      
      <p v-if="mockTasks.length === 0" class="text-center py-8 text-sm"
         :class="[isDark ? 'text-text-dark-tertiary' : 'text-text-light-tertiary']">
        No tasks in this column. Click + to add one.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'; 
import TaskItem from './TaskItem.vue'; 
const props = defineProps({
  title: { type: String, required: true },
  status: { type: String, required: true },
  taskCount: { type: Number, default: 0 },
});

const isDark = ref(document.documentElement.classList.contains('dark'));
let themeObserver = null;

const checkTheme = () => {
  isDark.value = document.documentElement.classList.contains('dark');
};

const handleThemeChange = (event) => {
  isDark.value = event.detail.isDark;
};

onMounted(() => {
  checkTheme();
  
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

const mockTasks = computed(() => {
  if (props.status === 'to-do') {
    return [
      {
        id: 1,
        title: 'Complete Kanban Board Structure (Task 2.2.3)',
        description: 'Finalize the TaskItem card, ensuring all required fields are displayed and colors are correctly applied.',
        dueDate: new Date(Date.now() + 86400000).toISOString(), 
        timeSpent: 45,
        recurrence: 'none',
        status: props.status
      },
      {
        id: 2,
        title: 'Review and Commit New Color Palette',
        description: 'Verify all AppLayout and DashboardView components use the new semantic Tailwind classes for perfect contrast in both light and dark modes.',
        dueDate: new Date(Date.now() + 172800000).toISOString(),
        timeSpent: 120,
        recurrence: 'weekly',
        status: props.status
      },
    ];
  }
  return []; 
});

const statusClasses = computed(() => {
  switch (props.status) {
    case 'to-do':
      return isDark.value 
        ? 'bg-accent-primary text-bg-dark-base' 
        : 'bg-accent-dark-primary text-white';
    case 'in-progress':
      return 'bg-yellow-500 text-gray-900';
    case 'review':
      return 'bg-indigo-500 text-white';
    case 'done':
      return 'bg-green-600 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
});

const addTask = () => {
  console.log(`Add task button clicked for column: ${props.title}`);
};

</script>