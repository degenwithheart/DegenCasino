
import styled, { keyframes } from 'styled-components';
import { spacing, components, media } from '../breakpoints';

// Modern bottom sheet animations
export const slideUp = keyframes`
  from {
    transform: translateY(100%) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

export const slideDown = keyframes`
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(100%) scale(0.95);
    opacity: 0;
  }
`;

export const backdropFadeIn = keyframes`
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(20px);
  }
`;

export const backdropFadeOut = keyframes`
  from {
    opacity: 1;
    backdrop-filter: blur(20px);
  }
  to {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
`;

// Premium modal backdrop with enhanced glass effect
export const ModalBackdrop = styled.div<{ $isOpen: boolean; $colorScheme: any; }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  background: linear-gradient(135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.6) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  backdrop-filter: blur(16px) saturate(180%);
  
  z-index: 2000;
  
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: flex-end; /* Bottom sheet positioning */
  justify-content: center;
  
  animation: ${props => props.$isOpen ? backdropFadeIn : backdropFadeOut} 
    250ms ease-out forwards;
  
  /* Touch to close */
  cursor: pointer;
`;// Modern bottom sheet modal container
export const ModalContainer = styled.div<{ $isOpen: boolean; $colorScheme: any; $maxHeight?: string; }>`
  width: 100%;
  max-width: 100vw;
  max-height: ${props => props.$maxHeight || '85vh'};

  background: ${props => props.$colorScheme.colors.surface};
  border: 1px solid ${props => props.$colorScheme.colors.accent}20;
  border-radius: 24px 24px 0 0;

  animation: ${props => props.$isOpen ? slideUp : slideDown} 
    250ms ease-out;  cursor: default;
  overflow: hidden;

  /* Modern drag handle */
  &::before {
    content: '';
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 36px;
    height: 4px;
    background: ${props => props.$colorScheme.colors.accent}30;
    border-radius: 2px;
  }

  ${media.tablet} {
    max-width: 50%;
    border-radius: 20px;
    align-self: center;

    &::before {
      display: none;
    }
  }
`;

// Clean modal header
export const ModalHeader = styled.div<{ $colorScheme: any; }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  padding: ${spacing.mobile.xl} ${spacing.mobile.lg} ${spacing.mobile.base};
  border-bottom: 1px solid ${props => props.$colorScheme.colors.accent}10;
  
  background: ${props => props.$colorScheme.colors.surface};
`;// Modal title
export const ModalTitle = styled.h2<{ $colorScheme: any; }>`
  margin: 0;

  color: ${props => props.$colorScheme.colors.text};
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.2;
`;

// Modal status
export const ModalStatus = styled.div<{ $colorScheme: any; }>`
  margin-top: 4px;
  
  color: ${props => props.$colorScheme.colors.textSecondary};
  font-size: 0.875rem;
  font-weight: 400;
  opacity: 0.8;
`;

// Modal close button
export const ModalCloseButton = styled.button<{ $colorScheme: any; }>`
  display: flex;
  align-items: center;
  justify-content: center;
  
  width: 44px;
  height: 44px;
  
  background: transparent;
  color: ${props => props.$colorScheme.colors.text};
  
  border: 1px solid ${props => props.$colorScheme.colors.accent}30;
  border-radius: 12px;
  
  font-size: 1rem;
  cursor: pointer;
  
  transition: all 150ms ease-out;
  
  &:active {
    transform: scale(0.95);
    background: ${props => props.$colorScheme.colors.accent}20;
  }
  
  ${media.mouse} {
    &:hover {
      background: ${props => props.$colorScheme.colors.accent}10;
    }
  }
`;// Clean modal content area
export const ModalContent = styled.div`
  padding: ${spacing.mobile.lg};
  overflow-y: auto;
  overflow-x: hidden;
  
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  
  max-height: calc(85vh - 200px);
  
  ${media.tablet} {
    max-height: calc(80vh - 200px);
  }
`;

// Clean modal footer
export const ModalFooter = styled.div<{ $colorScheme: any; }>`
  display: flex;
  gap: ${spacing.mobile.base};
  
  padding: ${spacing.mobile.lg};
  border-top: 1px solid ${props => props.$colorScheme.colors.accent}10;
  
  background: ${props => props.$colorScheme.colors.surface};
`;

// Modern action button
export const ModalActionButton = styled.button<{
  $colorScheme: any;
  $variant: 'primary' | 'secondary' | 'danger';
}>`
  flex: 1;

  min-height: 48px;
  padding: ${spacing.mobile.base} ${spacing.mobile.lg};

  background: ${props => {
    switch (props.$variant) {
      case 'primary': return `linear-gradient(135deg, ${props.$colorScheme.colors.primary}, ${props.$colorScheme.colors.accent})`;
      case 'danger': return '#EF4444';
      default: return 'transparent';
    }
  }};

  color: ${props => {
    switch (props.$variant) {
      case 'primary':
      case 'danger':
        return 'white';
      default:
        return props.$colorScheme.colors.text;
    }
  }};

  border: 1px solid ${props => {
    switch (props.$variant) {
      case 'primary': return props.$colorScheme.colors.accent;
      case 'danger': return '#EF4444';
      default: return `${props.$colorScheme.colors.accent}30`;
    }
  }};

  border-radius: 12px;

  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  transition: all 150ms ease-out;

    &:active {
    transform: scale(0.98);
  }
`;;