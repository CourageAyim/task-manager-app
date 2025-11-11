<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="isVisible" 
           @click.self="closeModal"
           class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity">
        
        <div class="w-full max-w-2xl mx-4 rounded-xl shadow-2xl bg-white dark:bg-gray-900 max-h-[90vh] flex flex-col"
             @click.stop>
          
          <header class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">
              {{ modalTitle }}
            </h3>
            <button @click="closeModal"
                    class="p-1 rounded-full text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </header>
          
          <div class="overflow-y-auto p-6 space-y-4 scrollbar-hide flex-1">
            
            <div>
              <label :for="'title' + task?.id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Title <span v-if="!isReadOnly" class="text-red-500">*</span>
              </label>
              <input :id="'title' + task?.id" type="text" v-model="form.title" required
                     :disabled="isReadOnly"
                     class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
              />
            </div>

            <div>
              <label :for="'description' + task?.id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea :id="'description' + task?.id" v-model="form.description" rows="3"
                        :disabled="isReadOnly"
                        class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 resize-none"
              ></textarea>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label :for="'dueDate' + task?.id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input :id="'dueDate' + task?.id" type="date" v-model="form.dueDate"
                       :disabled="isReadOnly"
                       class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label :for="'status' + task?.id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status <span v-if="!isReadOnly" class="text-red-500">*</span>
                </label>
                <select :id="'status' + task?.id" v-model="form.status" required
                        :disabled="isReadOnly"
                        class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="to-do">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label :for="'timeSpent' + task?.id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time Spent (min)
                </label>
                <input :id="'timeSpent' + task?.id" type="number" v-model.number="form.timeSpent" min="0"
                       :disabled="isReadOnly"
                       class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label :for="'recurrence' + task?.id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Recurrence
                </label>
                <select :id="'recurrence' + task?.id" v-model="form.recurrence"
                        :disabled="isReadOnly"
                        class="w-full border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="none">None</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            
            <div class="pt-4 border-t border-gray-200 dark:border-gray-800">
              <h4 class="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100">
                Subtasks ({{ form.subtasks.filter(s => s.status === 'done').length }}/{{ form.subtasks.length }})
              </h4>
              
              <div v-if="!isReadOnly" class="flex items-center mb-4">
                <input type="text" v-model="newSubtaskTitle"
                       @keyup.enter="addSubtask"
                       class="flex-grow border border-gray-300 dark:border-gray-700 rounded-l-lg px-3 py-2 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                       placeholder="Add a new subtask..."
                />
                <button type="button" @click="addSubtask"
                        class="flex-shrink-0 px-4 py-2 rounded-r-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Add
                </button>
              </div>

              <ul v-if="form.subtasks.length" class="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
                <li v-for="(subtask, index) in form.subtasks" :key="subtask.id"
                    class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                  
                  <div class="flex items-center flex-grow">
                    <input type="checkbox" :id="'subtask-' + subtask.id" 
                           :checked="subtask.status === 'done'" 
                           @change="toggleSubtaskStatus(index)"
                           :disabled="isReadOnly"
                           class="w-4 h-4 rounded cursor-pointer focus:ring-2 focus:ring-blue-500"
                    >
                    <label :for="'subtask-' + subtask.id" 
                           class="ml-3 text-sm flex-grow"
                           :class="[
                             subtask.status === 'done' 
                               ? 'text-gray-500 line-through' 
                               : 'text-gray-900 dark:text-gray-100'
                           ]">
                      {{ subtask.title }}
                    </label>
                  </div>

                  <button v-if="!isReadOnly" type="button" @click="deleteSubtask(index)"
                          class="p-1 rounded-full text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              </ul>
              <p v-else class="text-sm italic text-gray-500 dark:text-gray-400">
                No subtasks added yet.
              </p>
            </div>
          </div>

          <footer class="flex justify-end p-6 space-x-3 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
            <button type="button" @click="closeModal"
                    class="px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {{ isReadOnly ? 'Close' : 'Cancel' }}
            </button>
            
            <button v-if="!isReadOnly" type="button" @click="saveTask"
                    :disabled="!isFormValid"
                    class="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isEditing ? 'Update Task' : 'Create Task' }}
            </button>
          </footer>

        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const emit = defineEmits(['close', 'save']);

const props = defineProps({
  isVisible: { type: Boolean, required: true },
  task: { type: Object, default: null },
  isReadOnly: { type: Boolean, default: false }, 
});

const defaultForm = () => ({
  id: null,
  title: '',
  description: '',
  dueDate: new Date().toISOString().substring(0, 10),
  timeSpent: 0,
  recurrence: 'none',
  status: 'to-do',
  subtasks: [] 
});

const form = ref(defaultForm());
const newSubtaskTitle = ref(''); 

const isEditing = computed(() => !!props.task && !!props.task.id);
const isFormValid = computed(() => form.value.title.trim() !== '' && form.value.status.trim() !== '');

const modalTitle = computed(() => {
  if (props.isReadOnly) return 'View Task Details';
  return isEditing.value ? 'Edit Task' : 'Create New Task';
});

watch(() => props.task, (newTask) => {
  if (newTask) {
    form.value = JSON.parse(JSON.stringify(newTask));
    if (!form.value.subtasks) {
      form.value.subtasks = [];
    }
  } else {
    form.value = defaultForm();
  }
}, { immediate: true });

const closeModal = () => {
  emit('close');
  form.value = defaultForm();
  newSubtaskTitle.value = '';
};

const saveTask = () => {
  if (isFormValid.value) {
    emit('save', form.value);
  }
};

const addSubtask = () => {
  const title = newSubtaskTitle.value.trim();
  if (title) {
    const newId = Date.now(); 
    form.value.subtasks.push({ 
      id: newId, 
      title: title, 
      status: 'to-do' 
    });
    newSubtaskTitle.value = ''; 
  }
};

const toggleSubtaskStatus = (index) => {
  if (props.isReadOnly) return;
  const subtask = form.value.subtasks[index];
  subtask.status = subtask.status === 'done' ? 'to-do' : 'done';
};

const deleteSubtask = (index) => {
  if (props.isReadOnly) return; 
  form.value.subtasks.splice(index, 1);
};
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>