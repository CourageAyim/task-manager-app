<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Task Manager App 📋
      </h1>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Frontend setup complete! ✅
      </p>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-md">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          Test Tailwind Styles
        </h2>
        
        <button 
          @click="toggleDark" 
          class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Toggle Dark Mode 🌙
        </button>

        <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
          <p class="text-sm text-blue-800 dark:text-blue-200">
            Current mode: <span class="font-bold">{{ isDark ? 'Dark' : 'Light' }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isDark: false
    }
  },
  methods: {
    toggleDark() {
      this.isDark = !this.isDark
      document.documentElement.classList.toggle('dark')
    }
  },
  mounted() {
    // Check if dark mode was previously set
    this.isDark = document.documentElement.classList.contains('dark')
  }
}
</script>