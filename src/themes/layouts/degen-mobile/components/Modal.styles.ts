import styled, { keyframes } from 'styled-components'
import { spacing, components, animations, media } from '../breakpoints'

// Premium modal animations with spring physics
export const slideUp = keyframes`
  from {
    transform: translateY(100%) scale(0.9);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`

export const slideDown = keyframes`
  from {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateY(100%) scale(0.9);
    opacity: 0;
  }
`

export const fadeIn = keyframes`
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(12px);
  }
`

export const fadeOut = keyframes`
  from {
    opacity: 1;
    backdrop-filter: blur(12px);
  }
  to {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
`

export const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

// Premium modal backdrop with enhanced glass effect
export const ModalBackdrop = styled.div<{ $isOpen: boolean; $colorScheme: any }>`
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
  align-items: flex-end;
  justify-content: center;
  
  animation: ${props => props.$isOpen ? fadeIn : fadeOut} 
    ${animations.duration.normal} ${animations.easing.easeOut} forwards;
  
  animation: ${props => props.$isOpen ? fadeIn : fadeOut} 
    ${animations.duration.normal} ${animations.easing.easeOut};
  
  /* Touch to close */
  cursor: pointer;
  
  /* Safe area support */
  ${media.safeArea} {
    padding-bottom: ${spacing.safeArea.bottom};
  }
`

// Mobile-first modal container (slides up from bottom)
export const ModalContainer = styled.div<{ $isOpen: boolean; $colorScheme: any; $maxHeight?: string }>`
  width: 100%;
  max-width: 100vw;
  max-height: ${props => props.$maxHeight || '90vh'};
  
  background: linear-gradient(180deg,
    ${props => props.$colorScheme.colors.surface},
    ${props => props.$colorScheme.colors.background}F8
  );
  
  border: 1px solid ${props => props.$colorScheme.colors.accent}30;
  border-radius: ${components.modal.borderRadius};
  
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.3);
  
  animation: ${props => props.$isOpen ? slideUp : slideDown} 
    ${animations.duration.normal} ${animations.easing.easeOut};
  
  /* Prevent backdrop click propagation */
  cursor: default;
  
  /* Mobile scrolling optimization */
  overflow: hidden;
  
  ${media.tablet} {
    max-width: 500px;
    border-radius: 16px;
    align-self: center;
  }
`

// Modal header
export const ModalHeader = styled.div<{ $colorScheme: any }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  padding: ${spacing.base} ${spacing.lg};
  border-bottom: 1px solid ${props => props.$colorScheme.colors.accent}20;
  
  background: ${props => props.$colorScheme.colors.surface}80;
  backdrop-filter: blur(10px);
  
  /* Sticky header for long content */
  position: sticky;
  top: 0;
  z-index: 10;
`

// Modal title
export const ModalTitle = styled.h2<{ $colorScheme: any }>`
  margin: 0;
  
  color: ${props => props.$colorScheme.colors.text};
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.2;
`

// Modal close button
export const ModalCloseButton = styled.button<{ $colorScheme: any }>`
  display: flex;
  align-items: center;
  justify-content: center;
  
  width: ${spacing.touchTarget};
  height: ${spacing.touchTarget};
  
  background: transparent;
  color: ${props => props.$colorScheme.colors.text};
  
  border: 1px solid ${props => props.$colorScheme.colors.accent}30;
  border-radius: 12px;
  
  font-size: 1rem;
  cursor: pointer;
  
  transition: all ${animations.duration.fast} ${animations.easing.easeOut};
  
  &:active {
    transform: scale(0.95);
    background: ${props => props.$colorScheme.colors.accent}20;
  }
  
  ${media.mouse} {
    &:hover {
      background: ${props => props.$colorScheme.colors.accent}10;
    }
  }
`

// Modal content area
export const ModalContent = styled.div`
  padding: ${spacing.lg};
  overflow-y: auto;
  overflow-x: hidden;
  
  /* Mobile scrolling optimization */
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  
  /* Maximum height calculation */
  max-height: calc(90vh - 80px); /* Account for header */
  
  ${media.tablet} {
    max-height: calc(80vh - 80px);
  }
`

// Modal footer (for actions)
export const ModalFooter = styled.div<{ $colorScheme: any }>`
  display: flex;
  gap: ${spacing.base};
  
  padding: ${spacing.base} ${spacing.lg};
  border-top: 1px solid ${props => props.$colorScheme.colors.accent}20;
  
  background: ${props => props.$colorScheme.colors.surface}80;
  backdrop-filter: blur(10px);
  
  /* Sticky footer */
  position: sticky;
  bottom: 0;
  z-index: 10;
`

// Action button styles
export const ModalActionButton = styled.button<{ 
  $colorScheme: any; 
  $variant: 'primary' | 'secondary' | 'danger' 
}>`
  flex: 1;
  
  min-height: ${spacing.touchTarget};
  padding: ${spacing.base} ${spacing.lg};
  
  background: ${props => {
    switch (props.$variant) {
      case 'primary': return props.$colorScheme.colors.accent;
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
      default: return `${props.$colorScheme.colors.accent}40`;
    }
  }};
  
  border-radius: 12px;
  
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  
  transition: all ${animations.duration.fast} ${animations.easing.easeOut};
  
  &:active {
    transform: scale(0.98);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  ${media.mouse} {
    &:hover:not(:disabled) {
      opacity: 0.9;
    }
  }
`