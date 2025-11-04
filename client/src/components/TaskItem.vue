<template>
  <div class="p-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
       :class="[isDark 
                ? 'bg-bg-dark-base border border-border-dark hover:shadow-accent-primary/20' 
                : 'bg-bg-light-elevated border border-border-light hover:shadow-accent-dark-primary/20']">
    
    <header class="flex justify-between items-center">
      <h4 class="font-bold text-base line-clamp-2 pr-4" 
          :class="[isDark ? 'text-text-dark-primary' : 'text-text-light-primary']">
        {{ task.title }}
      </h4>
      
      <div class="relative flex-shrink-0">
        <button @click.stop="toggleMenu"
                class="p-1 rounded-full ml-2 transition-colors duration-200"
                :class="[isDark ? 'text-text-dark-secondary hover:bg-bg-dark-elevated' : 'text-text-light-secondary hover:bg-bg-light-hover']">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path></svg>
        </button>
        
        <transition name="dropdown-fade">
          <div v-if="isMenuOpen"
               @click.stop
               class="absolute right-0 mt-2 w-40 rounded-lg shadow-xl py-1 z-20 origin-top-right ring-1 ring-opacity-5 transition-colors duration-300"
               :class="[isDark ? 'bg-bg-dark-elevated ring-border-dark' : 'bg-white ring-border-light']">
            
            <a href="#" @click.prevent="emitAction('view')"
               class="block px-4 py-2 text-sm font-medium transition-colors duration-150"
               :class="[isDark ? 'text-text-dark-secondary hover:bg-bg-dark-base hover:text-text-dark-primary' : 'text-text-light-secondary hover:bg-bg-light-hover hover:text-text-light-primary']">
              View Details ({{ task.subtasks ? task.subtasks.length : 0 }})
            </a>
            
            <a href="#" @click.prevent="emitAction('update')"
               class="block px-4 py-2 text-sm font-medium transition-colors duration-150"
               :class="[isDark ? 'text-text-dark-secondary hover:bg-bg-dark-base hover:text-text-dark-primary' : 'text-text-light-secondary hover:bg-bg-light-hover hover:text-text-light-primary']">
              Update Task
            </a>

            <a href="#" @click.prevent="emitAction('delete')"
               class="block px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors duration-150"
               :class="[isDark ? 'hover:bg-bg-dark-base' : '']">
              Delete Task
            </a>
          </div>
        </transition>
      </div>
    </header>
    
    <div v-if="task.subtasks && task.subtasks.length > 0" class="mt-2 text-xs font-medium"
         :class="[isDark ? 'text-accent-primary' : 'text-accent-dark-primary']">
      {{ task.subtasks.filter(s => s.status === 'done').length }}/{{ task.subtasks.length }} Subtasks
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const emit = defineEmits(['view', 'update', 'delete']);

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
      status: 'to-do',
      subtasks: [] 
    })
  }
});

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const emitAction = (action) => {
  isMenuOpen.value = false; 
  emit(action, props.task);
};

const handleClickOutside = (event) => {
  if (isMenuOpen.value && !event.target.closest('.relative')) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
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
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
});

onBeforeUnmount(() => {
  window.removeEventListener('theme-changed', handleThemeChange);
  if (themeObserver) {
    themeObserver.disconnect();
  }
});
</script>

<style scoped>
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>