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
          Create your account
        </p>
      </div>

      <div class="rounded-xl shadow-2xl p-8 transition-colors duration-300"
           :class="[isDark ? 'bg-bg-dark-elevated border border-border-dark' : 'bg-bg-light-elevated border border-border-light']">
        
        <div v-if="errorMessage" 
             class="mb-4 p-3 rounded-lg bg-error/10 border border-error text-error text-sm">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" 
             class="mb-4 p-3 rounded-lg bg-success/10 border border-success text-success text-sm">
          {{ successMessage }}
        </div>

        <div class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium mb-2 transition-colors duration-300"
                   :class="[isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary']">
              Full Name
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              required
              class="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all duration-200"
              :class="[
                isDark 
                  ? 'bg-bg-dark-base border-border-dark text-text-dark-primary focus:ring-accent-primary focus:border-accent-primary' 
                  : 'bg-white border-border-light text-text-light-primary focus:ring-accent-dark-primary focus:border-accent-dark-primary'
              ]"
              placeholder="John Doe"
              @input="clearErrors"
            />
            <p v-if="errors.name" class="mt-1 text-sm text-error">{{ errors.name }}</p>
          </div>

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
            />
            <p v-if="errors.password" class="mt-1 text-sm text-error">{{ errors.password }}</p>
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium mb-2 transition-colors duration-300"
                   :class="[isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary']">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
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
            />
            <p v-if="errors.confirmPassword" class="mt-1 text-sm text-error">{{ errors.confirmPassword }}</p>
          </div>

          <button
            @click="handleRegister"
            :disabled="isLoading"
            class="w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            :class="[
              isDark 
                ? 'bg-accent-primary hover:bg-accent-secondary' 
                : 'bg-accent-dark-primary hover:bg-accent-dark-secondary'
            ]">
            <span v-if="!isLoading">Create Account</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          </button>

          <div class="text-center">
            <p class="text-sm transition-colors duration-300"
               :class="[isDark ? 'text-text-dark-secondary' : 'text-text-light-secondary']">
              Already have an account?
              <router-link to="/login" 
                           class="font-semibold transition-colors duration-200"
                           :class="[isDark ? 'text-accent-primary hover:text-accent-secondary' : 'text-accent-dark-primary hover:text-accent-dark-secondary']">
                Sign in
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
const successMessage = ref('');

const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const errors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark');
  
  const handleThemeChange = (event) => {
    isDark.value = event.detail.isDark;
  };
  window.addEventListener('theme-changed', handleThemeChange);
});

const clearErrors = () => {
  errorMessage.value = '';
  errors.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
};

const validateForm = () => {
  clearErrors();
  let isValid = true;

  if (!formData.value.name.trim()) {
    errors.value.name = 'Name is required';
    isValid = false;
  } else if (formData.value.name.trim().length < 2) {
    errors.value.name = 'Name must be at least 2 characters';
    isValid = false;
  }

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
  } else if (formData.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters';
    isValid = false;
  }

  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password';
    isValid = false;
  } else if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match';
    isValid = false;
  }

  return isValid;
};

const handleRegister = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const { name, email, password } = formData.value;
    await authService.register({ name, email, password });
    
    successMessage.value = 'Account created successfully! Redirecting...';
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  } catch (error) {
    errorMessage.value = error.message || 'Registration failed. Please try again.';
    isLoading.value = false;
  }
};
</script>