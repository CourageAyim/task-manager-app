<template>
  <div class="grid grid-cols-1 gap-6 h-full sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    
    <TaskColumn 
      title="To Do" 
      status="to-do" 
      :tasks="filteredTasks('to-do')" 
      @create="handleCreate"  
      @view="handleView"
      @edit="handleEdit"
      @update="handleUpdate"
      @delete="handleDelete"
    />

    <TaskColumn 
      title="In Progress" 
      status="in-progress" 
      :tasks="filteredTasks('in-progress')"
      @create="handleCreate"
      @view="handleView"
      @edit="handleEdit"
      @update="handleUpdate"
      @delete="handleDelete"
    />

    <TaskColumn 
      title="Review" 
      status="review" 
      :tasks="filteredTasks('review')"
      @create="handleCreate"
      @view="handleView"
      @edit="handleEdit"
      @update="handleUpdate"
      @delete="handleDelete"
    />

    <TaskColumn 
      title="Done" 
      status="done" 
      :tasks="filteredTasks('done')" 
      @create="handleCreate"
      @view="handleView"
      @edit="handleEdit"
      @update="handleUpdate"
      @delete="handleDelete"
    />
    
  </div>
</template>

<script setup>
import TaskColumn from './TaskColumn.vue';

const props = defineProps({
  allTasks: { type: Array, default: () => [] },
});

const emit = defineEmits(['create-task', 'view-task', 'edit-task', 'update-task', 'delete-task']); 

const filteredTasks = (status) => {
  return props.allTasks.filter(task => task.status === status);
};

const handleCreate = (status) => {
  emit('create-task', { status: status }); 
};

const handleView = (task) => { 
  emit('view-task', task); 
};

const handleEdit = (task) => {
  emit('edit-task', task);
};

const handleUpdate = (payload) => { 
  emit('update-task', payload); 
};

const handleDelete = (task) => { 
  emit('delete-task', task); 
};
</script>