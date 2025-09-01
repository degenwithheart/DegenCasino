import styled, { keyframes } from 'styled-components'

// Casino animations
export const neonPulse = keyframes`
  0% { 
    box-shadow: 0 0 24px #a259ff88, 0 0 48px #ffd70044;
    border-color: #ffd70044;
  }
  100% { 
    box-shadow: 0 0 48px #ffd700cc, 0 0 96px #a259ff88;
    border-color: #ffd700aa;
  }
`;

export const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

export const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.8); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
`;

export const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

export const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const pulse = keyframes`
  0% { opacity: 0.5; }
  100% { opacity: 1; }
`;

export const pulseWarning = keyframes`
  0% { opacity: 0.3; }
  100% { opacity: 0.8; }
`;

export const Wrap = styled.div`
  width: 100%;
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  color: #fff;
  font-family: 'DM Sans', 'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  min-height: 100vh;
  position: relative;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(162, 89, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 0, 204, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`

export const Container = styled.div`
  max-width: 100%; /* Let main handle width constraints */
  width: 100%;
  margin: 2rem 0; /* Only vertical margins like Dashboard */
  padding: 2rem;
  box-sizing: border-box;

  @media (max-width: 1200px) {
    margin: 1.5rem 0;
    padding: 1.5rem;
  }
  @media (max-width: 900px) {
    margin: 0.5rem 0;
    padding: 0.8rem;
  }
  @media (max-width: 700px) {
    margin: 0.25rem 0;
    padding: 0.5rem;
  }
  @media (max-width: 480px) {
    margin: 0;
    padding: 0.3rem;
  }
`

export const HeroSection = styled.div`
  text-align: center;
  padding: 4rem 0 3rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
    border-radius: 50%;
    z-index: -1;
  }

  @media (max-width: 768px) {
    padding: 2rem 0 1.5rem;
  }
`

export const MainTitle = styled.h1`
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  margin: 0 0 1.5rem;
  background: linear-gradient(135deg, #ffd700 0%, #a259ff 50%, #ff00cc 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 3px;
  text-shadow: 0 0 40px rgba(255, 215, 0, 0.3);
  line-height: 1.1;
`

export const MainSubtitle = styled.p`
  font-size: 1.2rem;
  color: #cbd5e1;
  margin: 0 auto 2rem;
  max-width: 800px;
  line-height: 1.7;
  opacity: 0.9;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr minmax(280px, 300px);
  gap: 2rem;
  margin-bottom: 3rem;
  width: 100%;
  max-width: 100%;
  overflow: hidden;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    gap: 1rem;
    margin-bottom: 2rem;
    
    /* On mobile, show sidebar first */
    display: flex;
    flex-direction: column;
  }
`

export const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-width: 0; /* Prevent flex item overflow */

  @media (max-width: 768px) {
    gap: 1rem;
  }
`

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 100%;
  min-width: 0; /* Prevent flex item overflow */

  @media (max-width: 1200px) {
    order: -1;
  }

  @media (max-width: 768px) {
    order: -1;
    gap: 1rem;
  }
