/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // White theme color system
                'bg-primary': '#ffffff',
                'bg-secondary': '#f8f9fa',
                'bg-surface': '#ffffff',
                'accent-teal': '#00a896',
                'accent-orange': '#ff6b2b',
                'text-primary': '#2d3748',
                'text-secondary': '#718096',
                'text-heading': '#1a202c',
            },
            borderRadius: {
                'xl': '12px',
                '2xl': '16px',
            },
            boxShadow: {
                'soft': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'medium': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                'card': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
                'glow-teal': '0 0 20px rgba(0, 168, 150, 0.15)',
                'glow-orange': '0 0 20px rgba(255, 107, 43, 0.12)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                heading: ['Playfair Display', 'Georgia', 'serif'],
            },
        },
    },
    plugins: [],
}