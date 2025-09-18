// Holy Grail AdminPage.tsx - The Royal Court of Administration
// Medieval admin interface with noble command controls

import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { useColorScheme } from '../../../themes/ColorSchemeContext'

// Royal administration animations
const crownGlow = keyframes`
  0%, 100% {
    text-shadow: 
      0 0 15px rgba(212, 175, 55, 0.6),
      0 0 30px rgba(255, 215, 0, 0.4),
      0 0 45px rgba(212, 175, 55, 0.3);
  }
  50% {
    text-shadow: 
      0 0 25px rgba(212, 175, 55, 0.8),
      0 0 50px rgba(255, 215, 0, 0.6),
      0 0 75px rgba(212, 175, 55, 0.5);
  }
`

const scepterFloat = keyframes`
  0%, 100% {
    transform: translateY(0) rotateZ(0deg);
  }
  33% {
    transform: translateY(-6px) rotateZ(2deg);
  }
  66% {
    transform: translateY(-3px) rotateZ(-1deg);
  }
`

const royalPulse = keyframes`
  0%, 100% {
    background: 
      linear-gradient(135deg, 
        rgba(212, 175, 55, 0.1) 0%, 
        rgba(139, 69, 19, 0.05) 100%
      );
  }
  50% {
    background: 
      linear-gradient(135deg, 
        rgba(212, 175, 55, 0.2) 0%, 
        rgba(139, 69, 19, 0.1) 100%
      );
  }
`

// Royal court chamber
const RoyalCourt = styled.div<{ visible: boolean }>`
  min-height: 100vh;
  background: 
    /* Royal court parchment */
    linear-gradient(45deg, 
      #f4f1e8 0%, 
      #f7f4eb 25%, 
      #f2efe6 50%, 
      #f5f2e9 75%, 
      #f3f0e7 100%
    ),
    /* Heraldic administration patterns */
    radial-gradient(circle at 20% 20%, rgba(212, 175, 55, 0.1) 0%, transparent 6%),
    radial-gradient(circle at 80% 80%, rgba(139, 69, 19, 0.08) 0%, transparent 5%),
    radial-gradient(circle at 50% 10%, rgba(212, 175, 55, 0.06) 0%, transparent 4%);
    
  /* Noble court texture */
  background-image: 
    /* Royal pattern */
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(212, 175, 55, 0.02) 10px,
      rgba(212, 175, 55, 0.02) 20px
    );
    
  padding: 4rem 2rem;
  position: relative;
  overflow-x: hidden;
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 2s ease-in-out;
  
  /* Royal court atmosphere */
  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(ellipse at center, 
        rgba(212, 175, 55, 0.08) 0%,
        rgba(139, 69, 19, 0.04) 50%,
        transparent 80%
      );
    pointer-events: none;
    z-index: 1;
    animation: ${crownGlow} 10s ease-in-out infinite;
  }
`

// Royal court scroll
const CourtScroll = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  
  /* Royal court scroll */
  background: 
    linear-gradient(135deg, 
      #faf8f0 0%, 
      #f6f3ea 30%, 
      #f4f1e8 70%, 
      #f2efe6 100%
    );
  
  border: 4px solid #8b4513;
  border-radius: 0;
  
  /* Royal court shadow */
  box-shadow: 
    inset 0 0 40px rgba(212, 175, 55, 0.2),
    inset 0 0 80px rgba(255, 255, 255, 0.3),
    0 15px 60px rgba(139, 69, 19, 0.4),
    0 30px 100px rgba(101, 67, 33, 0.3);
  
  transform: perspective(1000px) rotateX(1deg);
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Royal scroll rods */
  &::before, &::after {
    content: '';
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    height: 10px;
    background: 
      linear-gradient(90deg, 
        #8b4513 0%, 
        #d4af37 50%, 
        #8b4513 100%
      );
    border-radius: 5px;
    box-shadow: 0 3px 6px rgba(139, 69, 19, 0.4);
  }
  
  &::before {
    top: -10px;
  }
  
  &::after {
    bottom: -10px;
    box-shadow: 0 -3px 6px rgba(139, 69, 19, 0.4);
  }
