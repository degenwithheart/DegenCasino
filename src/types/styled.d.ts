import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      surface: string;
      success: string;
      accent: string;
      text: string;
      textSecondary: string;
    };
  }
}
