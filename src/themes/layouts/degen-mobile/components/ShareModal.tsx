import React from 'react'
import styled from 'styled-components'
import { FaShare, FaTwitter, FaCopy } from 'react-icons/fa'
import { useColorScheme } from '../../../../themes/ColorSchemeContext'
import { Modal } from './Modal'
import { spacing, typography, components } from '../breakpoints'

const ShareContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.base};
`

const ShareText = styled.p<{ $colorScheme: any }>`
  color: ${props => props.$colorScheme.colors.text};
  font-size: ${typography.scale.base};
  margin: 0;
  text-align: center;
`

const ShareActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
`

const ShareButton = styled.button<{ $colorScheme: any; $variant: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  
  min-height: ${spacing.touchTarget};
  padding: ${spacing.base};
  
  background: ${props => {
    switch (props.$variant) {
      case 'twitter': return '#1DA1F2';
      case 'copy': return props.$colorScheme.colors.accent;
      default: return props.$colorScheme.colors.surface;
    }
  }};
  
  color: ${props => props.$variant === 'copy' || props.$variant === 'twitter' 
    ? 'white' 
    : props.$colorScheme.colors.text
  };
  
  border: 1px solid ${props => props.$colorScheme.colors.accent}40;
  border-radius: ${components.button.borderRadius};
  
  font-size: ${typography.scale.base};
  font-weight: ${typography.weight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.98);
  }
`

interface ShareModalProps {
  game: {
    id: string;
    meta: {
      name: string;
    };
  };
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ game, onClose }) => {
  const { currentColorScheme } = useColorScheme()
  
  const shareText = `🎰 Just played ${game.meta.name} on DegenHeart Casino! Check it out: ${window.location.origin}/${game.id}`
  
  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(twitterUrl, '_blank')
  }
  
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/${game.id}`)
      // Could add toast notification here
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }
  
  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={`Share ${game.meta.name}`}
    >
      <ShareContent>
        <ShareText $colorScheme={currentColorScheme}>
          Share this game with your friends!
        </ShareText>
        
        <ShareActions>
          <ShareButton 
            $colorScheme={currentColorScheme}
            $variant="twitter"
            onClick={handleTwitterShare}
          >
            <FaTwitter /> Share on Twitter
          </ShareButton>
          
          <ShareButton 
            $colorScheme={currentColorScheme}
            $variant="copy"
            onClick={handleCopyLink}
          >
            <FaCopy /> Copy Link
          </ShareButton>
        </ShareActions>
      </ShareContent>
    </Modal>
  )
}