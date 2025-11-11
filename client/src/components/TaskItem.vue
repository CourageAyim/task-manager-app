<template>
  <div class="group relative flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
    <div :class="statusDotClasses(task.status)" class="w-1 h-8 rounded-full flex-shrink-0" />
    
    <div class="flex-1 min-w-0">
      <div class="flex items-start justify-between gap-2 mb-1">
        <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {{ task.title }}
        </h4>
        
        <div class="relative" ref="dropdownRef">
          <button
            @click.stop="toggleMenu"
            class="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-opacity"
          >
            <svg class="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
            </svg>
          </button>

          <transition name="dropdown-fade">
            <div v-if="isMenuOpen" 
                 class="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
              
              <div v-if="!showStatusMenu">
                <button
                  @click.stop.prevent="showStatusMenu = true"
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between"
                >
                  <span>Change Status</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button
                  @click.stop.prevent="viewTask"
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  View Details
                </button>
                
                <button
                  @click.stop.prevent="editTask"
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Edit Task
                </button>
                
                <div class="border-t border-gray-200 dark:border-gray-700 my-1" />
                
                <button
                  @click.stop.prevent="deleteTask"
                  class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Delete Task
                </button>
              </div>

              <div v-if="showStatusMenu">
                <button
                  @click.stop.prevent="showStatusMenu = false"
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back</span>
                </button>
                
                <div class="border-t border-gray-200 dark:border-gray-700 my-1" />
                <div class="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Move to
                </div>
                
                <button
                  v-for="statusOption in statuses"
                  :key="statusOption.value"
                  @click.stop.prevent="changeStatus(statusOption.value)"
                  :disabled="task.status === statusOption.value"
                  class="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span :class="statusDotClasses(statusOption.value)" class="w-2 h-2 rounded-full" />
                  <span>{{ statusOption.label }}</span>
                  <svg v-if="task.status === statusOption.value" class="w-3 h-3 ml-auto text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div class="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
        <div class="flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span :class="{'text-red-500 font-bold': isOverdue}">{{ displayDueDate }}</span>
        </div>
        <div class="flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ formatTime(task.timeSpent) }}</span>
        </div>
        <div v-if="task.subtasks && task.subtasks.length > 0" class="flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ completedSubtasksCount }}/{{ task.subtasks.length }}</span>
        </div>
      </div>

      <div v-if="task.subtasks && task.subtasks.length > 0" class="mt-2 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div :style="{ width: subtaskProgress + '%' }" class="h-full bg-blue-500 transition-all duration-300" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  task: { type: Object, required: true },
});

const emit = defineEmits(['view', 'edit', 'delete', 'update:status']);

const isMenuOpen = ref(false);
const showStatusMenu = ref(false);
const dropdownRef = ref(null);

const statuses = [
  { value: 'to-do', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (!isMenuOpen.value) {
    showStatusMenu.value = false;
  }
};

const changeStatus = (newStatus) => {
  if (props.task.status === newStatus) return;
  emit('update:status', { ...props.task, status: newStatus });
  isMenuOpen.value = false;
  showStatusMenu.value = false;
};

const viewTask = () => {
  emit('view', props.task);
  isMenuOpen.value = false;
};

const editTask = () => {
  emit('edit', props.task);
  isMenuOpen.value = false;
};

const deleteTask = () => {
  emit('delete', props.task);
  isMenuOpen.value = false;
};

const handleClickOutside = (event) => {
  if (isMenuOpen.value && dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isMenuOpen.value = false;
    showStatusMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const completedSubtasksCount = computed(() => {
  if (!props.task.subtasks) return 0;
  return props.task.subtasks.filter(sub => sub.status === 'done').length;
});

const subtaskProgress = computed(() => {
  if (!props.task.subtasks || props.task.subtasks.length === 0) return 0;
  return Math.round((completedSubtasksCount.value / props.task.subtasks.length) * 100);
});

const statusDotClasses = (status) => {
  switch (status) {
    case 'to-do':
      return 'bg-blue-500';
    case 'in-progress':
      return 'bg-yellow-500';
    case 'review':
      return 'bg-purple-500';
    case 'done':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const displayDueDate = computed(() => {
  const date = new Date(props.task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
  return `${diffDays}d`;
});

const isOverdue = computed(() => {
  const date = new Date(props.task.dueDate);
  const today = new Date();
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return date.getTime() < today.getTime() && props.task.status !== 'done';
});

const formatTime = (minutes) => {
  if (minutes === 0) return '0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};
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