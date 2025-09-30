import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaDownload, FaTimes, FaMobile } from 'react-icons/fa';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    if (isStandalone || isIOSStandalone) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show banner after a delay (don't be annoying)
      setTimeout(() => {
        const lastPrompt = localStorage.getItem('pwa-install-prompt');
        const now = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        
        if (!lastPrompt || now - parseInt(lastPrompt) > oneWeek) {
          setShowBanner(true);
        }
      }, 3000);
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show install prompt
    await deferredPrompt.prompt();
    
    // Wait for user choice
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('PWA install accepted');
    } else {
      console.log('PWA install dismissed');
      // Remember they dismissed it
      localStorage.setItem('pwa-install-prompt', Date.now().toString());
    }
    
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-install-prompt', Date.now().toString());
  };

  if (isInstalled || !showBanner || !deferredPrompt) {
    return null;
  }

  return (
    <BannerContainer>
      <BannerContent>
        <IconContainer>
          <FaMobile size={24} />
        </IconContainer>
        <TextContainer>
          <BannerTitle>Install DegenHeart Casino</BannerTitle>
          <BannerText>Add the casino to your home screen for quick access and app-like experience</BannerText>
        </TextContainer>
        <ButtonContainer>
          <InstallButton onClick={handleInstallClick}>
            <FaDownload size={14} />
            Install
          </InstallButton>
          <DismissButton onClick={handleDismiss}>
            <FaTimes size={14} />
          </DismissButton>
        </ButtonContainer>
      </BannerContent>
    </BannerContainer>
  );
};

const BannerContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  z-index: 1000;
  animation: slideUp 0.3s ease-out;
  
  @media (max-width: 768px) {
    left: 10px;
    right: 10px;
    bottom: 90px; // Above mobile navigation
  }
  
  @keyframes slideUp {
    from {
      transform: translateY(100%);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const BannerContent = styled.div`
  background: linear-gradient(135deg, rgba(212, 165, 116, 0.95) 0%, rgba(184, 149, 107, 0.95) 100%);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(212, 165, 116, 0.3);
  color: #0a0511;
  
  @media (max-width: 480px) {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
`;

const IconContainer = styled.div`
  flex-shrink: 0;
  padding: 8px;
  background: rgba(10, 5, 17, 0.1);
  border-radius: 8px;
`;

const TextContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const BannerTitle = styled.div`
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 2px;
`;

const BannerText = styled.div`
  font-size: 12px;
  opacity: 0.8;
  line-height: 1.3;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const InstallButton = styled.button`
  background: #0a0511;
  color: #d4a574;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(10, 5, 17, 0.8);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const DismissButton = styled.button`
  background: transparent;
  color: #0a0511;
  border: 1px solid rgba(10, 5, 17, 0.3);
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(10, 5, 17, 0.1);
  }
`;

export default PWAInstallBanner;