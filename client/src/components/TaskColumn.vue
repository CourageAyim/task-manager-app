<template>
  <div class="flex flex-col rounded-xl p-5 shadow-lg transition-all duration-300 h-full"
       :class="[isDark ? 'bg-bg-dark-elevated border border-border-dark' : 'bg-bg-light-elevated border border-border-light']">
    
    <!-- Column Header -->
    <header class="flex justify-between items-center pb-4 mb-4 border-b transition-colors duration-300"
            :class="[isDark ? 'border-border-dark' : 'border-border-light']">
      <div class="flex items-center gap-3">
        <h3 class="text-lg font-bold transition-colors duration-300" 
            :class="[isDark ? 'text-text-dark-primary' : 'text-text-light-primary']">
          {{ title }}
        </h3>
        <span class="px-2.5 py-1 rounded-full text-xs font-bold transition-colors duration-300" 
              :class="statusClasses">
          {{ taskCount }}
        </span>
      </div>
      
      <button @click="addTask" 
              class="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
              :class="[isDark ? 'text-accent-primary hover:bg-bg-dark-base' : 'text-accent-dark-primary hover:bg-bg-light-hover']">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
      </button>
    </header>
    
    <!-- Task Cards Container -->
    <div class="flex-grow overflow-y-auto space-y-3 pr-1">
      <div v-for="i in taskCount" 
           :key="i" 
           class="group p-4 rounded-lg shadow transition-all duration-200 cursor-pointer border"
           :class="[
             isDark 
               ? 'bg-bg-dark-base border-border-dark hover:border-accent-primary hover:shadow-lg hover:shadow-accent-primary/10' 
               : 'bg-white border-border-light hover:border-accent-dark-primary hover:shadow-lg hover:shadow-accent-dark-primary/10'
           ]">
        
        <!-- Task Title -->
        <div class="flex items-start justify-between gap-2 mb-2">
          <p class="font-semibold text-sm leading-snug transition-colors duration-300" 
             :class="[isDark ? 'text-text-dark-primary' : 'text-text-light-primary']">
            Placeholder Task Title {{ i }}
          </p>
          <button class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-error"
                  :class="[isDark ? 'text-text-dark-tertiary' : 'text-text-light-tertiary']">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Task Meta Info -->
        <div class="flex items-center gap-3 text-xs">
          <span class="flex items-center gap-1 transition-colors duration-300" 
                :class="[isDark ? 'text-text-dark-tertiary' : 'text-text-light-tertiary']">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Today
          </span>
          <span class="px-2 py-0.5 rounded text-xs font-medium"
                :class="statusBadgeClasses">
            {{ statusLabel }}
          </span>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="taskCount === 0" 
           class="flex flex-col items-center justify-center py-12 px-4 text-center">
        <svg class="w-16 h-16 mb-3 transition-colors duration-300" 
             :class="[isDark ? 'text-text-dark-tertiary' : 'text-text-light-tertiary']"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
        </svg>
        <p class="text-sm font-medium transition-colors duration-300" 
           :class="[isDark ? 'text-text-dark-tertiary' : 'text-text-light-tertiary']">
          No tasks yet
        </p>
        <p class="text-xs mt-1 transition-colors duration-300" 
           :class="[isDark ? 'text-text-dark-tertiary' : 'text-text-light-tertiary']">
          Click + to add a task
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  title: { type: String, required: true },
  status: { type: String, required: true },
  taskCount: { type: Number, default: 0 },
});

// Reactive dark mode detection
const isDark = ref(false);

const checkTheme = () => {
  isDark.value = document.documentElement.classList.contains('dark');
};

let themeObserver = null;

onMounted(() => {
  // Initial check
  checkTheme();
  
  // Listen for custom theme change event
  const handleThemeChange = (event) => {
    isDark.value = event.detail.isDark;
  };
  window.addEventListener('theme-changed', handleThemeChange);
  
  // Also observe DOM changes with MutationObserver
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
  
  // Cleanup
  onBeforeUnmount(() => {
    window.removeEventListener('theme-changed', handleThemeChange);
    if (themeObserver) {
      themeObserver.disconnect();
    }
  });
});

// Status badge for column header
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

// Status badge for individual task cards
const statusBadgeClasses = computed(() => {
  const base = isDark.value ? 'bg-bg-dark-header' : 'bg-bg-light-hover';
  const textColor = isDark.value ? 'text-text-dark-secondary' : 'text-text-light-secondary';
  return `${base} ${textColor}`;
});

// Status label
const statusLabel = computed(() => {
  return props.status.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
});

// Add task function (placeholder)
const addTask = () => {
  console.log(`Add task to ${props.title}`);
  // Future: Emit event or call API
};
</script>