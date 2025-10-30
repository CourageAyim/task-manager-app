<template>
  <div class="flex h-screen transition-colors duration-300" 
       :class="[isDark ? 'bg-bg-dark-base' : 'bg-bg-light-base']">
    
    <!-- Sidebar -->
    <aside class="w-64 flex-shrink-0 shadow-xl p-4 transition-colors duration-300"
           :class="[isDark ? 'bg-bg-dark-elevated' : 'bg-bg-light-elevated border-r border-border-light']">
      <div class="text-2xl font-black mb-8"
           :class="[isDark ? 'text-accent-primary' : 'text-accent-dark-primary']">
        Task Flow
      </div>
      
      <nav class="space-y-3">
        <!-- Dashboard Link -->
        <router-link to="/dashboard" 
          class="flex items-center p-3 font-semibold rounded-lg transition-all duration-150"
          :class="{
            'text-accent-primary bg-bg-dark-header': $route.path === '/dashboard' && isDark,
            'text-accent-dark-primary bg-bg-light-active': $route.path === '/dashboard' && !isDark,
            'text-text-dark-secondary hover:bg-bg-dark-header hover:text-text-dark-primary': isDark && $route.path !== '/dashboard',
            'text-text-light-secondary hover:bg-bg-light-hover hover:text-text-light-primary': !isDark && $route.path !== '/dashboard',
          }"
        >
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          Dashboard
        </router-link>
        
        <!-- Settings Link (Placeholder) -->
        <a href="#" 
           class="flex items-center p-3 font-semibold rounded-lg transition-colors duration-150" 
           :class="[
             isDark ? 'text-text-dark-tertiary hover:bg-bg-dark-header hover:text-text-dark-secondary' : 'text-text-light-tertiary hover:bg-bg-light-hover hover:text-text-light-secondary'
           ]">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.942 3.33 2.653 1.481 3.975a1.724 1.724 0 00.04 2.515c1.285 1.144.697 3.237-1.702 3.857a1.724 1.724 0 00-1.066 2.573c.942 1.543-2.653 3.33-3.975 1.481a1.724 1.724 0 00-2.515.04c-1.144 1.285-3.237.697-3.857-1.702a1.724 1.724 0 00-2.573-1.066c-1.543.942-3.33-2.653-1.481-3.975a1.724 1.724 0 00-.04-2.515c-1.285-1.144-.697-3.237 1.702-3.857a1.724 1.724 0 001.066-2.573c-.942-1.543 2.653-3.33 3.975-1.481a1.724 1.724 0 002.515-.04z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          Settings (Placeholder)
        </a>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <div class="flex flex-col flex-grow">
      
      <!-- Header -->
      <header class="h-16 flex items-center justify-between px-6 shadow-md z-10 transition-colors duration-300" 
              :class="[
                isDark ? 'bg-bg-dark-header text-text-dark-primary border-b border-border-dark' : 'bg-bg-light-header text-text-light-primary border-b border-border-light'
              ]">
        <h1 class="text-2xl font-light" 
            :class="[isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary']">
          Dashboard
        </h1>
        
        <div class="flex items-center space-x-4">
          <!-- Theme Toggle Button -->
          <button @click="toggleDark" 
                  class="p-2 rounded-full transition-all duration-200"
                  :class="[
                    isDark ? 'text-accent-primary hover:bg-bg-dark-base' : 'text-accent-dark-primary hover:bg-bg-light-hover'
                  ]">
            <!-- Moon Icon (Light Mode) -->
            <svg v-if="!isDark" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
            <!-- Sun Icon (Dark Mode) -->
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </button>
          <span class="font-medium text-sm"
                :class="[isDark ? 'text-text-dark-primary' : 'text-text-light-primary']">
            Asong
          </span>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-grow overflow-auto p-8">
        <slot></slot> 
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const isDark = ref(document.documentElement.classList.contains('dark'));

const toggleDark = () => {
  isDark.value = !isDark.value;
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  // Trigger a custom event to notify other components
  window.dispatchEvent(new CustomEvent('theme-changed', { detail: { isDark: isDark.value } }));
};

onMounted(() => {
  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    isDark.value = true;
  } else {
    document.documentElement.classList.remove('dark');
    isDark.value = false;
  }
});

const $route = useRoute();
</script>