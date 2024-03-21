/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      aspectRatio: {
        '3/2': '3/2',
        '3/4': '3/4',
        '16/9': '16/9',
      },
      scale: {
        102: '1.02',
      },
      boxShadow: {
        'competition-card': 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;',
      },
      borderColor: {
        shadow: 'rgba(0, 0, 0, .125)',
      },
      width: {
        100: '25rem',
        '1/3': '33.333333%',
      },
      colors: {
        'uos-signature-blue': '#004094',
        'uos-blue': '#005eb8',
        'uos-blue-light': '#0077c8',
        'uos-blue-soft': '#9bcbeb',
        'uos-blue-mist': '#b9d9eb',
        'uos-emerald': '#00b398',
        'uos-emerald-light': '#2cd5c4',
        'uos-emerald-soft': '#9cdbd9',
        'uos-emerald-mist': '#dcebec',
        'uos-gray': '#63666a',
        'uos-gray-light': '#bbbcbc',
        'uos-gray-soft': '#d9d9d6',
        'uos-gray-mist': '#e7e7e0',
        'uos-gold': '#85714D',
        'uos-silver': '#8A8D8F',
        'uos-bronze': '#8B634B',
        light: '#f8f9fa',
      },
      maxWidth: {
        '1/3': '33.333333%',
        '2/3': '66.666667%',
      },
      flex: {
        0.5: '0 0 50%',
        '2/3': '0 0 66.666667%',
        full: '0 0 100%',
      },
      screens: {
        xs: '560px',
      },
    },
  },
  plugins: [],
};
