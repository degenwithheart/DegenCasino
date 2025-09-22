import React, { useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { FaUser } from "react-icons/fa";
import { truncateString } from "../../utils";
import { useNavigate } from "react-router-dom";
import {
  PLATFORM_REFERRAL_FEE,
  PLATFORM_ALLOW_REFERRER_REMOVAL,
} from '../../constants';
import { useReferral, useTokenBalance, useCurrentToken, GambaUi } from "gamba-react-ui-v2";
import { generateUsernameFromWallet, generateDegenStoryFromWallet } from '../../utils/user/userProfileUtils';
import { ReferralDashboard } from '../../components';
import { ReferralLeaderboardModal, useReferralLeaderboardModal } from '../../components';
import { useColorScheme } from '../../themes/ColorSchemeContext';
import { 
  UnifiedPageContainer, 
  UnifiedPageTitle, 
  UnifiedSection
} from '../../components/UI/UnifiedDesign';
import { AvatarContainer, DefaultAvatar } from './UserProfile.styles';

export function Profile() {
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
      <UnifiedPageContainer>
        <UnifiedPageTitle>👤 User Profile 🎰</UnifiedPageTitle>

        {/* Enhanced Banner Section with Avatar */}
        <UnifiedSection>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: 300,
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid #2a2a4a",
              background: "#0f0f23",
              marginBottom: "2rem",
            }}
          >
            {/* Banner image */}
            <img
              src="/webp/images/casino.webp"
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
        </UnifiedSection>

        {/* Degen Folk Lore Section */}
        <UnifiedSection title="📜 Degen Folk Lore">
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
        </UnifiedSection>

        {/* Wallet Info */}
        <UnifiedSection title="💼 Wallet Info">
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
        </UnifiedSection>

        {/* Enhanced Referral Dashboard */}
        <UnifiedSection title="📊 Referral Dashboard">
          <ReferralDashboard />
        </UnifiedSection>

        {/* Referral Connection Status */}
        <UnifiedSection title="🔗 Referral Connection">
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
                      rel="noopener noreferrer"
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
        </UnifiedSection>

        {/* Token and Bonus Balance */}
        <UnifiedSection title="💰 Token and Bonus Balance">
          <p>
            <b>Token Balance:</b> {(balance / Math.pow(10, currentToken?.decimals ?? 0)).toFixed(2)}
            {currentToken?.name ? ` ${currentToken.name}` : ""}
          </p>
          <p><b>Bonus Balance:</b> {(bonusBalance / Math.pow(10, currentToken?.decimals ?? 0)).toFixed(2)}</p>
        </UnifiedSection>
      </UnifiedPageContainer>
      {leaderboardModal.Modal}
    </>
  );
}

export default Profile;
