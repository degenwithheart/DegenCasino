// Mobile Debug Test - Run in browser console
console.log('🔍 MOBILE DICE DEBUG TEST');
console.log('='.repeat(50));

// Check screen size
console.log('📏 Screen size:', window.innerWidth + 'x' + window.innerHeight);

// Check useIsCompact logic (mimicking the hook)
const width = window.innerWidth;
const compact = width <= 1024;
const screenTooSmall = width <= 480;
const mobile = width <= 700;

console.log('🔧 useIsCompact results:');
console.log('  - compact (<=1024px):', compact);
console.log('  - screenTooSmall (<=480px):', screenTooSmall);
console.log('  - mobile (<=700px):', mobile);

// Check device detection
const userAgent = navigator.userAgent.toLowerCase();
const mobileKeywords = [
    'android', 'iphone', 'ipad', 'ipod', 'blackberry',
    'windows phone', 'mobile', 'webos', 'opera mini'
];
const hasMobileUserAgent = mobileKeywords.some(keyword => userAgent.includes(keyword));
const hasSmallScreen = window.innerWidth <= 768;
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

console.log('📱 Mobile detection:');
console.log('  - User Agent:', userAgent);
console.log('  - Has mobile UA:', hasMobileUserAgent);
console.log('  - Small screen (<=768px):', hasSmallScreen);
console.log('  - Touch device:', isTouchDevice);
console.log('  - Should be mobile:', hasMobileUserAgent || (hasSmallScreen && isTouchDevice));

// Check current theme
if (window.localStorage) {
    console.log('💾 Local storage theme:');
    console.log('  - selectedLayoutTheme:', localStorage.getItem('selectedLayoutTheme'));
    console.log('  - themePreference:', localStorage.getItem('themePreference'));
}

// Test dice game URL
console.log('🎲 Current URL:', window.location.href);
console.log('🎮 Is dice game URL?', window.location.pathname.includes('/dice'));

console.log('='.repeat(50));
console.log('📝 INSTRUCTIONS:');
console.log('1. Navigate to a dice game: /game/{wallet}/dice');
console.log('2. Open dev tools and check if mobile version loads');
console.log('3. If mobile theme is active, game should use mobile component');