`

export const QuickStats = styled.div`
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(162, 89, 255, 0.1));
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.1), transparent);
    animation: ${shimmer} 2s infinite;
  }

  h3 {
    margin: 0 0 1rem 0;
    color: #ffd700;
    font-family: 'Luckiest Guy', cursive;
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
`

export const StatusHeader = styled.div<{ status: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 8px;
  background: ${props => {
    switch (props.status) {
      case 'healthy': return 'rgba(34, 197, 94, 0.1)';
      case 'warning': return 'rgba(251, 191, 36, 0.1)';
      case 'critical': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(156, 163, 175, 0.1)';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'healthy': return 'rgba(34, 197, 94, 0.3)';
      case 'warning': return 'rgba(251, 191, 36, 0.3)';
      case 'critical': return 'rgba(239, 68, 68, 0.3)';
      default: return 'rgba(156, 163, 175, 0.3)';
    }
  }};

  .status-icon {
    font-size: 1.2rem;
  }

  .status-text {
    font-weight: 600;
    color: ${props => {
      switch (props.status) {
        case 'healthy': return '#22c55e';
        case 'warning': return '#f59e0b';
        case 'critical': return '#ef4444';
        default: return '#9ca3af';
      }
    }};
  }
`

export const StatsTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #ffd700;
  font-family: 'Luckiest Guy', cursive;
  font-size: 1rem;
  text-align: center;
`

export const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }

  .label {
    color: #cbd5e1;
    font-size: 0.9rem;
  }

  .value {
    color: #ffd700;
    font-weight: 600;
    font-size: 0.9rem;
  }

  .percentage {
    color: #a259ff;
    font-size: 0.8rem;
    margin-left: 0.5rem;
  }
`

export const Card = styled.div<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  background: ${props => {
    switch (props.variant) {
      case 'primary': return 'linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(162, 89, 255, 0.1))';
      case 'secondary': return 'linear-gradient(135deg, rgba(162, 89, 255, 0.1), rgba(255, 0, 204, 0.1))';
      case 'danger': return 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(251, 191, 36, 0.1))';
      default: return 'rgba(15, 15, 35, 0.8)';
    }
  }};
  border: 1px solid ${props => {
    switch (props.variant) {
      case 'primary': return 'rgba(255, 215, 0, 0.3)';
      case 'secondary': return 'rgba(162, 89, 255, 0.3)';
      case 'danger': return 'rgba(239, 68, 68, 0.3)';
      default: return 'rgba(42, 42, 74, 0.5)';
    }
  }};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => {
      switch (props.variant) {
        case 'primary': return 'rgba(255, 215, 0, 0.2)';
        case 'secondary': return 'rgba(162, 89, 255, 0.2)';
        case 'danger': return 'rgba(239, 68, 68, 0.2)';
        default: return 'rgba(0, 0, 0, 0.2)';
      }
    }};
  }

  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`

export const CardTitle = styled.h2<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  margin: 0 0 1rem 0;
  color: ${props => {
    switch (props.variant) {
      case 'primary': return '#ffd700';
      case 'secondary': return '#a259ff';
      case 'danger': return '#ef4444';
      default: return '#ffd700';
    }
  }};
  font-family: 'Luckiest Guy', cursive;
  font-size: 1.5rem;
  text-align: center;
  text-shadow: 0 0 10px ${props => {
    switch (props.variant) {
      case 'primary': return 'rgba(255, 215, 0, 0.5)';
      case 'secondary': return 'rgba(162, 89, 255, 0.5)';
      case 'danger': return 'rgba(239, 68, 68, 0.5)';
      default: return 'rgba(255, 215, 0, 0.5)';
    }
  }};

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`

export const ControlPanel = styled.div`
  background: rgba(15, 15, 35, 0.9);
  border: 1px solid rgba(42, 42, 74, 0.5);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
`

