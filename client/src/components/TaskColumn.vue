<template>
  <div class="flex flex-col h-full bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
    <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
      <div class="flex items-center gap-2">
        <h3 class="font-semibold text-gray-900 dark:text-gray-100">
          {{ title }}
        </h3>
        <span :class="statusBadgeClasses" class="text-white text-xs font-medium px-2 py-0.5 rounded-full">
          {{ tasks.length }}
        </span>
      </div>
      <button
        @click="addTask"
        class="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
      >
        <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
      <p v-if="tasks.length === 0" class="text-sm text-gray-500 dark:text-gray-400 text-center py-8 italic">
        No tasks in {{ statusLabel }}
      </p>
      <TaskItem 
        v-else
        v-for="task in tasks" 
        :key="task.id" 
        :task="task" 
        @view="handleTaskAction('view', task)"
        @edit="handleTaskAction('edit', task)"
        @delete="handleTaskAction('delete', task)"
        @update:status="handleTaskAction('update', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import TaskItem from './TaskItem.vue';

const props = defineProps({
  title: { type: String, required: true },
  status: { type: String, required: true }, 
  tasks: { type: Array, default: () => [] },
});

const emit = defineEmits(['create', 'view', 'edit', 'update', 'delete']);

const addTask = () => {
  emit('create', props.status);
};

const handleTaskAction = (action, payload) => {
  emit(action, payload);
};

const statusBadgeClasses = computed(() => {
  switch (props.status) {
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
});

const statusLabel = computed(() => {
  const map = { 
    'to-do': 'To Do', 
    'in-progress': 'In Progress', 
    'review': 'Review', 
    'done': 'Done',
  };
  return map[props.status] || 'Unknown';
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>