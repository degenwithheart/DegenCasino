import styled from 'styled-components'

// Continent selector for the Terms page
export const Selector = styled.div<{ $colorScheme: any }>`
  margin-bottom: 2rem;

  label {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  button {
    margin: 0.5rem;
    padding: 0.75rem 1.5rem;
    border: 1px solid var(--slate-6);
    border-radius: 8px;
    background: var(--slate-1);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      border-color: #ffd700;
      background: rgba(255, 215, 0, 0.1);
    }

    &.active {
      background: linear-gradient(135deg, #ffd700 0%, #a259ff 100%);
      color: #000;
      border-color: #ffd700;
    }
  }
`

// Flag emoji container
export const Flag = styled.span`
  font-size: 1.2rem;
`