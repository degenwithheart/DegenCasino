/**
 * DegenHeart Theme Registration
 * This file registers the degenheart theme with the theme system
 */
import { registerTheme } from '../../themeConfig';

// Register the degenheart theme
registerTheme('degenheart', {
  description: 'DegenHeart theme with custom Holy Grail layout'
});

// Export any theme-specific utilities if needed
export const degenHeartThemeId = 'degenheart';