import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { FaUser, FaCopy, FaSignOutAlt, FaCoins } from "react-icons/fa";
import styled from 'styled-components';
import { truncateString } from "../../../../utils";
import { useNavigate } from "react-router-dom";
import {
  PLATFORM_REFERRAL_FEE,
  PLATFORM_ALLOW_REFERRER_REMOVAL,
} from '../../../../constants';
import { useReferral, useTokenBalance, useCurrentToken, GambaUi, TokenValue } from "gamba-react-ui-v2";
import { generateUsernameFromWallet, generateDegenStoryFromWallet } from '../../../../utils/user/userProfileUtils';
import { ReferralDashboard } from './ReferralDashboard';
import { ReferralLeaderboardModal, useReferralLeaderboardModal } from './ReferralLeaderboardModal';
import { useColorScheme } from '../../../../themes/ColorSchemeContext';
import { spacing, animations, media, typography, components } from '../breakpoints';

// Modern mobile-first styled components
const ProfileContainer = styled.div<{ $colorScheme: any }>`
  padding: ${spacing.base};
  background: ${props => props.$colorScheme.colors.background};
  min-height: 100vh;
  color: ${props => props.$colorScheme.colors.text};
`;

const ProfileHeader = styled.div<{ $colorScheme: any }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${spacing.lg} 0;
  background: linear-gradient(135deg, ${props => props.$colorScheme.colors.accent}20, ${props => props.$colorScheme.colors.surface}40);
  border-radius: ${components.button.borderRadius};
  margin-bottom: ${spacing.base};
  border: 1px solid ${props => props.$colorScheme.colors.accent}30;
`;

const AvatarContainer = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.2);
  margin-bottom: ${spacing.base};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Avatar = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DefaultAvatar = styled.div<{ $colorScheme: any }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$colorScheme.colors.text};
  font-size: 2rem;
`;

const Username = styled.h2<{ $colorScheme: any }>`
  margin: 0;
  font-size: ${typography.scale.xl};
  font-weight: ${typography.weight.bold};
  color: ${props => props.$colorScheme.colors.text};
  text-align: center;
`;

const WalletAddress = styled.p<{ $colorScheme: any }>`
  margin: ${spacing.xs} 0;
  font-size: ${typography.scale.sm};
  color: ${props => props.$colorScheme.colors.text}80;
  font-family: monospace;
`;

const InfoSection = styled.div<{ $colorScheme: any }>`
  background: ${props => props.$colorScheme.colors.surface}40;
  border: 1px solid ${props => props.$colorScheme.colors.accent}20;
  border-radius: ${components.button.borderRadius};
  padding: ${spacing.base};
  margin-bottom: ${spacing.base};
`;

const SectionTitle = styled.h3<{ $colorScheme: any }>`
  margin: 0 0 ${spacing.base} 0;
  font-size: ${typography.scale.lg};
  font-weight: ${typography.weight.semibold};
  color: ${props => props.$colorScheme.colors.text};
`;

const BalanceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${spacing.sm} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActionButton = styled.button<{ $colorScheme: any; $variant?: 'primary' | 'secondary' }>`
  background: ${props => props.$variant === 'primary' 
    ? `linear-gradient(135deg, ${props.$colorScheme.colors.accent}, ${props.$colorScheme.colors.accent}CC)`
    : `${props.$colorScheme.colors.surface}60`
  };
  border: 1px solid ${props => props.$colorScheme.colors.accent}40;
  color: ${props => props.$colorScheme.colors.text};
  padding: ${spacing.sm} ${spacing.base};
  border-radius: ${components.button.borderRadius};
  font-size: ${typography.scale.base};
  font-weight: ${typography.weight.medium};
  cursor: pointer;
  transition: all ${animations.duration.fast} ease;
  display: flex;
  align-items: center;
  gap: ${spacing.sm};
  min-height: ${spacing.touchTarget};
  flex: 1;
  justify-content: center;
  
  &:active {
    transform: scale(0.98);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${spacing.sm};
  margin-top: ${spacing.base};
`;

const ConnectedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.base};
`;

const ReferredText = styled.div<{ $colorScheme: any }>`
  color: ${props => props.$colorScheme.colors.text}80;
  font-size: ${typography.scale.sm};
  display: flex;
  align-items: center;
  gap: ${spacing.xs};
`;

const ReferredAddress = styled.span<{ $colorScheme?: any }>`
  color: ${props => props.$colorScheme?.colors?.primary || '#ffd700'};
  font-weight: 600;
  font-family: monospace;
  text-shadow: 0 0 4px ${props => props.$colorScheme?.colors?.primary || '#ffd700'}40;
`;

// Modern profile container with TikTok/Instagram styling
const ModernProfileContainer = styled.div<{ $colorScheme?: any }>`
  padding: ${spacing.lg};
  background: linear-gradient(135deg,
    rgba(24, 24, 24, 0.95),
    rgba(15, 15, 35, 0.98)
  );
  border-radius: 24px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  margin: ${spacing.base};

  ${media.maxMobile} {
    padding: ${spacing.base};
    border-radius: 16px;
    margin: ${spacing.xs};
  }

  /* Ambient glow effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at 30% 20%,
      rgba(255, 215, 0, 0.08) 0%,
      rgba(162, 89, 255, 0.05) 50%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }
`

export function UserProfile() {
  const wallet = useWallet();
  const navigate = useNavigate();
  const { currentColorScheme } = useColorScheme();
  const [username, setUsername] = useState("Guest");
  const [bio, setBio] = useState("");
  const [mounted, setMounted] = useState(false);
  const { balance, bonusBalance } = useTokenBalance();
  const currentToken = useCurrentToken();
  const referral = useReferral();
  const [removing, setRemoving] = useState(false);
  const leaderboardModal = useReferralLeaderboardModal();
  const disconnectWallet = () => wallet.disconnect();
  const publicKey = wallet.publicKey?.toBase58();
  const avatarUrl = publicKey
    ? `https://robohash.org/${publicKey}?size=100x100&set=set5`
    : null;

  useEffect(() => {
    if (!wallet.publicKey) {
      setUsername("Guest");
      setBio("");
      return;
    }
    const key = wallet.publicKey.toString();
    let storedUsername = localStorage.getItem(`username-${key}`);
    if (!storedUsername) {
      storedUsername = generateUsernameFromWallet(key);
      localStorage.setItem(`username-${key}`, storedUsername);
    }
    setUsername(storedUsername);
    setBio(generateDegenStoryFromWallet(key));
  }, [wallet.publicKey]);

  // Track if wallet auto-connect attempt has finished
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  useEffect(() => {
    // If wallet.connecting just transitioned to false, mark auto-connect as attempted
    if (!wallet.connecting) {
      setAutoConnectAttempted(true);
    }
  }, [wallet.connecting]);

  useEffect(() => {
    // Only redirect if wallet is not connected, not connecting, and auto-connect has been attempted
    if (autoConnectAttempted && !wallet.connected && !wallet.connecting) {
      navigate("/");
    }
  }, [autoConnectAttempted, wallet.connected, wallet.connecting, navigate]);

  const removeInvite = async () => {
    try {
      setRemoving(true);
      await referral.removeInvite();
    } finally {
      setRemoving(false);
    }
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
    }
  };

  return (
    <>
      <ProfileContainer $colorScheme={currentColorScheme}>
        {/* Profile Header */}
        <ProfileHeader $colorScheme={currentColorScheme}>
          <AvatarContainer>
            {avatarUrl ? (
              <Avatar src={avatarUrl} alt="Avatar" />
            ) : (
              <DefaultAvatar $colorScheme={currentColorScheme}>
                <FaUser />
              </DefaultAvatar>
            )}
          </AvatarContainer>
          
          <Username $colorScheme={currentColorScheme}>{username}</Username>
          
          {publicKey && (
            <WalletAddress $colorScheme={currentColorScheme}>
              {truncateString(publicKey, 8, 4)}
            </WalletAddress>
          )}
        </ProfileHeader>

        {/* Degen Folk Lore */}
        <InfoSection $colorScheme={currentColorScheme}>
          <SectionTitle $colorScheme={currentColorScheme}>📜 Degen Folk Lore</SectionTitle>
          <p style={{ 
            fontSize: typography.scale.base, 
            lineHeight: '1.6', 
            margin: 0,
            color: currentColorScheme.colors.text + '80',
            textAlign: 'center'
          }}>
            {bio}
          </p>
        </InfoSection>

        {/* Balance Info */}
        <InfoSection $colorScheme={currentColorScheme}>
          <SectionTitle $colorScheme={currentColorScheme}>💰 Balance</SectionTitle>
          <BalanceRow>
            <span>Token Balance:</span>
            <TokenValue amount={balance} />
          </BalanceRow>
          <BalanceRow>
            <span>Bonus Balance:</span>
            <TokenValue amount={bonusBalance} />
          </BalanceRow>
        </InfoSection>

        {/* Wallet Info */}
        <InfoSection $colorScheme={currentColorScheme}>
          <SectionTitle $colorScheme={currentColorScheme}>💼 Wallet Info</SectionTitle>
          <BalanceRow>
            <span>Adapter:</span>
            <span>{wallet.wallet?.adapter.name || "No wallet"}</span>
          </BalanceRow>
          <BalanceRow>
            <span>Address:</span>
            <span>{publicKey ? truncateString(publicKey, 6, 6) : "Not connected"}</span>
          </BalanceRow>
          
          <ButtonRow>
            {publicKey && (
              <ActionButton 
                $colorScheme={currentColorScheme}
                $variant="secondary"
                onClick={copyAddress}
              >
                <FaCopy /> Copy Address
              </ActionButton>
            )}
            
            {wallet.connected && (
              <ActionButton
                $colorScheme={currentColorScheme}
                $variant="secondary"
                onClick={disconnectWallet}
              >
                <FaSignOutAlt /> Disconnect
              </ActionButton>
            )}
          </ButtonRow>
          
          {publicKey && (
            <ButtonRow>
              <ActionButton 
                as="a"
                href={`https://solscan.io/account/${publicKey}`}
                target="_blank"
                rel="noopener noreferrer"
                $colorScheme={currentColorScheme}
                $variant="primary"
              >
                View on Solscan
              </ActionButton>
            </ButtonRow>
          )}
        </InfoSection>

        {/* Referral Connection */}
        <InfoSection $colorScheme={currentColorScheme}>
          <SectionTitle $colorScheme={currentColorScheme}>🔗 Referral Connection</SectionTitle>
          {referral.referrerAddress ? (
            <ConnectedWrapper>
              <ReferredText $colorScheme={currentColorScheme}>
                Referred by: {truncateString(referral.referrerAddress.toString(), 4, 4)}
              </ReferredText>
              {PLATFORM_ALLOW_REFERRER_REMOVAL && (
                <ActionButton
                  $colorScheme={currentColorScheme}
                  $variant="secondary"
                  onClick={removeInvite}
                  disabled={removing}
                >
                  {removing ? "Removing..." : "Remove Referrer"}
                </ActionButton>
              )}
            </ConnectedWrapper>
          ) : (
            <ReferredText $colorScheme={currentColorScheme}>
              No active referral connection
            </ReferredText>
          )}
        </InfoSection>

        {/* Referral Dashboard */}
        <InfoSection $colorScheme={currentColorScheme}>
          <SectionTitle $colorScheme={currentColorScheme}>📊 Referral Dashboard</SectionTitle>
          <ReferralDashboard />
          
          <ButtonRow>
            <ActionButton
              $colorScheme={currentColorScheme}
              $variant="primary"
              onClick={leaderboardModal.openModal}
            >
              <FaCoins /> View Leaderboard
            </ActionButton>
          </ButtonRow>
        </InfoSection>
      </ProfileContainer>
      
      {leaderboardModal.Modal}
    </>
  );
}

export default UserProfile;