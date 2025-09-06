import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { getErrorCode, getErrorMessageForCode } from "../../constants/errorCodes";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 20, 40, 0.65);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
  padding: 10vh 1rem 10vh 1rem; /* 10% from top and bottom */
  box-sizing: border-box;
`;

const ModalContent = styled.div`
  background: rgba(30, 34, 44, 0.92);
  border-radius: 22px;
  padding: 40px 32px 28px 32px;
  min-width: 340px;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 40px 0 rgba(0,0,0,0.55), 0 1.5px 0 rgba(255,255,255,0.04) inset;
  font-family: 'JetBrains Mono', 'Fira Mono', 'monospace';
  color: #eaf6fb;
  position: relative;
  border: 1.5px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(12px);

  @media (max-width: 600px) {
    padding: 24px 20px 20px 20px;
    min-width: 300px;
    border-radius: 16px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 18px;
  right: 18px;
  background: linear-gradient(135deg, rgba(255,255,255,0.10), rgba(0,0,0,0.10));
  border: none;
  color: #fff;
  font-size: 1.6rem;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.18s, transform 0.18s;
  &:hover {
    background: linear-gradient(135deg, rgba(255,255,255,0.18), rgba(0,0,0,0.18));
    transform: scale(1.08) rotate(8deg);
  }
`;

const Title = styled.div`
  font-weight: 700;
  font-size: 1.45rem;
  color: #ffe066;
  margin-bottom: 18px;
  letter-spacing: 0.01em;
  text-shadow: 0 2px 8px rgba(0,0,0,0.22);
  text-align: center;
`;

const Pre = styled.pre`
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.5;
  color: #aee9ff;
  font-size: 1.04rem;
  background: rgba(0,0,0,0.10);
  border-radius: 10px;
  padding: 18px 14px 14px 14px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08) inset;
  overflow-x: auto;
`;

interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  error: Error;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ open, onClose, title = 'App Error', error }) => {
  if (!open) return null;
  const stackOrMessage = error.stack || error.message;
  const errorCode = getErrorCode(stackOrMessage);
  const errorMessage = getErrorMessageForCode(errorCode);
  const isDev = import.meta.env.MODE !== 'production';

  return ReactDOM.createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 5L15 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M15 5L5 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </CloseButton>
        <Title>{title}</Title>
        <div style={{textAlign: 'center', margin: '18px 0 10px', fontSize: '1.12rem', color: '#fff'}}>
          {errorMessage}<br/>
          <span style={{color: '#ffe066', fontWeight: 600}}>Error Code: {errorCode}</span>
        </div>
        {isDev && (
          <Pre>{stackOrMessage}</Pre>
        )}
        <p style={{ color: '#ffe066', textAlign: 'center', marginTop: 16 }}>Click outside or press Esc to dismiss.</p>
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};
