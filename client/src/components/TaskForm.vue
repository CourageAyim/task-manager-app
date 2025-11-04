<template>
  <Teleport to="body">
    
    <transition name="modal-fade">
      <div v-if="isVisible" 
           @click.self="closeModal"
           class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 transition-opacity">
        
        <div class="w-full max-w-lg mx-4 rounded-xl shadow-2xl p-6 transition-all duration-300 transform"
             :class="[isDark ? 'bg-bg-dark-elevated' : 'bg-bg-light-elevated']"
             @click.stop>
          
          <header class="flex justify-between items-center pb-4 mb-4 border-b"
                  :class="[isDark ? 'border-border-dark' : 'border-border-light']">
            <h3 class="text-xl font-bold" 
                :class="[isDark ? 'text-text-dark-primary' : 'text-text-light-primary']">
              {{ modalTitle }}
            </h3>
            <button @click="closeModal"
                    class="p-1 rounded-full transition-colors duration-200"
                    :class="[isDark ? 'text-text-dark-secondary hover:bg-bg-dark-base' : 'text-text-light-secondary hover:bg-bg-light-hover']">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </header>
          
          <form @submit.prevent="saveTask" class="space-y-6">
            
            <div>
              <label :for="'title' + task.id" class="block text-sm font-medium mb-1" :class="labelClasses">
                Task Title <span v-if="!isReadOnly" class="text-red-500">*</span>
              </label>
              <input :id="'title' + task.id" type="text" v-model="form.title" required
                     :disabled="isReadOnly"
                     :class="inputClasses"
                     class="w-full border rounded-lg px-3 py-2 text-base transition-colors duration-200"
              />
            </div>

            <div>
              <label :for="'description' + task.id" class="block text-sm font-medium mb-1" :class="labelClasses">
                Description
              </label>
              <textarea :id="'description' + task.id" v-model="form.description" rows="3"
                        :disabled="isReadOnly"
                        :class="inputClasses"
                        class="w-full border rounded-lg px-3 py-2 text-base transition-colors duration-200 resize-none"
              ></textarea>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label :for="'dueDate' + task.id" class="block text-sm font-medium mb-1" :class="labelClasses">
                  Due Date
                </label>
                <input :id="'dueDate' + task.id" type="date" v-model="form.dueDate"
                       :disabled="isReadOnly"
                       :class="inputClasses"
                       class="w-full border rounded-lg px-3 py-2 text-base transition-colors duration-200"
                />
              </div>

              <div>
                <label :for="'status' + task.id" class="block text-sm font-medium mb-1" :class="labelClasses">
                  Status <span v-if="!isReadOnly" class="text-red-500">*</span>
                </label>
                <select :id="'status' + task.id" v-model="form.status" required
                        :disabled="isReadOnly"
                        :class="inputClasses"
                        class="w-full border rounded-lg px-3 py-2 text-base transition-colors duration-200 appearance-none"
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
                <label :for="'timeSpent' + task.id" class="block text-sm font-medium mb-1" :class="labelClasses">
                  Time Spent (min)
                </label>
                <input :id="'timeSpent' + task.id" type="number" v-model.number="form.timeSpent" min="0"
                       :disabled="isReadOnly"
                       :class="inputClasses"
                       class="w-full border rounded-lg px-3 py-2 text-base transition-colors duration-200"
                />
              </div>

              <div>
                <label :for="'recurrence' + task.id" class="block text-sm font-medium mb-1" :class="labelClasses">
                  Recurrence
                </label>
                <select :id="'recurrence' + task.id" v-model="form.recurrence"
                        :disabled="isReadOnly"
                        :class="inputClasses"
                        class="w-full border rounded-lg px-3 py-2 text-base transition-colors duration-200 appearance-none"
                >
                  <option value="none">None</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            
            <div class="pt-4 border-t" :class="[isDark ? 'border-border-dark' : 'border-border-light']">
              <h4 class="text-lg font-bold mb-3" :class="[isDark ? 'text-text-dark-primary' : 'text-text-light-primary']">
                Subtasks ({{ form.subtasks.filter(s => s.status === 'done').length }}/{{ form.subtasks.length }})
              </h4>
              
              <div v-if="!isReadOnly" class="flex items-center mb-4">
                <input type="text" v-model="newSubtaskTitle"
                       @keyup.enter="addSubtask"
                       :class="inputClasses"
                       class="flex-grow border rounded-l-lg px-3 py-2 text-base"
                       placeholder="Add a new subtask..."
                />
                <button type="button" @click="addSubtask"
                        class="flex-shrink-0 px-4 py-2 rounded-r-lg font-medium transition-colors duration-200"
                        :class="[isDark ? 'bg-accent-primary text-bg-dark-base hover:bg-accent-hover' : 'bg-accent-dark-primary text-white hover:bg-accent-dark-secondary']">
                  Add
                </button>
              </div>

              <ul v-if="form.subtasks.length" class="space-y-2 max-h-40 overflow-y-auto pr-2">
                <li v-for="(subtask, index) in form.subtasks" :key="subtask.id"
                    class="flex items-center justify-between p-2 rounded-lg transition-colors duration-150"
                    :class="[isDark ? 'bg-bg-dark-base' : 'bg-bg-light-hover']">
                  
                  <div class="flex items-center flex-grow">
                    <input type="checkbox" :id="'subtask-' + subtask.id" 
                           :checked="subtask.status === 'done'" 
                           @change="toggleSubtaskStatus(index)"
                           :disabled="isReadOnly"
                           class="w-4 h-4 rounded appearance-none cursor-pointer focus:ring-2"
                           :class="[
                             isDark 
                               ? 'border-border-dark bg-bg-dark-elevated checked:bg-accent-secondary checked:border-transparent focus:ring-accent-primary' 
                               : 'border-border-light bg-white checked:bg-accent-dark-primary checked:border-transparent focus:ring-accent-dark-primary'
                           ]"
                    >
                    <label :for="'subtask-' + subtask.id" 
                           class="ml-3 text-sm flex-grow"
                           :class="[
                             subtask.status === 'done' 
                               ? (isDark ? 'text-text-dark-tertiary line-through' : 'text-text-light-tertiary line-through') 
                               : (isDark ? 'text-text-dark-primary' : 'text-text-light-primary')
                           ]">
                      {{ subtask.title }}
                    </label>
                  </div>

                  <button v-if="!isReadOnly" type="button" @click="deleteSubtask(index)"
                          class="p-1 rounded-full text-red-500 hover:bg-red-50 transition-colors duration-150 flex-shrink-0"
                          :class="[isDark ? 'hover:bg-bg-dark-elevated/50' : '']">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </li>
              </ul>
              <p v-else class="text-sm italic" :class="[isDark ? 'text-text-dark-tertiary' : 'text-text-light-tertiary']">
                No subtasks added yet.
              </p>
            </div>


            <footer v-if="!isReadOnly" class="flex justify-end pt-4 space-x-3 border-t"
                    :class="[isDark ? 'border-border-dark' : 'border-border-light']">
              
              <button type="button" @click="closeModal"
                      class="px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                      :class="[isDark ? 'text-text-dark-secondary hover:bg-bg-dark-base' : 'text-text-light-secondary hover:bg-bg-light-hover']">
                Cancel
              </button>
              
              <button type="submit"
                      :disabled="!isFormValid"
                      class="px-4 py-2 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      :class="[isDark ? 'bg-accent-primary text-bg-dark-base hover:bg-accent-secondary' : 'bg-accent-dark-primary text-white hover:bg-accent-dark-secondary']">
                {{ isEditing ? 'Update Task' : 'Create Task' }}
              </button>
            </footer>
          </form>
          
          <footer v-if="isReadOnly" class="flex justify-end pt-4 border-t"
                    :class="[isDark ? 'border-border-dark' : 'border-border-light']">
             <button type="button" @click="closeModal"
                      class="px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                      :class="[isDark ? 'bg-accent-primary text-bg-dark-base hover:bg-accent-secondary' : 'bg-accent-dark-primary text-white hover:bg-accent-dark-secondary']">
                Close
              </button>
          </footer>

        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

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

const labelClasses = computed(() => {
  return isDark.value ? 'text-text-dark-secondary' : 'text-text-light-secondary';
});

const inputClasses = computed(() => {
  const base = 'outline-none placeholder-text-light-tertiary disabled:cursor-default disabled:opacity-75 disabled:shadow-none';
  
  if (isDark.value) {
    return `${base} bg-bg-dark-base border-border-dark text-text-dark-primary focus:border-accent-primary focus:ring-accent-primary disabled:bg-bg-dark-base/50`;
  } else {
    return `${base} bg-white border-border-light text-text-light-primary focus:border-accent-dark-primary focus:ring-accent-dark-primary disabled:bg-bg-light-hover`;
  }
});
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
</style>