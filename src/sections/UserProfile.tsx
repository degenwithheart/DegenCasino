import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { FaUser } from "react-icons/fa";
import { truncateString } from "../utils";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, css } from 'styled-components';
import {
  PLATFORM_REFERRAL_FEE,
  PLATFORM_ALLOW_REFERRER_REMOVAL,
} from '../constants';
import { useReferral, useTokenBalance, useCurrentToken, GambaUi } from "gamba-react-ui-v2";
import { generateUsernameFromWallet, generateDegenStoryFromWallet } from './userProfileUtils';
import { ReferralDashboard } from '../components/ReferralDashboard';
import { ReferralLeaderboardModal, useReferralLeaderboardModal } from '../components/ReferralLeaderboardModal';

// Casino animations
const neonPulse = keyframes`
  0% { 
    box-shadow: 0 0 24px #a259ff88, 0 0 48px #ffd70044;
    border-color: #ffd70044;
  }
  100% { 
    box-shadow: 0 0 48px #ffd700cc, 0 0 96px #a259ff88;
    border-color: #ffd700aa;
  }
`;

const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.8); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

interface ProfileContainerProps {
  $compact?: boolean;
}

const ProfileContainer = styled.div<ProfileContainerProps>`
  max-width: none; /* Let main handle max-width */
  padding: ${({ $compact }) => ($compact ? '2rem' : '3rem')};
  margin: 2rem 0; /* Only vertical margins */
  background: #0f0f23;
  border-radius: 12px;
  border: 1px solid #2a2a4a;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ffd700;
    box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
    transform: translateY(-2px);
  }

  @media (max-width: 900px) {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
  
  @media (max-width: 700px) {
    padding: 1.5rem 1rem;
    margin: 0.5rem;
  }
  
  @media (max-width: 400px) {
    padding: 1rem 0.75rem;
    margin: 0.25rem;
    border-radius: 8px;
  }
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  
  h1 {
    font-family: 'Luckiest Guy', cursive;
    font-size: 3rem;
    color: #ffd700;
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    margin-bottom: 3rem;
    h1 {
      font-size: 2rem;
    }
  }

  @media (max-width: 480px) {
    margin-bottom: 2rem;
    h1 {
      font-size: 1.5rem;
    }
  }
`;

const SectionBox = styled.div<{ visible: boolean; isHovered?: boolean }>`
  max-width: 100%;
  margin: 2rem auto;
  padding: 2rem;
  border-radius: 12px;
  background: #0f0f23;
  border: 1px solid #2a2a4a;
  color: white;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) => (visible ? 'translateY(0)' : 'translateY(20px)')};
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: #ffd700;
    box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
    transform: translateY(-2px);
  }

  & + & {
    margin-top: 2.5rem;
  }

  label {
    display: block;
    margin-bottom: 1rem;
    font-weight: bold;
    color: #ffd700;
    font-family: 'Luckiest Guy', cursive;
    font-size: 1.1rem;
  }

  p {
    color: #999;
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  @media (max-width: 600px) {
    padding: 1.5rem 1rem;
    margin: 1.5rem auto;
    
    & + & {
      margin-top: 2rem;
    }
  }
`;

const CasinoButton = styled.button<{ variant?: 'primary' | 'danger' }>`
  background: ${props => 
    props.variant === 'danger' 
      ? '#ff4444' 
      : '#ffd700'
  };
  color: ${props => props.variant === 'danger' ? 'white' : '#1a1a1a'};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: 'Luckiest Guy', cursive;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px ${props => 
      props.variant === 'danger' 
        ? 'rgba(255, 68, 68, 0.3)' 
        : 'rgba(255, 215, 0, 0.3)'
    };
  }

  @media (max-width: 600px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }
`;

const AvatarContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 2px solid #2a2a4a;
  background-color: #0f0f23;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ffd700;
    box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
  }

  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
  }
`;

const DefaultAvatar = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #0f0f23;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #2a2a4a;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ffd700;
    box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
  }

  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
  }
`;

