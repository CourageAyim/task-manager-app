<template>
  <AppLayout>
    <h2 class="text-3xl font-bold transition-colors duration-300" 
        :class="[isDark ? 'text-text-dark-primary' : 'text-text-light-primary']">
      Welcome to your Task Dashboard!
    </h2>
    <p class="mt-2 text-lg transition-colors duration-300" 
       :class="[isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary']">
      Ocean Blue Serenity theme active. Ready for Task 2.2.2.
    </p>
    
    <!-- Example Card to demonstrate the palette -->
    <div class="mt-8 p-6 rounded-lg shadow-md transition-colors duration-300"
         :class="[isDark ? 'bg-bg-dark-elevated' : 'bg-bg-light-elevated border border-border-light']">
      <h3 class="text-xl font-semibold mb-2"
          :class="[isDark ? 'text-text-dark-primary' : 'text-text-light-primary']">
        Sample Card
      </h3>
      <p :class="[isDark ? 'text-text-dark-tertiary' : 'text-text-light-tertiary']">
        This card demonstrates the new color system with improved contrast and readability.
      </p>
      <button class="mt-4 px-4 py-2 rounded-md font-medium transition-colors duration-200"
              :class="[
                isDark ? 'bg-accent-primary text-bg-dark-base hover:bg-accent-hover' : 'bg-accent-dark-primary text-white hover:bg-accent-dark-secondary'
              ]">
        Action Button
      </button>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '../components/AppLayout.vue'
import { ref, onMounted } from 'vue';

const isDark = ref(false);

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark');
});
</script>