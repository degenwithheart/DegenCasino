// Shared theme tokens for DiceDual game UI
export const DICEDUAL_THEME = {
  colors: {
    primary: '#667eea',
    primaryDark: '#5568d3',
    secondary: '#764ba2',
    secondaryDark: '#66398f',
    
    // Backgrounds
    bgGradientStart: '#1e1e2e',
    bgGradientEnd: '#16161e',
    tileBg: 'rgba(26,32,44,0.9)',
    tileBorder: 'rgba(74,85,104,0.5)',
    
    // Text
    labelColor: '#aaa',
    activeLabelColor: '#ddd',
    textPrimary: '#fff',
    textSecondary: '#888',
    
    // Status
    statusWaiting: '#ffc107',
    statusReady: '#4caf50',
    statusStarted: '#666',
    
    // Results
    win: '#42ff78',
    lose: '#ff5555',
    tie: '#ffa500',
    
    // UI Elements
    border: 'rgba(255, 255, 255, 0.1)',
    borderHover: '#667eea',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },
  sizes: {
    tilePadding: '12px',
    borderRadius: '12px',
    buttonRadius: '8px',
  }
}

export default DICEDUAL_THEME
