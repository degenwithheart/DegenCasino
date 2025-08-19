module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      // Enhanced mobile breakpoints for more granular control
      screens: {
        'xs': '360px', // Extra small devices
        'sm': '480px', // Small mobile
        'md': '768px', // Tablets
        'lg': '1024px', // Laptop
        'xl': '1280px',
        '2xl': '1536px',
      },
      // Touch-friendly button sizes
      spacing: {
        'btn-lg': '3.5rem',
        'btn-md': '2.75rem',
        'btn-sm': '2.25rem',
      },
      fontSize: {
        'mobile': '1rem',
        'mobile-lg': '1.25rem',
      },
      borderRadius: {
        'mobile': '1rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
    // Uncomment to enable safe-area insets for devices with notches:
    // require('tailwindcss-safe-area'),
  ],
};
