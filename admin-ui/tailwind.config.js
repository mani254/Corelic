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
            primary: ({ opacityValue }) => `rgba(var(--primary-color), ${opacityValue})`,
            secondary: ({ opacityValue }) => `rgba(var(--secondary-color), ${opacityValue})`,
            accent: ({ opacityValue }) => `rgba(var(--accent), ${opacityValue})`,
            success: ({ opacityValue }) => `rgba(var(--success), ${opacityValue})`,
            warning: ({ opacityValue }) => `rgba(var(--warning-color), ${opacityValue})`,
            main: ({ opacityValue }) => `rgba(var(--main-1), ${opacityValue})`,
            "main-2": ({ opacityValue }) => `rgba(var(--main-2), ${opacityValue})`,
            "main-3": ({ opacityValue }) => `rgba(var(--main-3), ${opacityValue})`,
            "main-4": ({ opacityValue }) => `rgba(var(--main-4), ${opacityValue})`,
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
