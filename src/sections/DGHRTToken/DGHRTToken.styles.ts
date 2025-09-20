import styled from 'styled-components'

// Keep only the essential custom styling that works with unified components
export const TokenHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3rem;
  text-align: center;
  
  .token-logo {
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.05);
    }
  }
  
  .subtitle {
    color: var(--text-secondary);
    font-style: italic;
    margin-top: 1rem;
    font-size: 1.2rem;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 2rem;
    
    .subtitle {
      font-size: 1rem;
    }
  }
`;

export const BuySection = styled.div`
  text-align: center;
  margin: 2rem 0;
  
  .coming-soon {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffd700;
    margin: 1rem 0;
  }
  
  .description {
    margin: 1rem 0;
    line-height: 1.6;
  }
`;