import React from 'react';
import styled from 'styled-components';
import { useColorScheme } from '../../../ColorSchemeContext';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaTimes } from 'react-icons/fa';
import { spacing, components, typography, media } from '../breakpoints';
import {
    ModalOverlay,
    ModalContainer,
    Header,
    Title,
    CloseButton as ModalCloseButton,
    Content
} from './ModalComponents';

const GameInfoContainer = styled.div<{ $colorScheme: any; }>`
  display: flex;
  flex-direction: column;
  gap: ${spacing.mobile.lg};
`;

const GameHeader = styled.div<{ $colorScheme: any; }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.mobile.base};
  text-align: center;
`;

const GameImage = styled.img<{ $colorScheme: any; }>`
  width: 120px;
  height: 120px;
  border-radius: 16px;
  object-fit: cover;
  border: 2px solid ${props => props.$colorScheme.colors.accent}30;
`;

const GameTitle = styled.h2<{ $colorScheme: any; }>`
  color: ${props => props.$colorScheme.colors.text};
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
`;

const GameDescription = styled.p<{ $colorScheme: any; }>`
  color: ${props => props.$colorScheme.colors.text}80;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  text-align: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${spacing.mobile.base};
  width: 100%;
`;

const PlayButton = styled.button<{ $colorScheme: any; }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.mobile.sm};

  padding: ${spacing.mobile.lg};
  background: linear-gradient(135deg,
    ${props => props.$colorScheme.colors.primary} 0%,
    ${props => props.$colorScheme.colors.accent} 100%
  );
  color: white;
  border: none;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);

  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  transition: all 220ms ease;

  &:active {
    transform: scale(0.95);
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow:
      0 12px 32px ${props => props.$colorScheme.colors.primary}50,
      0 0 0 1px rgba(255, 255, 255, 0.2);
  }

  /* Shimmer effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
      transition: left 420ms ease-out;
  }

  &:hover::before {
    left: 100%;
  }

  ${media.maxMobile} {
    padding: ${spacing.mobile.base};
    font-size: 0.9rem;
    border-radius: 14px;
  }
`;

const CloseButton = styled.button<{ $colorScheme: any; }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.mobile.sm};

  padding: ${spacing.mobile.base};
  background: ${props => props.$colorScheme.colors.surface}80;
  color: ${props => props.$colorScheme.colors.text};
  border: 1px solid ${props => props.$colorScheme.colors.accent}30;
  border-radius: 12px;

  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  transition: all 220ms ease;

  &:active {
    transform: scale(0.95);
  }

  &:hover {
    background: ${props => props.$colorScheme.colors.accent}20;
  }
`;

interface GameInfoModalProps {
    game: any;
    isOpen: boolean;
    onClose: () => void;
    onPlay: (game: any) => void;
}

const GameInfoModal: React.FC<GameInfoModalProps> = ({
    game,
    isOpen,
    onClose,
    onPlay
}) => {
    const { currentColorScheme } = useColorScheme();
    const navigate = useNavigate();

    if (!game || !isOpen) return null;

    const handlePlay = () => {
        onPlay(game);
        onClose();
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <>
            <ModalOverlay onClick={handleClose}>
                <ModalContainer
                    $variant="gameinfo"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                    <Header $variant="gameinfo">
                        <Title $variant="gameinfo" $icon="🎮">
                            Game Info
                        </Title>
                        <ModalCloseButton $variant="gameinfo" onClick={handleClose} />
                    </Header>

                    <Content>
                        <GameInfoContainer $colorScheme={currentColorScheme}>
                            <GameHeader $colorScheme={currentColorScheme}>
                                <GameImage
                                    src={game?.meta?.image || '/placeholder-game.png'}
                                    alt={game?.meta?.name || 'Game'}
                                    $colorScheme={currentColorScheme}
                                />
                                <GameTitle $colorScheme={currentColorScheme}>
                                    {game?.meta?.name || 'Unknown Game'}
                                </GameTitle>
                                <GameDescription $colorScheme={currentColorScheme}>
                                    {game?.meta?.description || 'Experience the thrill of this exciting casino game!'}
                                </GameDescription>
                            </GameHeader>

                            <ActionButtons>
                                <PlayButton
                                    $colorScheme={currentColorScheme}
                                    onClick={handlePlay}
                                >
                                    <FaPlay />
                                    Play Now
                                </PlayButton>

                                <CloseButton
                                    $colorScheme={currentColorScheme}
                                    onClick={handleClose}
                                >
                                    <FaTimes />
                                    Close
                                </CloseButton>
                            </ActionButtons>
                        </GameInfoContainer>
                    </Content>
                </ModalContainer>
            </ModalOverlay>
        </>
    );
};

export default GameInfoModal;
