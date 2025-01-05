// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A90E2', // Blue color from the screenshot
        secondary: '#F5A623', // Orange color from the screenshot
        background: '#F8F8F8', // Light gray background
        text: '#2E2E2E', // Dark text color
        third: "#001f2b"
      },
    },
  },
  plugins: [],
};

export default config;