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
      backgroundImage: {
        'is-invalid':
          "url(data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545'%3E%3Ccircle cx='6' cy='6' r='4.5'/%3E%3Cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3E%3Ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3E%3C/svg%3E)",
      },
    },
  },
  plugins: [],
};
