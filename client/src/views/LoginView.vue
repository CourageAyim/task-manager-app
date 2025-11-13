<template>
  <div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
       :class="[isDark ? 'bg-bg-dark-base' : 'bg-bg-light-base']">
    
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="text-center text-3xl font-black transition-colors duration-300"
            :class="[isDark ? 'text-accent-primary' : 'text-accent-dark-primary']">
          Task Flow
        </h2>
        <p class="mt-2 text-center text-sm transition-colors duration-300"
           :class="[isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary']">
          Sign in to your account
        </p>
      </div>

      <div class="rounded-xl shadow-2xl p-8 transition-colors duration-300"
           :class="[isDark ? 'bg-bg-dark-elevated border border-border-dark' : 'bg-bg-light-elevated border border-border-light']">
        
        <div v-if="errorMessage" 
             class="mb-4 p-3 rounded-lg bg-error/10 border border-error text-error text-sm">
          {{ errorMessage }}
        </div>

        <div class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium mb-2 transition-colors duration-300"
                   :class="[isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary']">
              Email Address
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              required
              class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all duration-200"
              :class="[
                isDark 
                  ? 'bg-bg-dark-base border-border-dark text-text-dark-primary focus:ring-accent-primary focus:border-accent-primary' 
                  : 'bg-white border-border-light text-text-light-primary focus:ring-accent-dark-primary focus:border-accent-dark-primary'
              ]"
              placeholder="john@example.com"
              @input="clearErrors"
              @keyup.enter="handleLogin"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-error">{{ errors.email }}</p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium mb-2 transition-colors duration-300"
                   :class="[isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary']">
              Password
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              required
              class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all duration-200"
              :class="[
                isDark 
                  ? 'bg-bg-dark-base border-border-dark text-text-dark-primary focus:ring-accent-primary focus:border-accent-primary' 
                  : 'bg-white border-border-light text-text-light-primary focus:ring-accent-dark-primary focus:border-accent-dark-primary'
              ]"
              placeholder="••••••••"
              @input="clearErrors"
              @keyup.enter="handleLogin"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-error">{{ errors.password }}</p>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 rounded border-border-light focus:ring-2 focus:ring-accent-primary"
                :class="[isDark ? 'bg-bg-dark-base border-border-dark' : 'bg-white']"
              />
              <label for="remember-me" class="ml-2 block text-sm transition-colors duration-300"
                     :class="[isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary']">
                Remember me
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-semibold transition-colors duration-200"
                 :class="[isDark ? 'text-accent-primary hover:text-accent-secondary' : 'text-accent-dark-primary hover:text-accent-dark-secondary']">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            @click="handleLogin"
            :disabled="isLoading"
            class="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            :class="[
              isDark 
                ? 'bg-accent-primary hover:bg-accent-secondary' 
                : 'bg-accent-dark-primary hover:bg-accent-dark-secondary'
            ]">
            <span v-if="!isLoading">Sign In</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          </button>

          <div class="text-center">
            <p class="text-sm transition-colors duration-300"
               :class="[isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary']">
              Don't have an account?
              <router-link to="/register" 
                           class="font-semibold transition-colors duration-200"
                           :class="[isDark ? 'text-accent-primary hover:text-accent-secondary' : 'text-accent-dark-primary hover:text-accent-dark-secondary']">
                Sign up
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import authService from '../services/authService';

const router = useRouter();

const isDark = ref(false);
const isLoading = ref(false);
const errorMessage = ref('');
const rememberMe = ref(false);

const formData = ref({
  email: '',
  password: '',
});

const errors = ref({
  email: '',
  password: '',
});

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark');
  
  const handleThemeChange = (event) => {
    isDark.value = event.detail.isDark;
  };
  window.addEventListener('theme-changed', handleThemeChange);

  if (authService.isAuthenticated()) {
    router.push('/dashboard');
  }
});

const clearErrors = () => {
  errorMessage.value = '';
  errors.value = {
    email: '',
    password: '',
  };
};

const validateForm = () => {
  clearErrors();
  let isValid = true;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.value.email.trim()) {
    errors.value.email = 'Email is required';
    isValid = false;
  } else if (!emailRegex.test(formData.value.email)) {
    errors.value.email = 'Please enter a valid email';
    isValid = false;
  }

  if (!formData.value.password) {
    errors.value.password = 'Password is required';
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';

  try {
    const { email, password } = formData.value;
    await authService.login({ email, password });
    
    router.push('/dashboard');
  } catch (error) {
    errorMessage.value = error.message || 'Invalid email or password. Please try again.';
    isLoading.value = false;
  }
};
</script>