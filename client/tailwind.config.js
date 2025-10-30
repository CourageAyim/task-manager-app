/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark Mode Backgrounds
        'bg-dark-base': '#0a1128',
        'bg-dark-elevated': '#1a2847',
        'bg-dark-header': '#162238',
        
        // Dark Mode Text
        'text-dark-primary': '#f8fafc',
        'text-dark-secondary': '#cbd5e1',
        'text-dark-tertiary': '#94a3b8',
        
        // Light Mode Backgrounds
        'bg-light-base': '#f8fafc',
        'bg-light-elevated': '#ffffff',
        'bg-light-header': '#ffffff',
        'bg-light-hover': '#e0f2fe',
        'bg-light-active': '#bae6fd',
        
        // Light Mode Text
        'text-light-primary': '#0f172a',
        'text-light-secondary': '#334155',
        'text-light-tertiary': '#64748b',
        
        // Shared Accents
        'accent-primary': '#48cae4',
        'accent-secondary': '#00b4d8',
        'accent-hover': '#90e0ef',
        'accent-dark-primary': '#0077b6',
        'accent-dark-secondary': '#023e8a',
        
        // Borders
        'border-light': '#e2e8f0',
        'border-medium': '#cbd5e1',
        'border-dark': '#334155',
        
        // Status Colors
        'success': '#06d6a0',
        'warning': '#ffd166',
        'error': '#ef476f',
        'info': '#48cae4',
      }
    },
  },
  plugins: [],
}