`

// Royal court page
const CourtPage = styled.div`
  padding: 5rem 4rem;
  background: transparent;
  position: relative;
  z-index: 4;
  
  @media (max-width: 768px) {
    padding: 4rem 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 3rem 1.5rem;
  }
`

// Royal crown title
const CrownTitle = styled.h1`
  font-family: 'Uncial Antiqua', 'Luminari', serif;
  font-size: 4.5rem;
  color: #8b4513;
  text-align: center;
  margin: 0 0 2rem 0;
  font-weight: 400;
  letter-spacing: 3px;
  line-height: 1.2;
  position: relative;
  
  /* Royal crown calligraphy */
  text-shadow: 
    2px 2px 0px #d4af37,
    4px 4px 8px rgba(139, 69, 19, 0.4),
    0 0 20px rgba(212, 175, 55, 0.3);
  
  /* Royal crown symbol */
  &::before {
    content: '👑';
    font-size: 3.5rem;
    display: block;
    margin: 0 auto 1rem auto;
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
    animation: ${scepterFloat} 6s ease-in-out infinite;
  }
  
  /* Illuminated first letter */
  &::first-letter {
    font-size: 6rem;
    color: #d4af37;
    font-weight: 700;
    line-height: 1;
    margin-right: 8px;
    float: left;
    
    /* Royal drop cap */
    text-shadow: 
      3px 3px 0px #8b4513,
      6px 6px 12px rgba(212, 175, 55, 0.6),
      0 0 25px rgba(255, 215, 0, 0.4);
  }
  
  @media (max-width: 768px) {
    font-size: 3.5rem;
    
    &::before {
      font-size: 2.8rem;
    }
    
    &::first-letter {
      font-size: 4.5rem;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 2.8rem;
    
    &::before {
      font-size: 2.2rem;
    }
    
    &::first-letter {
      font-size: 3.5rem;
    }
  }
`

// Royal warning
const RoyalWarning = styled.div`
  background: 
    linear-gradient(135deg, 
      rgba(220, 20, 60, 0.1) 0%, 
      rgba(139, 0, 0, 0.05) 100%
    );
  border: 3px solid #DC143C;
  border-radius: 0;
  padding: 2rem;
  margin: 3rem auto;
  max-width: 600px;
  text-align: center;
  
  /* Royal warning effects */
  box-shadow: 
    0 8px 32px rgba(220, 20, 60, 0.2),
    inset 0 0 20px rgba(220, 20, 60, 0.1);
  
  .warning-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    display: block;
    filter: drop-shadow(0 0 10px rgba(220, 20, 60, 0.4));
  }
  
  .warning-text {
    font-family: 'Uncial Antiqua', serif;
    font-size: 1.2rem;
    color: #8b0000;
    font-weight: 600;
    line-height: 1.6;
    
    /* Noble warning styling */
    text-shadow: 1px 1px 2px rgba(139, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    
    .warning-icon {
      font-size: 2rem;
    }
    
    .warning-text {
      font-size: 1.1rem;
    }
  }
`

// Admin panels grid
const AdminPanels = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  margin: 4rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`

// Admin panel
const AdminPanel = styled.div`
  background: 
    linear-gradient(135deg, 
      rgba(250, 248, 240, 0.8) 0%, 
      rgba(246, 243, 234, 0.9) 100%
    );
  border: 3px solid #8b4513;
  border-radius: 0;
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
  
  /* Heraldic panel effects */
  box-shadow: 
    0 10px 40px rgba(139, 69, 19, 0.3),
    0 20px 60px rgba(101, 67, 33, 0.2),
    inset 0 0 30px rgba(212, 175, 55, 0.1);
  
  animation: ${royalPulse} 8s ease-in-out infinite;
  
  &:hover {
    transform: translateY(-5px);
    border-color: #d4af37;
    
    box-shadow: 
      0 15px 50px rgba(139, 69, 19, 0.4),
      0 25px 70px rgba(101, 67, 33, 0.3),
      inset 0 0 40px rgba(212, 175, 55, 0.2);
  }
`

// Panel title
const PanelTitle = styled.h2`
  font-family: 'Uncial Antiqua', serif;
  font-size: 1.8rem;
  color: #8b4513;
  margin: 0 0 1.5rem 0;
  font-weight: 600;
  text-align: center;
  
  /* Noble panel styling */
  text-shadow: 
    1px 1px 0px #d4af37,
    2px 2px 4px rgba(139, 69, 19, 0.3);
  
  /* Panel heraldic symbol */
  &::before {
    font-size: 1.5rem;
    display: block;
    margin: 0 auto 0.5rem auto;
    filter: drop-shadow(0 0 8px rgba(212, 175, 55, 0.4));
  }
  
  &.users::before { content: '👥'; }
  &.games::before { content: '🎲'; }
  &.treasury::before { content: '💰'; }
  &.security::before { content: '🛡️'; }
  &.analytics::before { content: '📊'; }
  &.settings::before { content: '⚙️'; }
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`

// Panel content
const PanelContent = styled.div`
  font-family: 'Uncial Antiqua', serif;
  font-size: 1rem;
  color: #654321;
  line-height: 1.6;
  
  /* Noble manuscript styling */
  text-shadow: 1px 1px 2px rgba(139, 69, 19, 0.2);
  
  .stat {
    display: flex;
    justify-content: space-between;
    margin: 0.8rem 0;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(139, 69, 19, 0.2);
    
    .label {
      color: #765432;
    }
    
    .value {
      color: #8b4513;
      font-weight: 600;
    }
  }
  
  .controls {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }
`

// Royal button
const RoyalButton = styled.button<{ variant?: 'primary' | 'danger' | 'warning' }>`
  font-family: 'Uncial Antiqua', serif;
  font-size: 1rem;
  padding: 0.8rem 1.5rem;
  border: 2px solid;
  border-radius: 0;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  
  ${props => {
    switch (props.variant) {
      case 'danger':
        return `
          background: rgba(220, 20, 60, 0.1);
          color: #DC143C;
          border-color: #DC143C;
          
          &:hover {
            background: rgba(220, 20, 60, 0.2);
            transform: translateY(-2px);
          }
        `
      case 'warning':
        return `
          background: rgba(255, 140, 0, 0.1);
          color: #FF8C00;
          border-color: #FF8C00;
          
          &:hover {
            background: rgba(255, 140, 0, 0.2);
            transform: translateY(-2px);
          }
        `
      default:
        return `
          background: rgba(212, 175, 55, 0.1);
          color: #8b4513;
          border-color: #8b4513;
          
          &:hover {
            background: rgba(212, 175, 55, 0.2);
            border-color: #d4af37;
            transform: translateY(-2px);
          }
        `
    }
  }}
  
  /* Noble button styling */
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: 0 4px 8px rgba(139, 69, 19, 0.2);
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.7rem 1.2rem;
  }
`

// Main component
const HolyGrailAdminPage: React.FC = () => {
  const [visible, setVisible] = useState(false)
  const { currentColorScheme } = useColorScheme()

  useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <RoyalCourt visible={visible}>
      <CourtScroll>
        <CourtPage>
          <CrownTitle>Royal Administration</CrownTitle>
          
          <RoyalWarning>
            <span className="warning-icon">⚠️</span>
            <div className="warning-text">
              Restricted Access - Only Royal Administrators May Enter These Sacred Chambers
            </div>
          </RoyalWarning>
          
          <AdminPanels>
            <AdminPanel>
              <PanelTitle className="users">User Management</PanelTitle>
              <PanelContent>
                <div className="stat">
                  <span className="label">Active Knights:</span>
                  <span className="value">1,247</span>
                </div>
                <div className="stat">
                  <span className="label">Online Now:</span>
                  <span className="value">89</span>
                </div>
                <div className="stat">
                  <span className="label">Banned Accounts:</span>
                  <span className="value">12</span>
                </div>
                <div className="controls">
                  <RoyalButton>View All Users</RoyalButton>
                  <RoyalButton variant="warning">Moderate Users</RoyalButton>
                </div>
              </PanelContent>
            </AdminPanel>
            
            <AdminPanel>
              <PanelTitle className="games">Game Control</PanelTitle>
              <PanelContent>
                <div className="stat">
                  <span className="label">Active Games:</span>
                  <span className="value">23</span>
                </div>
                <div className="stat">
                  <span className="label">Total Plays Today:</span>
                  <span className="value">8,453</span>
                </div>
                <div className="stat">
                  <span className="label">House Edge:</span>
                  <span className="value">2.5%</span>
                </div>
                <div className="controls">
                  <RoyalButton>Game Settings</RoyalButton>
                  <RoyalButton variant="danger">Emergency Stop</RoyalButton>
                </div>
              </PanelContent>
            </AdminPanel>
            
            <AdminPanel>
              <PanelTitle className="treasury">Royal Treasury</PanelTitle>
              <PanelContent>
                <div className="stat">
                  <span className="label">Total Balance:</span>
                  <span className="value">45,892 SOL</span>
                </div>
                <div className="stat">
                  <span className="label">Daily Profit:</span>
                  <span className="value">+234 SOL</span>
                </div>
                <div className="stat">
                  <span className="label">Pending Withdrawals:</span>
                  <span className="value">1,247 SOL</span>
                </div>
                <div className="controls">
                  <RoyalButton>Treasury Report</RoyalButton>
                  <RoyalButton variant="warning">Manage Funds</RoyalButton>
                </div>
              </PanelContent>
            </AdminPanel>
            
            <AdminPanel>
              <PanelTitle className="security">Security Center</PanelTitle>
              <PanelContent>
                <div className="stat">
                  <span className="label">Security Score:</span>
                  <span className="value">98.5%</span>
                </div>
                <div className="stat">
                  <span className="label">Failed Logins:</span>
                  <span className="value">3</span>
                </div>
                <div className="stat">
                  <span className="label">Suspicious Activity:</span>
                  <span className="value">0</span>
                </div>
                <div className="controls">
                  <RoyalButton>Security Logs</RoyalButton>
                  <RoyalButton variant="danger">Lock System</RoyalButton>
                </div>
              </PanelContent>
            </AdminPanel>
            
            <AdminPanel>
              <PanelTitle className="analytics">Royal Analytics</PanelTitle>
              <PanelContent>
                <div className="stat">
                  <span className="label">Daily Users:</span>
                  <span className="value">856</span>
                </div>
                <div className="stat">
                  <span className="label">Conversion Rate:</span>
                  <span className="value">24.7%</span>
                </div>
                <div className="stat">
                  <span className="label">Avg Session:</span>
                  <span className="value">28 min</span>
                </div>
                <div className="controls">
                  <RoyalButton>View Reports</RoyalButton>
                  <RoyalButton>Export Data</RoyalButton>
                </div>
              </PanelContent>
            </AdminPanel>
            
            <AdminPanel>
              <PanelTitle className="settings">System Settings</PanelTitle>
              <PanelContent>
                <div className="stat">
                  <span className="label">Server Status:</span>
                  <span className="value">Healthy</span>
                </div>
                <div className="stat">
                  <span className="label">Uptime:</span>
                  <span className="value">99.98%</span>
                </div>
                <div className="stat">
                  <span className="label">Last Backup:</span>
                  <span className="value">2 hours ago</span>
                </div>
                <div className="controls">
                  <RoyalButton>System Config</RoyalButton>
                  <RoyalButton variant="warning">Maintenance Mode</RoyalButton>
                </div>
              </PanelContent>
            </AdminPanel>
          </AdminPanels>
        </CourtPage>
      </CourtScroll>
    </RoyalCourt>
  )
}

export default HolyGrailAdminPage