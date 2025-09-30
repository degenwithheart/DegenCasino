// Popup JavaScript for DegenHeart Casino Chrome Extension

document.addEventListener('DOMContentLoaded', () => {
  const iframe = document.getElementById('casinoFrame');
  const loading = document.getElementById('loading');
  const refreshBtn = document.getElementById('refreshBtn');
  const homeBtn = document.getElementById('homeBtn');
  const newWindowBtn = document.getElementById('newWindowBtn');
  
  // Handle iframe load
  iframe.addEventListener('load', () => {
    setTimeout(() => {
      loading.classList.add('hidden');
      iframe.style.opacity = '1';
      iframe.style.transition = 'opacity 0.3s ease';
    }, 800); // Small delay for better UX
  });
  
  // Refresh button
  refreshBtn.addEventListener('click', () => {
    loading.classList.remove('hidden');
    iframe.style.opacity = '0';
    iframe.src = iframe.src; // Reload iframe
  });
  
  // Home button
  homeBtn.addEventListener('click', () => {
    loading.classList.remove('hidden');
    iframe.style.opacity = '0';
    iframe.src = 'https://degenheart.casino';
  });
  
  // New window button
  newWindowBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage(
      { action: 'openNewWindow' },
      (response) => {
        if (response && response.success) {
          // Close popup after opening new window
          window.close();
        }
      }
    );
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + R for refresh
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      refreshBtn.click();
    }
    
    // Ctrl/Cmd + H for home
    if ((e.ctrlKey || e.metaKey) && e.key === 'h') {
      e.preventDefault();
      homeBtn.click();
    }
    
    // Ctrl/Cmd + N for new window
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      newWindowBtn.click();
    }
  });
  
  // Track usage analytics
  chrome.runtime.sendMessage(
    { action: 'getLaunchStats' },
    (response) => {
      if (response && response.launchCount) {
        console.log(`DegenHeart opened ${response.launchCount} times`);
      }
    }
  );
  
  // Handle iframe errors
  iframe.addEventListener('error', () => {
    loading.innerHTML = `
      <div class="logo" style="background: #ff4444; display: inline-block; width: 48px; height: 48px; border-radius: 50%;"></div>
      <div>Failed to load casino</div>
      <div style="font-size: 12px; margin-top: 8px;">
        <button class="btn" onclick="location.reload()">Retry</button>
      </div>
    `;
  });
  
  // Optional: Add right-click context menu for iframe
  iframe.addEventListener('contextmenu', (e) => {
    // You can customize or prevent right-click menu if needed
    // e.preventDefault();
  });
  
  // Performance monitoring
  const startTime = Date.now();
  iframe.addEventListener('load', () => {
    const loadTime = Date.now() - startTime;
    console.log(`Casino loaded in ${loadTime}ms`);
  });
});

// Handle messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updatePopup') {
    // Handle any popup updates if needed
    sendResponse({ received: true });
  }
});

// Focus management
window.addEventListener('focus', () => {
  // Ensure iframe maintains focus for gaming
  const iframe = document.getElementById('casinoFrame');
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.focus();
  }
});