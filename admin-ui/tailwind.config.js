export default {
   content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
   ],
   theme: {
      extend: {
         fontFamily: {
            primary: 'Pally',
            secondary: 'Author',
         },
         colors: {
            primary: 'rgb(var(--primary-color))',
            secondary: 'rgb(var(--secondary-color))',
            accent: 'rgb(var(--accent))',
            success: 'rgb(var(--success))',
            warning: 'rgb(var(--warning-color))',
         },
         container: {
            center: true,
            padding: {
               DEFAULT: '1rem',
            },
         },
         screens: {
            '2xl': '1430px',
            '3xl': '1560px',
         },
         fontSize: {
            xxs: '14px',
            xs: '16px',
            sm: '17px',
            md: '20px',
            lg: '24px',
            xl: '32px',
            '2xl': '48px',
            '3xl': '58px',
            '4xl': '96px',
         },
         keyframes: {
            shrink: {
               '0%': { width: '100%' },
               '100%': { width: '0%' },
            },
         },
         animation: {
            shrink: 'shrink 3.5s ease-in-out forwards',
         },
      },
   },
   plugins: [],
};
