import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontSize: 14,
    color: '#3A3A3A',
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
          fontSize: '0.9rem',
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
    // MuiOutlinedInput: {
    //   styleOverrides: {
    //     root: {
    //       backgroundColor: '#FFFFFF',
    //       '&.Mui-focused': {
    //         backgroundColor: '#EDEEEF',
    //       },
    //       borderRadius: '50px',
    //       '& .MuiOutlinedInput-notchedOutline': {
    //         borderColor: 'black',
    //       },
    //       '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    //         borderColor: 'black',
    //         borderWidth: '1px',
    //       },
    //     },
    //   },
    // },
  },
});

export default theme;
