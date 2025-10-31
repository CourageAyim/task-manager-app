<template>
  <div class="p-4 rounded-xl shadow-lg cursor-pointer transition-all duration-300 transform hover:scale-[1.01]"
       :class="[isDark 
                ? 'bg-bg-dark-base border border-border-dark hover:shadow-accent-primary/20' 
                : 'bg-bg-light-elevated border border-border-light hover:shadow-accent-dark-primary/20']"
       @click="editTask">
    
    <header class="flex justify-between items-start mb-2">
      <h4 class="font-bold text-base line-clamp-2" 
          :class="[isDark ? 'text-text-dark-primary' : 'text-text-light-primary']">
        {{ task.title }}
      </h4>
      <button class="flex-shrink-0 p-1 rounded-full ml-2 transition-colors duration-200"
              :class="[isDark ? 'text-text-dark-secondary hover:bg-bg-dark-elevated' : 'text-text-light-secondary hover:bg-bg-light-hover']">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
      </button>
    </header>
    
    <p v-if="task.description" 
       class="text-xs mt-1 line-clamp-3" 
       :class="[isDark ? 'text-text-dark-tertiary' : 'text-text-light-secondary']">
      {{ task.description }}
    </p>

    <div class="mt-3 pt-3 border-t"
         :class="[isDark ? 'border-bg-dark-elevated' : 'border-bg-light-hover']">
      
      <div class="flex items-center text-xs font-medium"
           :class="[isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary']">
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        <span>Due: {{ formatDate(task.dueDate) }}</span>
      </div>

      <div v-if="task.timeSpent > 0" class="flex items-center text-xs mt-1"
           :class="[isDark ? 'text-text-dark-tertiary' : 'text-text-light-tertiary']">
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <span>Time Spent: {{ formatTime(task.timeSpent) }}</span>
      </div>
      
      <div v-if="task.recurrence !== 'none'" class="flex items-center text-xs mt-1"
           :class="[isDark ? 'text-accent-primary' : 'text-accent-dark-primary']">
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356-2A8.001 8.001 0 004.582 19m9.626 0H9.582m7.962-4l-3-3m0 0l-3 3"></path></svg>
        <span class="font-medium">Repeats: {{ task.recurrence }}</span>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  task: {
    type: Object,
    required: true,
    default: () => ({
      title: 'Default Task',
      description: 'Default description of the task.',
      dueDate: new Date(),
      timeSpent: 0, 
      recurrence: 'none', 
      status: 'to-do'
    })
  }
});

const isDark = ref(document.documentElement.classList.contains('dark'));
let themeObserver = null;
const checkTheme = () => {
  isDark.value = document.documentElement.classList.contains('dark');
};

onMounted(() => {
  checkTheme();
  themeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'class') {
        checkTheme();
      }
    });
  });
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});

onBeforeUnmount(() => {
  if (themeObserver) {
    themeObserver.disconnect();
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatTime = (minutes) => {
  if (minutes === 0) return '0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  let timeString = '';
  if (h > 0) timeString += `${h}h `;
  if (m > 0) timeString += `${m}m`;
  return timeString.trim();
};

const editTask = () => {
  console.log(`Open edit modal for task: ${props.task.title}`);
};

import { onBeforeUnmount } from 'vue';
</script>