export function Profile() {
  const wallet = useWallet();
  const navigate = useNavigate();
  const [username, setUsername] = useState("Guest");
  const [bio, setBio] = useState("");
  const [mounted, setMounted] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const { balance, bonusBalance } = useTokenBalance();
  const currentToken = useCurrentToken();
  const referral = useReferral();
  const [removing, setRemoving] = useState(false);
  const leaderboardModal = useReferralLeaderboardModal();
  const disconnectWallet = () => wallet.disconnect();
  const publicKey = wallet.publicKey?.toBase58();
  const avatarUrl = publicKey
    ? `https://robohash.org/${publicKey}?size=90x90&set=set5`
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

  const getSectionStyle = (index: number) => ({
    ...sectionBoxStyleBase,
    ...(mounted ? sectionBoxStyleVisible : {}),
    ...(hoverIndex === index ? hoverStyle : {}),
  });

  const removeInvite = async () => {
    try {
      setRemoving(true);
      await referral.removeInvite();
    } finally {
      setRemoving(false);
    }
  };

  return (
    <>
      <ProfileContainer>
      <ProfileHeader>
        <h1>👤 User Profile 🎰</h1>
      </ProfileHeader>
      
      {/* Banner container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 1500,
          height: 300,
          margin: "0 auto 3rem auto",
          borderRadius: 12,
          overflow: "hidden",
          border: "1px solid #2a2a4a",
          background: "#0f0f23",
        }}
      >
          {/* Banner image */}
          <img
            src="/casino.png"
            alt="Banner"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "fill",
              display: "block",
              userSelect: "none",
              pointerEvents: "none",
            }}
          />

          {avatarUrl ? (
            <AvatarContainer>
              <img
                src={avatarUrl}
                alt="User Avatar"
              />
            </AvatarContainer>
          ) : (
            <DefaultAvatar>
              <FaUser size={40} color="#ccc" />
            </DefaultAvatar>
          )}

          {/* Username overlay */}
          <div
            style={{
              position: "absolute",
              background: "rgba(255, 255, 255, 0.15)",
              padding: "1.5rem",
              borderRadius: "12px 12px 0 0",
              width: "100%",
              bottom: 0,
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              transition: "0.4s",
              opacity: 1,
              transform: "translateY(0)",
              color: "#fff",
              fontSize: 24,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <span>{username}</span>
          </div>
        </div>
        
        {/* Degen Folk Lore Section */}
        <SectionBox visible={mounted}>
          <label htmlFor="folklore">Degen Folk Lore</label>
          <div style={{
            color: '#fff',
            fontFamily: 'inherit',
            fontSize: 15,
            lineHeight: 1.5,
            whiteSpace: 'pre-line',
            wordBreak: 'break-word',
          }}>
            {bio}
          </div>
        </SectionBox>
        
        {/* Wallet Info */}
        <SectionBox visible={mounted}>
          <label htmlFor="balance">Wallet Info</label>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {/* Left side: Wallet info */}
            <div>
              <p style={{ margin: 0, fontWeight: 'bold', color: '#fff' }}>
                {wallet.publicKey?.toString()}
              </p>
              <p style={{ margin: 0, color: '#ccc', fontSize: 14 }}>
                Connected with {wallet.wallet?.adapter.name}
              </p>
            </div>

            {/* Right side: Buttons */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <a
                href={`https://solscan.io/account/${wallet.publicKey?.toString()}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px 16px',
                  border: '2px solid rgba(255, 215, 0, 0.3)',
                  borderRadius: 8,
                  textDecoration: 'none',
                  color: '#ffd700',
                  fontSize: 14,
                  transition: 'all 0.3s ease',
                  background: 'rgba(255, 215, 0, 0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.2)';
                  e.currentTarget.style.borderColor = '#ffd700';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 215, 0, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                🔍 View on Solscan
              </a>
              <GambaUi.Button onClick={disconnectWallet} aria-label="Disconnect wallet">
                🔌 Disconnect Wallet
              </GambaUi.Button>
            </div>
          </div>
        </SectionBox>
        
        {/* Enhanced Referral Dashboard */}
        <SectionBox visible={mounted}>
          <ReferralDashboard />
        </SectionBox>

        {/* Referral Connection Status */}
        <SectionBox visible={mounted}>
          <label>🔗 Referral Connection</label>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {/* Left: Referral info text */}
            <div style={{ flex: '1 1 auto', minWidth: '200px', color: '#ccc', fontSize: 14 }}>
              {referral.referrerAddress ? (
                !removing ? (
                  <>
                    You were invited by{' '}
                    <a
                      target="_blank"
                      href={`https://solscan.io/account/${referral.referrerAddress.toString()}`}
                      rel="noreferrer"
                      style={{ color: '#ffd700', textDecoration: 'underline' }}
                    >
                      {truncateString(referral.referrerAddress.toString(), 6, 6)}
                    </a>
                    <> ({generateUsernameFromWallet(referral.referrerAddress.toBase58())})</>.
                  </>
                ) : (
                  <>Removing invite...</>
                )
              ) : (
                <span>No referral connection yet.</span>
              )}
            </div>

            {/* Right: Action buttons */}
            <div style={{ flex: '0 0 auto', display: 'flex', gap: '8px' }}>
              <GambaUi.Button onClick={leaderboardModal.openModal}>
                🏆 Leaderboard
              </GambaUi.Button>
              
              {PLATFORM_ALLOW_REFERRER_REMOVAL && referral.referrerAddress && (
                <GambaUi.Button disabled={removing} onClick={removeInvite}>
                  Remove invite
                </GambaUi.Button>
              )}
            </div>
          </div>
        </SectionBox>
        
        {/* Token and Bonus Balance */}
        <SectionBox visible={mounted}>
          <label htmlFor="balance">💰 Token and Bonus Balance</label>
          <p>
            <b>Token Balance:</b> {(balance / Math.pow(10, currentToken?.decimals ?? 0)).toFixed(2)}
            {currentToken?.name ? ` ${currentToken.name}` : ""}
          </p>
          <p><b>Bonus Balance:</b> {(bonusBalance / Math.pow(10, currentToken?.decimals ?? 0)).toFixed(2)}</p>
        </SectionBox>
      </ProfileContainer>
      {leaderboardModal.Modal}
    </>
  );
}

export default Profile;



// Main container background style
const containerStyle = {
  maxWidth: "100%",
  margin: "auto",
  padding: "2rem 2.5rem",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(14px)",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.4)",
  color: "white",
  opacity: 1,
  transform: "translateY(0)",
  transition: "opacity 1s ease, transform 1s ease",
};

// Section card style
const sectionBoxStyleBase = {
  background: "rgba(255,255,255,0.15)",
  padding: "1.5rem",
  borderRadius: "12px",
  marginBottom: "1.5rem",
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  transition: "all 0.4s ease",
  opacity: 0,
  transform: "translateY(20px)",
};

const sectionBoxStyleVisible = {
  opacity: 1,
  transform: "translateY(0)",
};

const hoverStyle = {
  boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
};
