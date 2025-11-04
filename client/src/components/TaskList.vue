<template>
  <div class="grid grid-cols-1 gap-6 h-full sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    
    <TaskColumn 
      title="To Do" 
      status="to-do" 
      :tasks="filteredTasks('to-do')" 
      @create="handleCreate"
      @view="handleView"
      @update="handleUpdate"
      @delete="handleDelete"
    />

    <TaskColumn 
      title="In Progress" 
      status="in-progress" 
      :tasks="filteredTasks('in-progress')"
      @create="handleCreate"
      @view="handleView"
      @update="handleUpdate"
      @delete="handleDelete"
    />

    <TaskColumn 
      title="Review" 
      status="review" 
      :tasks="filteredTasks('review')"
      @create="handleCreate"
      @view="handleView"
      @update="handleUpdate"
      @delete="handleDelete"
    />

    <TaskColumn 
      title="Done" 
      status="done" 
      :tasks="filteredTasks('done')" 
      @create="handleCreate"
      @view="handleView"
      @update="handleUpdate"
      @delete="handleDelete"
    />
    
  </div>
</template>

<script setup>
import TaskColumn from './TaskColumn.vue';
import { computed } from 'vue';

const props = defineProps({
  allTasks: { type: Array, default: () => [] },
});

const emit = defineEmits(['createTask', 'viewTask', 'updateTask', 'deleteTask']); 

const filteredTasks = (status) => {
  return props.allTasks.filter(task => task.status === status);
};

const handleCreate = (status) => {
  emit('createTask', status);
};

const handleView = (task) => {
  emit('viewTask', task);
};

const handleUpdate = (task) => {
  emit('updateTask', task);
};

const handleDelete = (task) => {
  emit('deleteTask', task);
};
</script>