import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

interface Props extends React.PropsWithChildren {
  onClose?: () => void;
  variant?: 'popup' | 'viewport';
}

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const Overlay = styled.div<{ $variant?: 'popup' | 'viewport'; }>`
  position: ${({ $variant }) => $variant === 'viewport' ? 'absolute' : 'fixed'};
  ${({ $variant }) => $variant === 'viewport' ?
    'inset: 0;' :
    'inset: 0;'
  }
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  z-index: ${({ $variant }) => $variant === 'viewport' ? '1000' : '9999'};
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease;
`;

const Content = styled.div`
  background: linear-gradient(135deg, 
    rgba(26, 26, 26, 0.95) 0%, 
    rgba(45, 27, 105, 0.9) 50%,
    rgba(26, 26, 26, 0.95) 100%
  );
  border: 2px solid #ffd700;
  border-radius: 16px;
  padding: 2rem;
  max-width: min(90vw, 800px);
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 
    0 0 50px rgba(255, 215, 0, 0.3),
    inset 0 0 30px rgba(162, 89, 255, 0.1);
  animation: ${fadeIn} 0.3s ease;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(26, 26, 26, 0.5);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #ffd700, #a259ff);
    border-radius: 4px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: 2px solid #ffd700;
  color: #ffd700;
  font-size: 1.2rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 1;
  
  &:hover {
    background: #ffd700;
    color: #000;
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  }
`;

export const ModalContent = styled.div<{ $maxWidth?: string; $colorScheme?: any; }>`
  width: 100%;
  max-width: ${props => props.$maxWidth || '600px'};
  margin: 0 auto;
  padding: 1.5rem;
  color: ${props => props.$colorScheme?.colors?.text || '#fff'};
  background: transparent;
  
  /* Mobile-first responsive adjustments */
  @media (max-width: 768px) {
    padding: 1rem;
    max-width: 95vw;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    max-width: 100vw;
  }
`;

export const Modal: React.FC<Props> = ({ children, onClose, variant = 'popup' }) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Only close if it's a direct click on the overlay, not during scroll or drag
    if (e.target === e.currentTarget && e.detail === 1 && onClose) {
      onClose();
    }
  };

  return (
    <Overlay $variant={variant} onClick={handleOverlayClick}>
      <Content>
        {onClose && (
          <CloseButton onClick={onClose} aria-label="Close modal">
            ×
          </CloseButton>
        )}
        {children}
      </Content>
    </Overlay>
  );
};

export default Modal;