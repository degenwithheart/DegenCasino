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
  padding: ${({ $compact }) => ($compact ? '1rem' : '2rem')};
  margin: 2rem 0; /* Only vertical margins */
  background: rgba(24, 24, 24, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 2px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.5);
  position: relative;

  @media (max-width: 900px) {
    padding: 1.5rem 1rem;
    margin: 1rem;
    border-radius: 16px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.3);
  }
  
  @media (max-width: 700px) {
    padding: 1rem 0.75rem;
    margin: 0.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.18);
  }
  
  @media (max-width: 400px) {
    padding: 0.75rem 0.5rem;
    margin: 0.25rem;
    border-radius: 8px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(162, 89, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
    border-radius: 24px;
    @media (max-width: 600px) {
      border-radius: 12px;
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    background-size: 300% 100%;
    animation: ${moveGradient} 4s linear infinite;
    border-radius: 24px 24px 0 0;
    z-index: 1;
    @media (max-width: 600px) {
      border-radius: 12px 12px 0 0;
    }
  }
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-family: 'Luckiest Guy', cursive;
    font-size: 3rem;
    color: #ffd700;
    text-shadow: 
      0 0 10px #ffd700,
      0 0 20px #ffd700,
      0 0 30px #ffd700,
      2px 2px 4px rgba(0, 0, 0, 0.8);
    margin-bottom: 1rem;
    position: relative;

    &::before {
      content: '👤';
      position: absolute;
      left: -3rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 2rem;
      animation: ${float} 3s ease-in-out infinite;
    }

    &::after {
      content: '🎰';
      position: absolute;
      right: -3rem;
      top: 50%;
      transform: translateY(-50%);
      font-size: 2rem;
      animation: ${float} 3s ease-in-out infinite 1.5s;
    }
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.1rem;
      &::before,
      &::after {
        display: none;
      }
    }
  }
  @media (max-width: 600px) {
    h1 {
      font-size: 1.5rem;
    }
  }
`;

const SectionBox = styled.div<{ visible: boolean; isHovered?: boolean }>`
  max-width: 100%;
  margin: auto;
  padding: 1.5rem;
  border-radius: 24px;
  background: rgba(24, 24, 24, 0.8);
  backdrop-filter: blur(20px);
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(255, 215, 0, 0.2);
  color: white;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) => (visible ? 'translateY(0)' : 'translateY(20px)')};
  transition: opacity 1s ease, transform 1s ease;
  position: relative;

  @media (max-width: 600px) {
    padding: 0.8rem 0.3rem;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(162, 89, 255, 0.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: -1;
    border-radius: 24px;
    @media (max-width: 600px) {
      border-radius: 10px;
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc, #ffd700);
    background-size: 300% 100%;
    animation: ${moveGradient} 4s linear infinite;
    border-radius: 24px 24px 0 0;
    z-index: 1;
    @media (max-width: 600px) {
      border-radius: 10px 10px 0 0;
    }
  }

  &:hover {
    box-shadow: 0 12px 40px rgba(255, 215, 0, 0.3);
    border-color: rgba(255, 215, 0, 0.4);
    transform: translateY(-5px);
  }

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: bold;
    color: #ffd700;
    text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
    font-family: 'Luckiest Guy', cursive;
    font-size: 1.1rem;
    @media (max-width: 600px) {
      font-size: 1rem;
    }
  }

  p {
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 0.5rem;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
    @media (max-width: 600px) {
      font-size: 0.95rem;
    }
  }

  b {
    color: #ffd700;
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }
`;

const CasinoButton = styled.button<{ variant?: 'primary' | 'danger' }>`
  background: ${props => 
    props.variant === 'danger' 
      ? 'linear-gradient(135deg, #ff4444, #cc0000)' 
      : 'linear-gradient(135deg, #ffd700, #ffed4e)'
  };
  color: ${props => props.variant === 'danger' ? 'white' : '#1a1a1a'};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-family: 'Luckiest Guy', cursive;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  font-weight: bold;
  margin: 0.25rem;

  @media (max-width: 600px) {
    font-size: 0.95rem;
    padding: 0.6rem 1rem;
    border-radius: 8px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
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
  border: 4px solid #ffd700;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.6), 0 8px 16px rgba(0,0,0,0.5);
  background-color: white;
  overflow: hidden;
  animation: ${neonPulse} 3s ease-in-out infinite alternate;

  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
    border-width: 2px;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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
  background-color: rgba(255, 215, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.6), 0 8px 16px rgba(0,0,0,0.5);
  border: 4px solid #ffd700;
  animation: ${neonPulse} 3s ease-in-out infinite alternate;

  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
    border-width: 2px;
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
    <ProfileContainer>
      <ProfileHeader>
        <h1>User Profile</h1>
      </ProfileHeader>
      
      {/* Banner container */}
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 1500,
          height: 300,
          margin: "auto auto 24px",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(255, 215, 0, 0.3)",
          border: "2px solid rgba(255, 215, 0, 0.3)",
          background: "linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(162, 89, 255, 0.1))",
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
        
        {/* Referral Section */}
        <SectionBox visible={mounted}>
          <label>🎁 Referral</label>
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
                <span>No referral yet.</span>
              )}
            </div>

            {/* Right: Remove invite button */}
            {PLATFORM_ALLOW_REFERRER_REMOVAL && referral.referrerAddress && (
              <div style={{ flex: '0 0 auto' }}>
                <GambaUi.Button disabled={removing} onClick={removeInvite}>
                  Remove invite
                </GambaUi.Button>
              </div>
            )}
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
