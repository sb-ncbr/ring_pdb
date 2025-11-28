import { PaletteOptions } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
  interface PaletteOptions {
    custom?: {
      paleViolet: string;
      paleOrange: string;
      paleGreen: string;
    };
  }
}