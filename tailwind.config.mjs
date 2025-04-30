/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      // Custom theme extensions can go here
      animation: {
        'spin': 'spin 1s linear infinite',
      },
    },
  },
  plugins: [],
  // Enable JIT mode for faster builds
  mode: 'jit',
}

