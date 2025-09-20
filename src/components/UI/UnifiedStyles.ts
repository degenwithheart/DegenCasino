import styled from 'styled-components'

// Shared container styling based on ExplorerIndex pattern
export const UnifiedPageContainer = styled.div<{ visible?: boolean }>`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  
  /* Use CSS variables for consistent theming */
  background: var(--slate-1);
  border-radius: 16px;
  border: 1px solid var(--slate-6);
  
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: translateY(${({ visible }) => (visible ? '0' : '20px')});
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1.5rem;
  }
`

// Unified card component for consistent layout
export const UnifiedCard = styled.div<{ hover?: boolean }>`
  background: var(--slate-1);
  border: 1px solid var(--slate-6);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  
  ${({ hover }) => hover && `
    &:hover {
      border-color: #ffd700;
      box-shadow: 0 4px 20px rgba(255, 215, 0, 0.1);
      transform: translateY(-2px);
    }
  `}
`

// Unified section heading
export const UnifiedSectionHeading = styled.h2`
  color: var(--text-primary);
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  
  background: linear-gradient(135deg, #ffd700 0%, #a259ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`

// Unified page title
export const UnifiedPageTitle = styled.h1`
  color: var(--text-primary);
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 2rem 0;
  text-align: center;
  
  background: linear-gradient(135deg, #ffd700 0%, #a259ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`

// Unified content container
export const UnifiedContent = styled.div`
  color: var(--text-secondary);
  line-height: 1.6;
  
  p {
    margin: 0 0 1rem 0;
  }
  
  ul, ol {
    margin: 0 0 1rem 1.5rem;
    
    li {
      margin: 0.5rem 0;
    }
  }
  
  strong {
    color: var(--text-primary);
    font-weight: 600;
  }
`

// Unified grid layout for cards
export const UnifiedGrid = styled.div<{ columns?: string }>`
  display: grid;
  grid-template-columns: ${({ columns }) => columns || 'repeat(auto-fit, minmax(300px, 1fr))'};
  gap: 1.5rem;
  margin: 2rem 0;
`

// Unified button styling to match Explorer theme
export const UnifiedButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 1px solid ${({ variant }) => variant === 'primary' ? '#ffd700' : 'var(--slate-6)'};
  background: ${({ variant }) => variant === 'primary' ? 'linear-gradient(135deg, #ffd700 0%, #a259ff 100%)' : 'var(--slate-1)'};
  color: ${({ variant }) => variant === 'primary' ? '#000' : 'var(--text-primary)'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px ${({ variant }) => 
      variant === 'primary' ? 'rgba(255, 215, 0, 0.3)' : 'rgba(162, 89, 255, 0.2)'
    };
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`

// Unified stats/metric display
export const UnifiedStat = styled.div`
  text-align: center;
  
  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0.5rem 0;
    
    background: linear-gradient(135deg, #ffd700 0%, #a259ff 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .stat-label {
    font-size: 0.9rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`

// Unified responsive wrapper
export const UnifiedResponsiveContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
`