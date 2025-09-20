import styled, { keyframes } from 'styled-components'

// Essential animations for audit components
export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const pulse = keyframes`
  0% { opacity: 0.5; }
  100% { opacity: 1; }
`;

// Status header for system health indicators
export const StatusHeader = styled.div<{ status: 'success' | 'loading' | 'error' }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  background: ${({ status }) => {
    switch (status) {
      case 'success': return 'rgba(34, 197, 94, 0.1)';
      case 'loading': return 'rgba(59, 130, 246, 0.1)';
      case 'error': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(156, 163, 175, 0.1)';
    }
  }};
  border: 1px solid ${({ status }) => {
    switch (status) {
      case 'success': return 'rgba(34, 197, 94, 0.3)';
      case 'loading': return 'rgba(59, 130, 246, 0.3)';
      case 'error': return 'rgba(239, 68, 68, 0.3)';
      default: return 'rgba(156, 163, 175, 0.3)';
    }
  }};

  .status-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    .status-icon {
      font-size: 1.2rem;
    }
    
    .status-text {
      font-weight: 600;
      color: var(--text-primary);
    }
  }

  .last-updated {
    font-size: 0.9rem;
    color: var(--text-secondary);
    
    .time {
      font-weight: 600;
      color: var(--text-primary);
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
`

// Control panel for test settings
export const ControlPanel = styled.div`
  margin-bottom: 1.5rem;
`

export const ControlRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`

export const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-secondary);

  input[type="checkbox"] {
    accent-color: #ffd700;
  }

  span {
    user-select: none;
  }
`

export const StatusInfo = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  
  b {
    color: var(--text-primary);
    font-weight: 600;
  }
`

// Loading spinner
export const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid var(--slate-6);
  border-top: 3px solid #ffd700;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto;
`

// Table components for audit results
export const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--slate-6);
`

export const DesktopTable = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: var(--slate-1);
`

export const Th = styled.th`
  padding: 1rem;
  text-align: left;
  background: var(--slate-6);
  color: var(--text-primary);
  font-weight: 600;
  border-bottom: 1px solid var(--slate-6);
  
  &:first-child {
    border-top-left-radius: 8px;
  }
  
  &:last-child {
    border-top-right-radius: 8px;
  }
`

export const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid var(--slate-6);
  color: var(--text-secondary);
`

export const FailingRow = styled.tr<{ status: 'ok' | 'warning' | 'error' }>`
  &:hover {
    background: rgba(255, 215, 0, 0.05);
  }

  ${({ status }) => {
    if (status === 'error') {
      return `
        background: rgba(239, 68, 68, 0.05);
        border-left: 3px solid #ef4444;
      `;
    }
    if (status === 'warning') {
      return `
        background: rgba(245, 158, 11, 0.05);
        border-left: 3px solid #f59e0b;
      `;
    }
    return `
      background: rgba(34, 197, 94, 0.02);
      border-left: 3px solid #22c55e;
    `;
  }}
`

export const Badge = styled.span<{ status: 'ok' | 'warning' | 'error' }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  
  ${({ status }) => {
    switch (status) {
      case 'ok':
        return `
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        `;
      case 'warning':
        return `
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        `;
      case 'error':
        return `
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        `;
      default:
        return `
          background: rgba(156, 163, 175, 0.1);
          color: #9ca3af;
          border: 1px solid rgba(156, 163, 175, 0.3);
        `;
    }
  }}
`

export const MobileCard = styled.div<{ status: 'ok' | 'warning' | 'error' }>`
  display: none;
  background: var(--slate-1);
  border: 1px solid var(--slate-6);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  
  ${({ status }) => {
    if (status === 'error') {
      return `border-left: 3px solid #ef4444;`;
    }
    if (status === 'warning') {
      return `border-left: 3px solid #f59e0b;`;
    }
    return `border-left: 3px solid #22c55e;`;
  }}

  @media (max-width: 768px) {
    display: block;
  }
`

export const Mono = styled.span`
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9rem;
  background: rgba(255, 215, 0, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
`

export const DataValue = styled.span<{ status?: 'good' | 'bad' | 'neutral' }>`
  font-weight: 600;
  color: ${({ status }) => {
    switch (status) {
      case 'good': return '#22c55e';
      case 'bad': return '#ef4444';
      default: return 'var(--text-primary)';
    }
  }};
`

// Methodology list for explanations
export const MethodologyList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--slate-6);
    color: var(--text-secondary);
    line-height: 1.5;

    &:last-child {
      border-bottom: none;
    }

    strong {
      color: var(--text-primary);
    }
  }
`

// Legacy components for compatibility (minimal implementation)
export const QuickStats = styled.div``
export const StatsTitle = styled.h3``
export const StatItem = styled.div``
export const ControlGrid = styled.div``
export const RefreshButton = styled.button``
export const ToggleSwitch = styled.div``
export const StatusBanner = styled.div``
export const TableContainer = styled.div``
export const ModernTable = styled.div``
export const Footer = styled.div``