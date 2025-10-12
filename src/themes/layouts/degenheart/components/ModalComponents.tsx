/**
 * ModalComponents copied from degen-mobile for degenheart theme
 */
import styled, { keyframes } from 'styled-components';

export const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

export const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

export const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px) saturate(150%);
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  animation: ${fadeIn} 0.4s ease;
  @media (min-width: 768px) {
    align-items: center;
    justify-content: center;
  }
`;

export interface ModalContainerProps {
    $variant?: 'jackpot' | 'bonus' | 'leaderboard' | 'token' | 'gameinfo' | 'allgames' | 'moremenu' | 'default';
}

export const ModalContainer = styled.div<ModalContainerProps>`
  background: ${props => `linear-gradient(145deg, rgba(99,102,241,0.12), rgba(59,130,246,0.08), rgba(15,15,15,0.98))`};
  backdrop-filter: blur(20px) saturate(150%);
  border-radius: 24px 24px 0 0;
  width: 100vw;
  max-height: 85vh;
  height: 85vh;
  overflow: hidden;
  animation: ${slideUp} 0.4s ease;
  position: relative;
  border: 2px solid rgba(99,102,241,0.3);
  box-shadow: 0 -4px 30px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.08);
  @media (min-width: 768px) {
    border-radius: 24px;
    max-width: 480px;
    max-height: 80vh;
    width: 90vw;
    box-shadow: 0 20px 60px rgba(99,102,241,0.25), inset 0 1px 0 rgba(255,255,255,0.1);
  }
`;

export const Header = styled.div<{ $variant?: ModalContainerProps['$variant']; }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px 20px;
  border-bottom: 1px solid rgba(99,102,241,0.15);
  position: relative;
  overflow: hidden;
  &::before { content: ''; position: absolute; top:0; left:-200px; width:200px; height:100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); animation: ${shimmer} 4s infinite; }
`;

export const Title = styled.h2<{ $variant?: ModalContainerProps['$variant']; $icon?: string; }>`
  font-size: 1.375rem;
  font-weight: 800;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #6366f1, #3b82f6, #1d4ed8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  &::before { content: '${props => props.$icon || '✨'}'; font-size: 1.2em; }
  @media (min-width: 768px) { font-size: 1.5rem; }
`;

export const CloseButton = styled.button<{ $variant?: ModalContainerProps['$variant']; }>`
  width: 36px; height: 36px; border-radius: 50%; border: none; background: rgba(255,255,255,0.12); backdrop-filter: blur(12px); color: #fff; cursor: pointer; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:300; position:relative;
  &::before { content: '×'; line-height:1; }
  &:hover { background: rgba(99,102,241,0.25); transform: scale(1.08) rotate(90deg); box-shadow: 0 8px 25px rgba(0,0,0,0.3); }
  &:active { transform: scale(0.95); }
`;

export const Content = styled.div`
  padding: 20px 16px 24px;
  max-height: calc(95vh - 80px);
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  position: relative;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius:2px; }
  @media (min-width: 768px) { max-height: calc(80vh - 90px); padding: 24px 28px 32px; &::-webkit-scrollbar { width:6px } }
`;

export const PageContent = styled.div<{ $variant?: ModalContainerProps['$variant']; }>`
  text-align: center; color: #fff;
  h3 { margin-bottom: 24px; font-size: 1.375rem; font-weight:700; }
  p { margin-bottom: 16px; line-height:1.6; color: rgba(255,255,255,0.85); font-size:1rem }
`;

export const Card = styled.div<{ $variant?: ModalContainerProps['$variant']; }>`
  background: rgba(255,255,255,0.05); backdrop-filter: blur(12px); border-radius:20px; padding:24px; margin:20px 0; border:1px solid rgba(255,255,255,0.1);
  &:hover { background: rgba(255,255,255,0.08); transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.2); }
`;

export const ActionButton = styled.button<{ $variant?: ModalContainerProps['$variant']; $secondary?: boolean; }>`
  padding: 16px 32px; border-radius:16px; border:none; font-size:1rem; font-weight:600; cursor:pointer; transition: all 0.3s ease; margin:8px;
  ${props => props.$secondary ? `background: rgba(255,255,255,0.1); color:#fff; &:hover{ background: rgba(255,255,255,0.2); transform: translateY(-2px); }` : `background: linear-gradient(135deg, #6366f1, #3b82f6); color:#fff; box-shadow:0 8px 25px rgba(99,102,241,0.3); &:hover{ transform: translateY(-3px); box-shadow:0 12px 35px rgba(99,102,241,0.4);} }`}
`;