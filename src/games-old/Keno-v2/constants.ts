// Keno v2 Game Constants
export const GAME_CONFIG = {
  GRID_SIZE: 40,
  GRID_COLS: 8,
  GRID_ROWS: 5,
  MAX_SELECTION: 10,
  DRAW_COUNT: 10,
  
  // Canvas dimensions
  CANVAS_WIDTH: 1200,
  CANVAS_HEIGHT: 800,
  
  // Grid cell dimensions
  CELL_SIZE: 60,
  CELL_GAP: 8,
  
  // Grid positioning
  GRID_START_X: 200,
  GRID_START_Y: 150,
  
  // Colors (romantic degen colorScheme)
  COLORS: {
    background: '#0f0f23',
    gridBackground: 'rgba(212, 165, 116, 0.1)',
    cellDefault: 'rgba(212, 165, 116, 0.2)',
    cellHover: 'rgba(212, 165, 116, 0.4)',
    cellSelected: '#d4a574',
    cellWinning: '#b8336a',
    cellDrawn: 'rgba(139, 90, 158, 0.6)',
    text: '#ffffff',
    textSecondary: '#d4a574',
    accent: '#b8336a',
  }
}

export const PAYTABLE = {
  1: { 0: 0, 1: 3.0 },
  2: { 0: 0, 1: 1.0, 2: 9.0 },
  3: { 0: 0, 1: 1.0, 2: 2.0, 3: 16.0 },
  4: { 0: 0, 1: 0.5, 2: 2.0, 3: 6.0, 4: 25.0 },
  5: { 0: 0, 1: 0.5, 2: 1.0, 3: 3.0, 4: 15.0, 5: 50.0 },
  6: { 0: 0, 1: 0.5, 2: 1.0, 3: 2.0, 4: 3.0, 5: 30.0, 6: 75.0 },
  7: { 0: 0, 1: 0.5, 2: 0.5, 3: 1.0, 4: 6.0, 5: 12.0, 6: 36.0, 7: 100.0 },
  8: { 0: 0, 1: 0.5, 2: 0.5, 3: 1.0, 4: 2.0, 5: 4.0, 6: 20.0, 7: 80.0, 8: 500.0 },
  9: { 0: 0, 1: 0.5, 2: 0.5, 3: 1.0, 4: 1.0, 5: 5.0, 6: 10.0, 7: 50.0, 8: 200.0, 9: 1000.0 },
  10: { 0: 0, 1: 0, 2: 0.5, 3: 1.0, 4: 2.0, 5: 5.0, 6: 15.0, 7: 40.0, 8: 100.0, 9: 250.0, 10: 1800.0 }
}

export const GAME_STATES = {
  IDLE: 'idle',
  PLAYING: 'playing',
  REVEALING: 'revealing',
  COMPLETE: 'complete'
} as const

export type GameState = typeof GAME_STATES[keyof typeof GAME_STATES]