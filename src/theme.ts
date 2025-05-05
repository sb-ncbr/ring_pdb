import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      paleViolet: string;
      paleOrange: string;
      paleGreen: string;
    };
  }

  interface PaletteOptions {
    custom?: {
      paleViolet?: string;
      paleOrange?: string;
      paleGreen?: string;
    };
  }
}

const theme = createTheme({
  typography: {
    h1: {
      fontFamily: 'Lora, serif',
      fontWeight: 700,
      fontSize: '3rem',
    },
    h2: {
      fontFamily: 'Lora, serif',
      fontWeight: 600,
      fontSize: '2.25rem',
    },
    h3: {
      fontFamily: 'Lora, serif',
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    subtitle1: {
      fontFamily: 'Lora, serif',
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    subtitle2: {
      fontFamily: 'Lora, serif',
      fontWeight: 500,
      fontSize: '1rem',
    },
    body1: {
      fontFamily: 'EireneSans, sans-serif',
      fontWeight: 400,
      fontSize: '1rem',
    },
    body2: {
      fontFamily: 'Lora, serif',
      fontWeight: 400,
      fontSize: '0.875rem',
    },
    caption: {
      fontFamily: 'EireneSans, sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
    },
    // outline: {
    //   fontFamily: 'EireneSans, sans-serif',
    //   fontWeight: 700,
    //   fontSize: '1rem',
    // },
  },
  palette: {
    primary: {
      main: '#E46962',
    },
    secondary: {
      main: '#AFAFAF',
    },
    text: {
      primary: '#3A3A3A',
    },
    custom: {
      paleViolet: '#EBE4FF',
      paleOrange: '#F6E8D8',
      paleGreen: '#E2EFEF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          // fontSize: '0.9rem',
          color: '#3A3A3A',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
        },
      },
    },
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          color: '#000000',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
        outlined: {
          borderRadius: '50px',
          padding: '4px 24px',
          borderColor: '#000000',
          '&:hover': {
            borderColor: '#000000',
          },
        },
        text: {
          color: '#000000',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
  },
});

export default theme;
