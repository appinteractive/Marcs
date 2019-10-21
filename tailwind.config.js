/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/

const { screens, spacing } = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        display: ['Lato', 'Open Sans', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif']
      },
      colors: {
        primary: 'var("--color-primary")',
        secondary: 'var("--color-secondary")'
      },
      boxShadow: {
        lg: '0 12px 26px -4px rgba(0,0,0,.1)'
      },
      spacing: {
        '1/1': '100%',
        '1/2': '50%',
        '1/3': '33.333333%',
        '2/3': '66.666667%',
        '1/4': '25%',
        '2/4': '50%',
        '3/4': '75%',
        '1/5': '20%',
        '2/5': '40%',
        '3/5': '60%',
        '4/5': '80%',
        '1/6': '16.666667%',
        '2/6': '33.333333%',
        '3/6': '50%',
        '4/6': '66.666667%',
        '5/6': '83.333333%',
        '1/12': '8.333333%',
        '2/12': '16.666667%',
        '3/12': '25%',
        '4/12': '33.333333%',
        '5/12': '41.666667%',
        '6/12': '50%',
        '7/12': '58.333333%',
        '8/12': '66.666667%',
        '9/12': '75%',
        '10/12': '83.333333%',
        '11/12': '91.666667%',
        '16/9': '56.25%'
      },
      width: {
        sm: screens.sm,
        md: screens.md,
        lg: screens.lg,
        xl: screens.xl
      },
      minWidth: {
        sm: screens.sm,
        md: screens.md,
        lg: screens.lg,
        xl: screens.xl,
        10: '2rem',
        20: '4rem',
        30: '6rem',
        40: '8rem',
        50: '12rem',
        60: '14rem',
        70: '18rem',
        80: '22rem',
        90: '24rem',
        100: '30rem'
      },
      minHeight: {
        10: '2rem',
        20: '4rem',
        30: '6rem',
        40: '8rem',
        50: '12rem',
        60: '14rem',
        70: '18rem',
        80: '22rem',
        90: '24rem',
        100: '30rem'
      },
      maxHeight: {
        safe: `calc(100vh - ${spacing[16]})`,
        safer: `calc(100vh - ${spacing[20]} - ${spacing[2]})`
      },
      height: {
        safe: `calc(100vh - ${spacing[16]})`,
        safer: `calc(100vh - ${spacing[20]} - ${spacing[2]})`
      }
    }
  },
  variants: {
    opacity: ['responsive', 'hover', 'focus', 'group-hover'],
    textColor: ['responsive', 'hover', 'focus', 'group-hover']
  },
  plugins: []
}
