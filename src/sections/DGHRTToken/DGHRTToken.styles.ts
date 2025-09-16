import styled, { keyframes } from 'styled-components'

// Heartbeat Animation for the token
export const heartbeat = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

export const tokenGlow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(212, 165, 116, 0.3), 0 0 40px rgba(184, 54, 106, 0.2);
    border-color: rgba(212, 165, 116, 0.4);
  }
  50% { 
    box-shadow: 0 0 40px rgba(212, 165, 116, 0.6), 0 0 80px rgba(184, 54, 106, 0.4);
    border-color: rgba(212, 165, 116, 0.8);
  }
`;

export const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

interface ContainerProps {
  visible?: boolean;
  $colorScheme?: any;
}

export const Container = styled.div<ContainerProps>`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 3rem;
  
  /* Romantic glassmorphism background */
  background: ${({ $colorScheme }) => 
    $colorScheme?.colors?.containerBackground || 
    `linear-gradient(135deg, 
      rgba(18, 18, 22, 0.95) 0%, 
      rgba(30, 20, 35, 0.9) 50%, 
      rgba(25, 15, 30, 0.95) 100%
    )`
  };
  
  backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 165, 116, 0.2);
  border-radius: 24px;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(212, 165, 116, 0.1);
  
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: translateY(${({ visible }) => (visible ? '0' : '20px')});
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);

  h1 {
    font-size: 3rem;
    background: linear-gradient(135deg, #d4a574 0%, #b8366a 50%, #d4a574 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
    margin-bottom: 1rem;
    text-shadow: 0 4px 20px rgba(212, 165, 116, 0.3);
    animation: ${heartbeat} 2s ease-in-out infinite;
  }

  .subtitle {
    text-align: center;
    color: #ccc;
    font-style: italic;
    margin-bottom: 3rem;
    opacity: 0.9;
    font-size: 1.2rem;
  }
`;

export const TokenHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3rem;
  
  .token-logo {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    margin-bottom: 2rem;
    animation: ${floatAnimation} 3s ease-in-out infinite;
    box-shadow: 0 10px 30px rgba(212, 165, 116, 0.3);
    border: 3px solid rgba(212, 165, 116, 0.4);
  }
`;

export const TokenStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

export const StatCard = styled.div<{ $colorScheme?: any }>`
  background: ${({ $colorScheme }) => 
    $colorScheme?.colors?.cardBackground || 
    'linear-gradient(135deg, rgba(30, 20, 35, 0.8) 0%, rgba(25, 15, 30, 0.9) 100%)'
  };
  
  border: 1px solid rgba(212, 165, 116, 0.2);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  animation: ${tokenGlow} 3s ease-in-out infinite;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(212, 165, 116, 0.2);
    border-color: rgba(212, 165, 116, 0.6);
  }

  h3 {
    color: #d4a574;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: #fff;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    color: #ccc;
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

export const BuySection = styled.div<{ $colorScheme?: any }>`
  background: ${({ $colorScheme }) => 
    $colorScheme?.colors?.cardBackground || 
    'linear-gradient(135deg, rgba(30, 20, 35, 0.8) 0%, rgba(25, 15, 30, 0.9) 100%)'
  };
  
  border: 1px solid rgba(212, 165, 116, 0.3);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  margin-bottom: 3rem;
  animation: ${tokenGlow} 4s ease-in-out infinite;

  h2 {
    color: #d4a574;
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .coming-soon {
    font-size: 1.5rem;
    color: #b8366a;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .description {
    color: #ccc;
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
`;

export const TokenomicsSection = styled.div<{ $colorScheme?: any }>`
  background: ${({ $colorScheme }) => 
    $colorScheme?.colors?.cardBackground || 
    'linear-gradient(135deg, rgba(30, 20, 35, 0.8) 0%, rgba(25, 15, 30, 0.9) 100%)'
  };
  
  border: 1px solid rgba(212, 165, 116, 0.2);
  border-radius: 20px;
  padding: 3rem;
  margin-bottom: 3rem;

  h2 {
    color: #d4a574;
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  .tokenomics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
  }

  .tokenomics-item {
    padding: 1.5rem;
    border: 1px solid rgba(212, 165, 116, 0.1);
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(212, 165, 116, 0.3);
      transform: translateY(-2px);
    }

    h4 {
      color: #d4a574;
      margin-bottom: 1rem;
      font-size: 1.2rem;
    }

    p {
      color: #ccc;
      line-height: 1.5;
    }
  }
`;

export const UtilitySection = styled.div<{ $colorScheme?: any }>`
  background: ${({ $colorScheme }) => 
    $colorScheme?.colors?.cardBackground || 
    'linear-gradient(135deg, rgba(30, 20, 35, 0.8) 0%, rgba(25, 15, 30, 0.9) 100%)'
  };
  
  border: 1px solid rgba(212, 165, 116, 0.2);
  border-radius: 20px;
  padding: 3rem;
  margin-bottom: 3rem;

  h2 {
    color: #d4a574;
    font-size: 2rem;
    margin-bottom: 2rem;
    text-align: center;
  }

  .utility-list {
    list-style: none;
    padding: 0;

    li {
      display: flex;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid rgba(212, 165, 116, 0.1);
      color: #ccc;
      font-size: 1.1rem;

      &:last-child {
        border-bottom: none;
      }

      &:before {
        content: "💎";
        margin-right: 1rem;
        font-size: 1.2rem;
      }
    }
  }
`;

// Responsive design
export const ResponsiveContainer = styled.div`
  @media (max-width: 768px) {
    ${Container} {
      margin: 1rem;
      padding: 2rem 1.5rem;
    }

    ${TokenHeader} .token-logo {
      width: 100px;
      height: 100px;
    }

    ${Container} h1 {
      font-size: 2rem;
    }

    ${TokenStats} {
      grid-template-columns: 1fr;
    }

    ${StatCard} {
      padding: 1.5rem;
    }
  }
`;
