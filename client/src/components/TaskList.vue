<template>
  <div class="grid grid-cols-1 gap-6 h-full sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    
    <TaskColumn title="To Do" status="to-do" :task-count="2" />

    <TaskColumn title="In Progress" status="in-progress" :task-count="0" />

    <TaskColumn title="Review" status="review" :task-count="0" />

    <TaskColumn title="Done" status="done" :task-count="0" />
    
  </div>
</template>

<script setup>
import TaskColumn from './TaskColumn.vue';
// Future step: Add logic here to fetch, filter, and pass tasks down to TaskColumn
</script>