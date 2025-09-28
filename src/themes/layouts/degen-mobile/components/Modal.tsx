import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { FaTimes } from 'react-icons/fa'
import { useColorScheme } from '../../../ColorSchemeContext'
import {
  ModalBackdrop,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalActionButton
} from './Modal.styles'

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: string;
  showCloseButton?: boolean;
  actions?: Array<{
    label: string;
    variant: 'primary' | 'secondary' | 'danger';
    onClick: () => void;
    disabled?: boolean;
  }>;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxHeight,
  showCloseButton = true,
  actions
}) => {
  const { currentColorScheme } = useColorScheme()
  
  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])
  
  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }
  
  // Prevent modal content click from closing modal
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }
  
  if (!isOpen) return null
  
  const modalContent = (
    <ModalBackdrop 
      $isOpen={isOpen} 
      $colorScheme={currentColorScheme}
      onClick={handleBackdropClick}
    >
      <ModalContainer 
        $isOpen={isOpen} 
        $colorScheme={currentColorScheme}
        $maxHeight={maxHeight}
        onClick={handleContentClick}
      >
        {(title || showCloseButton) && (
          <ModalHeader $colorScheme={currentColorScheme}>
            {title && (
              <ModalTitle $colorScheme={currentColorScheme}>
                {title}
              </ModalTitle>
            )}
            
            {showCloseButton && (
              <ModalCloseButton 
                $colorScheme={currentColorScheme}
                onClick={onClose}
                aria-label="Close modal"
              >
                <FaTimes />
              </ModalCloseButton>
            )}
          </ModalHeader>
        )}
        
        <ModalContent>
          {children}
        </ModalContent>
        
        {actions && actions.length > 0 && (
          <ModalFooter $colorScheme={currentColorScheme}>
            {actions.map((action, index) => (
              <ModalActionButton
                key={index}
                $colorScheme={currentColorScheme}
                $variant={action.variant}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.label}
              </ModalActionButton>
            ))}
          </ModalFooter>
        )}
      </ModalContainer>
    </ModalBackdrop>
  )
  
  // Render modal in portal to ensure proper z-index stacking
  return ReactDOM.createPortal(
    modalContent,
    document.body
  )
}