import {createTheme, type MantineColorsTuple} from '@mantine/core'

// Earthy brown ramp — light cream to deep umber
const earthBrown: MantineColorsTuple = [
  '#F6F3EC', // 0 - lightest, page/card backgrounds
  '#EDE7D9', // 1
  '#DCD5C6', // 2 - subtle borders
  '#C7B9A3', // 3
  '#AC9678', // 4
  '#8A6D4F', // 5 - tan / secondary accents
  '#6E5640', // 6 - default shade (buttons, active states)
  '#5C4A3A', // 7 - primary text / headers
  '#493A2E', // 8
  '#362B22', // 9 - darkest, high-contrast text
]

// Earthy green ramp — soft sage to deep olive
const earthGreen: MantineColorsTuple = [
  '#F0F4E9', // 0 - lightest
  '#E1EAD3', // 1
  '#C9D9AC', // 2
  '#ACC685', // 3
  '#93B368', // 4
  '#7A9459', // 5 - sage accent
  '#647D48', // 6 - default shade
  '#4F6B3A', // 7 - primary green (buttons, active nav)
  '#3D5430', // 8
  '#2C3E23', // 9 - darkest
]

const accent: MantineColorsTuple = [
  '#8c3a2a',
  '#8c3a2a',
  '#8c3a2a',
  '#8c3a2a',
  '#8c3a2a',
  '#8c3a2a',
  '#8c3a2a',
  '#8c3a2a',
  '#8c3a2a',
  '#8c3a2a',
]

export const theme = createTheme({
  colors: {
    earthBrown,
    earthGreen,
    accent,
  },
  primaryColor: 'earthGreen',
  primaryShade: {light: 7, dark: 4},

  // Warm cream page background, deep brown text
  white: '#F6F3EC',
  black: '#3E2F22',

  defaultRadius: 'md',
  fontFamily: 'Inter, system-ui, sans-serif',

  headings: {
    fontWeight: '500',
  },

  components: {
    Button: {
      defaultProps: {
        radius: 'md',
      },
    },
    Card: {
      defaultProps: {
        radius: 'lg',
        withBorder: true,
      },
      styles: {
        root: {
          borderColor: earthBrown[2],
        },
      },
    },
    Paper: {
      defaultProps: {
        radius: 'lg',
      },
    },
    TextInput: {
      styles: {input: {backgroundColor: 'white'}},
    },
    NumberInput: {
      styles: {input: {backgroundColor: 'white'}},
    },
  },

  other: {
    // Handy raw hex refs if you need them outside Mantine's color system
    background: '#F6F3EC',
    surface: '#FFFFFF',
    textPrimary: '#3E2F22',
    textSecondary: earthBrown[5],
    borderSubtle: earthBrown[2],
  },
})