export const ControlGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`

export const RefreshButton = styled.button`
  background: linear-gradient(135deg, #ffd700, #a259ff);
  color: #222;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-family: 'Luckiest Guy', cursive;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.5);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .spinner {
    animation: ${spin} 1s linear infinite;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`

export const ToggleSwitch = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #cbd5e1;

  input[type="checkbox"] {
    display: none;
  }

  .switch {
    position: relative;
    width: 44px;
    height: 24px;
    background: rgba(42, 42, 74, 0.5);
    border-radius: 12px;
    transition: background 0.3s ease;

    &::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: #fff;
      border-radius: 50%;
      transition: transform 0.3s ease;
    }
  }

  input:checked + .switch {
    background: linear-gradient(135deg, #ffd700, #a259ff);

    &::before {
      transform: translateX(20px);
    }
  }

  .label-text {
    flex: 1;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    gap: 0.5rem;

    .switch {
      width: 36px;
      height: 20px;

      &::before {
        width: 16px;
        height: 16px;
      }
    }

    input:checked + .switch::before {
      transform: translateX(16px);
    }
  }
`

export const StatusBanner = styled.div<{ status: 'healthy' | 'warning' | 'critical' }>`
  background: ${props => {
    switch (props.status) {
      case 'healthy': return 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))';
      case 'warning': return 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(251, 191, 36, 0.05))';
      case 'critical': return 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))';
      default: return 'linear-gradient(135deg, rgba(156, 163, 175, 0.1), rgba(156, 163, 175, 0.05))';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'healthy': return 'rgba(34, 197, 94, 0.3)';
      case 'warning': return 'rgba(251, 191, 36, 0.3)';
      case 'critical': return 'rgba(239, 68, 68, 0.3)';
      default: return 'rgba(156, 163, 175, 0.3)';
    }
  }};
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: center;
  animation: ${props => props.status === 'warning' ? pulseWarning : pulse} 2s infinite alternate;

  .status-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    display: block;
  }

  .status-title {
    color: ${props => {
      switch (props.status) {
        case 'healthy': return '#22c55e';
        case 'warning': return '#f59e0b';
        case 'critical': return '#ef4444';
        default: return '#9ca3af';
      }
    }};
    font-family: 'Luckiest Guy', cursive;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .status-message {
    color: #cbd5e1;
    font-size: 1rem;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    padding: 0.75rem;
    margin-bottom: 1.5rem;

    .status-title {
      font-size: 1.2rem;
    }

    .status-message {
      font-size: 0.9rem;
    }
  }
`

export const TableContainer = styled.div`
  background: rgba(15, 15, 35, 0.9);
  border: 1px solid rgba(42, 42, 74, 0.5);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
  overflow-x: auto;

  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }
`

export const ModernTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  th {
    background: rgba(255, 215, 0, 0.1);
    color: #ffd700;
    font-family: 'Luckiest Guy', cursive;
    font-weight: bold;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  tr:nth-child(even) {
    background: rgba(255, 255, 255, 0.02);
  }

  tr:hover {
    background: rgba(255, 215, 0, 0.05);
  }

  .status-cell {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &.pass {
      color: #22c55e;
    }

    &.fail {
      color: #ef4444;
    }

    &.warning {
      color: #f59e0b;
    }
  }

  .percentage-cell {
    font-weight: 600;
    text-align: right;

    &.positive {
      color: #22c55e;
    }

    &.negative {
      color: #ef4444;
    }

    &.neutral {
      color: #cbd5e1;
    }
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;

    th, td {
      padding: 0.5rem;
    }
  }
`

export const ControlRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`

export const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #cbd5e1;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #ffd700;
  }

  span {
    font-weight: 500;
  }

  b {
    color: #ffd700;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`

export const StatusInfo = styled.div`
  font-size: 0.9rem;
  color: #94a3b8;
  text-align: center;
  margin-top: 0.5rem;

  b {
    color: #ffd700;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
`

export const StatCard = styled.div`
  background: rgba(15, 15, 35, 0.8);
  border: 1px solid rgba(42, 42, 74, 0.5);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  backdrop-filter: blur(5px);

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`

export const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffd700;
  font-family: 'Luckiest Guy', cursive;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`

export const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #cbd5e1;
  margin-top: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`

export const LoadingSpinner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #ffd700;
  font-size: 1rem;

  &::before {
    content: '';
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 215, 0, 0.3);
    border-top: 2px solid #ffd700;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    margin-right: 0.5rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    font-size: 0.9rem;
  }
`

export const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: 8px;
  background: rgba(15, 15, 35, 0.9);
  border: 1px solid rgba(42, 42, 74, 0.5);

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`

export const Th = styled.th`
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 215, 0, 0.1);
  color: #ffd700;
  font-family: 'Luckiest Guy', cursive;
  font-weight: bold;
  position: sticky;
  top: 0;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`

export const FailingRow = styled.td<{ isFailing?: boolean }>`
  padding: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: ${props => props.isFailing ? 'rgba(239, 68, 68, 0.1)' : 'transparent'};
  color: ${props => props.isFailing ? '#ef4444' : 'inherit'};

  strong {
    color: ${props => props.isFailing ? '#ef4444' : '#ffd700'};
  }

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`

export const DataValue = styled.span<{ type?: string }>`
  font-weight: 600;
  color: ${props => {
    switch (props.type) {
      case 'percentage': return '#a259ff';
      default: return '#ffd700';
    }
  }};
`

export const Badge = styled.span<{ tone?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;

  ${props => {
    switch (props.tone) {
      case 'ok':
        return `
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        `;
      case 'warn':
        return `
          background: rgba(251, 191, 36, 0.2);
          color: #f59e0b;
          border: 1px solid rgba(251, 191, 36, 0.3);
        `;
      default:
        return `
          background: rgba(156, 163, 175, 0.2);
          color: #9ca3af;
          border: 1px solid rgba(156, 163, 175, 0.3);
        `;
    }
  }}
`

export const DesktopTable = styled.div`
  @media (max-width: 768px) {
    display: none;
  }
`

export const MobileCard = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    background: rgba(15, 15, 35, 0.8);
    border: 1px solid rgba(42, 42, 74, 0.5);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    backdrop-filter: blur(5px);
  }

  .game-title {
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: #ffd700;
  }

  .data-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .data-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .label {
    color: #cbd5e1;
    font-size: 0.8rem;
  }

  .value {
    color: #a259ff;
    font-weight: 600;
    font-size: 0.8rem;
  }
`

export const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`

export const Mono = styled.span`
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #94a3b8;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`

export const MethodologyCard = styled.div`
  background: linear-gradient(135deg, rgba(162, 89, 255, 0.1), rgba(255, 0, 204, 0.1));
  border: 1px solid rgba(162, 89, 255, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);

  h3 {
    margin: 0 0 1rem 0;
    color: #a259ff;
    font-family: 'Luckiest Guy', cursive;
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;

    h3 {
      font-size: 1rem;
    }
  }
`

export const MethodologyList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 0.75rem;
    padding-left: 1.5rem;
    position: relative;
    color: #cbd5e1;
    line-height: 1.5;

    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #22c55e;
      font-weight: bold;
    }

    strong {
      color: #ffd700;
    }
  }

  @media (max-width: 768px) {
    li {
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
      padding-left: 1.25rem;
    }
  }
`

export const Footer = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: #94a3b8;
  font-size: 0.9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 3rem;

  p {
    margin: 0.5rem 0;
    line-height: 1.5;
  }

  a {
    color: #a259ff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem 0;
    font-size: 0.8rem;
    margin-top: 2rem;
  }
`
