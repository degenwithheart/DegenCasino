import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Global error handler that catches unhandled errors and promise rejections
 * Provides users with recovery options instead of blank screens
 */
export function WindowErrorHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('🚨 Unhandled window error:', event.error);
      
      // Show user-friendly error instead of blank screen
      showErrorDialog({
        title: 'Unexpected Error',
        message: 'Something went wrong. The page will be refreshed automatically.',
        error: event.error,
        autoReload: true
      });
    };

    const handlePromiseRejection = (event: PromiseRejectionEvent) => {
      console.error('🚨 Unhandled promise rejection:', event.reason);
      
      // Show user-friendly error instead of blank screen
      showErrorDialog({
        title: 'Network or Loading Error',
        message: 'A background operation failed. You can continue using the app or refresh if needed.',
        error: new Error(event.reason),
        autoReload: false
      });
    };

    const showErrorDialog = ({ title, message, error, autoReload }: {
      title: string;
      message: string;
      error: Error;
      autoReload: boolean;
    }) => {
      // Create modal-like overlay
      const overlay = document.createElement('div');
      overlay.id = 'window-error-handler';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(24, 24, 24, 0.95);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(6px);
      `;

      const content = document.createElement('div');
      content.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        text-align: center;
        color: #ff6b7a;
        background-color: rgba(24, 24, 24, 0.95);
        border-radius: 12px;
        border: 1px solid rgba(255, 107, 122, 0.3);
        max-width: 500px;
        width: 90%;
      `;

      content.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
          <img src="/png/images/logo.png" alt="DegenHeart Casino" style="width: 60px; height: 60px; margin-right: 1rem;" />
          <div style="font-size: 3rem;">⚠️</div>
        </div>
        <h2 style="margin-bottom: 1rem; color: #ff6b7a; font-size: 1.5rem; font-weight: bold;">${title}</h2>
        <p style="margin-bottom: 1.5rem; color: #fff; line-height: 1.5; max-width: 400px;">${message}</p>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
          <button id="refresh-btn" style="
            padding: 0.75rem 1.5rem;
            background: #ff6b7a;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.2s ease;
          ">Refresh Page</button>
          <button id="home-btn" style="
            padding: 0.75rem 1.5rem;
            background: transparent;
            color: #ff6b7a;
            border: 1px solid #ff6b7a;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.2s ease;
          ">Go Home</button>
          <button id="continue-btn" style="
            padding: 0.75rem 1.5rem;
            background: transparent;
            color: #ffd700;
            border: 1px solid #ffd700;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.2s ease;
          ">Continue</button>
        </div>
      `;

      // Add button event listeners
      content.querySelector('#refresh-btn')?.addEventListener('click', () => {
        window.location.reload();
      });

      content.querySelector('#home-btn')?.addEventListener('click', () => {
        window.location.href = '/';
      });

      content.querySelector('#continue-btn')?.addEventListener('click', () => {
        document.body.removeChild(overlay);
      });

      overlay.appendChild(content);
      document.body.appendChild(overlay);

      // Auto-reload after 10 seconds if specified
      if (autoReload) {
        setTimeout(() => {
          window.location.reload();
        }, 10000);
      }

      // Log to external service if needed
      if ((window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: `window_error: ${error.message}`,
          fatal: false
        });
      }
    };

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handlePromiseRejection);

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
      
      // Remove any existing error dialogs
      const existingDialog = document.getElementById('window-error-handler');
      if (existingDialog) {
        document.body.removeChild(existingDialog);
      }
    };
  }, [navigate]);

  return null; // This component doesn't render anything
}

export default WindowErrorHandler;