// Chrome Extension Background Script for DegenHeart Casino
// Handles extension lifecycle and window management

// Extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('DegenHeart Casino Extension installed:', details.reason);
  
  // Set default settings
  chrome.storage.sync.set({
    autoFullscreen: false,
    windowWidth: 1200,
    windowHeight: 800,
    launchCount: 0
  });
  
  // Show welcome notification
  if (details.reason === 'install') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon-48.png',
      title: 'DegenHeart Casino Ready!',
      message: 'Click the extension icon to start playing. Welcome to the casino!'
    });
  }
});

// Handle extension icon click (when popup is disabled)
chrome.action.onClicked.addListener((tab) => {
  openCasinoWindow();
});

// Open casino in new window
function openCasinoWindow() {
  chrome.storage.sync.get(['windowWidth', 'windowHeight', 'launchCount'], (data) => {
    // Increment launch counter
    const newLaunchCount = (data.launchCount || 0) + 1;
    chrome.storage.sync.set({ launchCount: newLaunchCount });
    
    // Create new window
    chrome.windows.create({
      url: 'https://degenheart.casino',
      type: 'popup',
      width: data.windowWidth || 1200,
      height: data.windowHeight || 800,
      focused: true
    }, (window) => {
      console.log('DegenHeart Casino window opened:', window.id);
      
      // Store window ID for potential future management
      chrome.storage.local.set({
        activeWindowId: window.id,
        lastOpenTime: Date.now()
      });
    });
  });
}

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'openNewWindow':
      openCasinoWindow();
      sendResponse({ success: true });
      break;
      
    case 'getLaunchStats':
      chrome.storage.sync.get(['launchCount'], (data) => {
        sendResponse({ launchCount: data.launchCount || 0 });
      });
      return true; // Will respond asynchronously
      
    case 'updateSettings':
      chrome.storage.sync.set(message.settings, () => {
        sendResponse({ success: true });
      });
      return true;
      
    default:
      sendResponse({ error: 'Unknown action' });
  }
});

// Context menu (right-click) integration
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'openDegenHeart',
    title: 'Open DegenHeart Casino',
    contexts: ['all']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'openDegenHeart') {
    openCasinoWindow();
  }
});

// Tab management - detect when user navigates to degenheart.casino
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && 
      tab.url && 
      tab.url.includes('degenheart.casino')) {
    
    // Update badge to show active
    chrome.action.setBadgeText({
      text: '●',
      tabId: tabId
    });
    
    chrome.action.setBadgeBackgroundColor({
      color: '#d4a574'
    });
  }
});

// Clean up badge when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.action.setBadgeText({
    text: '',
    tabId: tabId
  });
});

// Keyboard shortcut handler (if defined in manifest)
chrome.commands.onCommand.addListener((command) => {
  if (command === 'open-casino') {
    openCasinoWindow();
  }
});

// Keep service worker alive for better performance
let keepAliveInterval;

function keepAlive() {
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
  }
  
  keepAliveInterval = setInterval(() => {
    chrome.storage.local.get('ping', () => {
      // This keeps the service worker active
    });
  }, 20000); // Ping every 20 seconds
}

// Start keep alive immediately
keepAlive();

// Restart keep alive when service worker starts
chrome.runtime.onStartup.addListener(() => {
  keepAlive();
});