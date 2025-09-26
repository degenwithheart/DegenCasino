import React from 'react';
import ReactDOM from 'react-dom';
import { getErrorCode, getErrorMessageForCode } from "../../constants/errorCodes";

const ModalOverlay: React.FC<{ children: React.ReactNode; onClick: () => void }> = ({ children, onClick }) => (
  <div
    onClick={onClick}
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(24, 24, 24, 0.95)',
      zIndex: 3000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(6px)',
      padding: '2rem',
      boxSizing: 'border-box'
    }}
  >
    {children}
  </div>
);

const ModalContent: React.FC<{ children: React.ReactNode; onClick: (e: React.MouseEvent) => void }> = ({ children, onClick }) => (
  <div
    onClick={onClick}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '2rem',
      textAlign: 'center',
      color: '#ff6b7a',
      backgroundColor: 'rgba(24, 24, 24, 0.95)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 107, 122, 0.3)',
      position: 'relative',
      maxWidth: '500px',
      width: '100%',
      maxHeight: '80vh',
      overflowY: 'auto'
    }}
  >
    {children}
  </div>
);

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
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'transparent',
            border: 'none',
            color: '#ff6b7a',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '4px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 107, 122, 0.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          aria-label="Close"
        >
          ×
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <img 
            src="/png/images/logo.png" 
            alt="DegenHeart Casino" 
            style={{ width: '60px', height: '60px', marginRight: '1rem' }}
          />
          <div style={{ fontSize: '4rem' }}>🚨</div>
        </div>
        
        <h2 style={{ marginBottom: '1rem', color: '#ff6b7a', fontSize: '1.5rem', fontWeight: 'bold' }}>
          {title}
        </h2>
        
        <p style={{ marginBottom: '1rem', maxWidth: '400px', lineHeight: '1.5', color: '#fff' }}>
          {errorMessage}
        </p>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <span style={{ color: '#ff6b7a', fontWeight: '600' }}>Error Code: {errorCode}</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
          <button 
            onClick={onClose}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#ff6b7a',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = '#ff5566';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = '#ff6b7a';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Close
          </button>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'transparent',
              color: '#ff6b7a',
              border: '1px solid #ff6b7a',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 107, 122, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Reload Page
          </button>
        </div>

        {isDev && (
          <details style={{ marginTop: '2rem', textAlign: 'left', width: '100%', maxWidth: '500px' }}>
            <summary style={{ cursor: 'pointer', color: '#ff6b7a', marginBottom: '0.5rem' }}>
              Error Details (Dev Mode)
            </summary>
            <pre style={{ 
              background: 'rgba(0, 0, 0, 0.5)', 
              padding: '1rem', 
              borderRadius: '4px', 
              overflow: 'auto',
              fontSize: '0.8rem',
              color: '#ccc',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.5'
            }}>
              {stackOrMessage}
            </pre>
          </details>
        )}
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};
