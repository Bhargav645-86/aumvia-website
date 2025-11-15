/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Aumvia Spiritual-Tech Brand Colors
        indigo: {
          DEFAULT: '#4A0E8B',
          dark: '#3A0E6B',
          light: '#6B2DB8',
        },
        emerald: {
          DEFAULT: '#0B6E4F',
          dark: '#0A5C3F',
          light: '#0D8A63',
        },
        gold: {
          DEFAULT: '#D4AF37',
          glow: '#E6C756',
          dark: '#B8941F',
        },
        lotus: {
          DEFAULT: '#F8F1E8',
          light: '#FFFBF5',
        },
        gray: {
          soft: '#F5F5F5',
        },
        // Alert Colors
        success: '#4CAF50',
        warning: '#FFBF00',
        error: '#D32F2F',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        'h1': '48px',
        'h2': '36px',
        'h3': '24px',
        'body': '16px',
        'label': '14px',
      },
      borderRadius: {
        'spiritual': '15px',
        'button': '50px',
      },
      boxShadow: {
        'gold': '0 0 10px #D4AF37, 0 0 20px rgba(212, 175, 55, 0.3)',
        'gold-hover': '0 0 15px #E6C756, 0 0 30px rgba(230, 199, 86, 0.5)',
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, #4A0E8B 0%, #0B6E4F 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4AF37 0%, #E6C756 100%)',
        'lotus-pattern': 'radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(74, 14, 139, 0.05) 0%, transparent 50%)',
      },
      animation: {
        'om-spin': 'om-rotate 2s linear infinite',
        'fade-in': 'fadeIn 0.5s ease-in',
        'scale-up': 'scaleUp 0.3s ease-out',
      },
      keyframes: {
        'om-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
