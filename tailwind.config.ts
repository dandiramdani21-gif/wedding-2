import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      backgroundImage: {
        wedding: "linear-gradient(rgba(0,0,0,.55), rgba(0,0,0,.35)), url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1740&auto=format&fit=crop')"
      }
    }
  },
  plugins: []
};

export default config;
