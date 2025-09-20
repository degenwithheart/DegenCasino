import styled from 'styled-components'

// Tab navigation for whitepaper sections
export const Tabs = styled.div<{ $colorScheme: any }>`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0;
  flex-wrap: wrap;

  button {
    padding: 0.75rem 1.5rem;
    border: 1px solid var(--slate-6);
    border-radius: 8px;
    background: var(--slate-1);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;

    &:hover {
      border-color: #ffd700;
      background: rgba(255, 215, 0, 0.1);
    }

    &.active {
      background: linear-gradient(135deg, #ffd700 0%, #a259ff 100%);
      color: #000;
      border-color: #ffd700;
      font-weight: 600;
    }
  }

  @media (max-width: 768px) {
    button {
      flex: 1;
      min-width: calc(50% - 0.25rem);
    }
  }
`