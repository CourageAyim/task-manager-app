<template>
  <AppLayout>
    <div class="flex flex-col h-full">
      <!-- Dashboard Header -->
      <div class="mb-6">
        <h2 class="text-3xl font-bold mb-2 transition-colors duration-300" 
            :class="[isDark ? 'text-text-dark-primary' : 'text-text-light-primary']">
          Task Dashboard
        </h2>
        <p class="text-sm transition-colors duration-300"
           :class="[isDark ? 'text-text-dark-tertiary' : 'text-text-light-tertiary']">
          Manage your tasks efficiently with our Ocean Blue Serenity theme
        </p>
      </div>
      
      <!-- Task Board -->
      <TaskList class="flex-grow"/> 
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import TaskList from '../components/TaskList.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'; 

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
  
  // Observe DOM changes
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
</script>