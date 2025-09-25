import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useColorScheme } from '../../themes/ColorSchemeContext';

// Romantic Serenade Animations
const loveLetterFloat = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-8px) rotate(1deg); }
  66% { transform: translateY(-4px) rotate(-1deg); }
`;

const romanticPulse = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(212, 165, 116, 0.3), 0 0 40px rgba(184, 54, 106, 0.2);
    border-color: rgba(212, 165, 116, 0.4);
  }
  50% { 
    box-shadow: 0 0 40px rgba(212, 165, 116, 0.6), 0 0 80px rgba(184, 54, 106, 0.4);
    border-color: rgba(212, 165, 116, 0.8);
  }
`;

const candlestickSparkle = keyframes`
  0%, 100% { 
    opacity: 0.6; 
    transform: scale(1) rotate(0deg);
  }
  50% { 
    opacity: 1; 
    transform: scale(1.1) rotate(180deg);
  }
`;

const ChangelogContainer = styled.div<{ $colorScheme?: any }>`
  max-width: 100vw;
  border-radius: 16px;
  margin: 0 auto;
  padding: 1rem;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textPrimary || '#e8d5c4'};
  min-height: 100vh;
  background: ${({ $colorScheme }) => $colorScheme?.patterns?.background || 'linear-gradient(135deg, #0a0511 0%, #1a0b2e 50%, #2d1b4e 100%)'};
  border: 2px solid ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#d4a574'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ $colorScheme }) => $colorScheme?.patterns?.overlay || 'radial-gradient(circle at 30% 20%, rgba(212, 165, 116, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(184, 54, 106, 0.1) 0%, transparent 50%)'};
    pointer-events: none;
  }
  
  @media (min-width: 768px) {
    padding: 2rem;
    max-width: 1200px;
  }
`;

const Title = styled.h1<{ $colorScheme?: any }>`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  background: ${({ $colorScheme }) => $colorScheme?.patterns?.gradient || 'linear-gradient(135deg, #d4a574, #b8336a, #8b5a9e)'};
  background-size: 300% 100%;
  animation: ${loveLetterFloat} 6s ease-in-out infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  text-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.textGlow || '0 0 20px rgba(212, 165, 116, 0.6)'};
  position: relative;
  z-index: 2;
  
  &::before {
    content: '📋';
    position: absolute;
    left: -60px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    opacity: 0.8;
    animation: ${candlestickSparkle} 3s ease-in-out infinite;
  }

  &::after {
    content: '📋';
    position: absolute;
    right: -60px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 1.5rem;
    opacity: 0.8;
    animation: ${candlestickSparkle} 3s ease-in-out infinite 1.5s;
  }
  
  @media (min-width: 768px) {
    font-size: 3rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    &::before, &::after {
      display: none;
    }
  }
`;

const ChangelogList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ChangelogItem = styled.li<{ $colorScheme?: any }>`
  background: ${({ $colorScheme }) => $colorScheme?.patterns?.glassmorphism || 'rgba(26, 11, 46, 0.6)'};
  backdrop-filter: blur(15px);
  border: 2px solid ${({ $colorScheme }) => $colorScheme?.colors?.accent || '#8b5a9e'};
  border-radius: 16px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ $colorScheme }) => $colorScheme?.patterns?.overlay || 'radial-gradient(circle at 30% 20%, rgba(212, 165, 116, 0.05) 0%, transparent 50%)'};
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ $colorScheme }) => $colorScheme?.patterns?.gradient || 'linear-gradient(90deg, #d4a574, #b8336a, #8b5a9e)'};
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  @media (min-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  &:hover {
    background: ${({ $colorScheme }) => $colorScheme?.patterns?.glassmorphism || 'rgba(26, 11, 46, 0.8)'};
    border-color: ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#d4a574'};
    transform: translateY(-4px) scale(1.01);
    box-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.glow || '0 15px 40px rgba(212, 165, 116, 0.3), 0 0 60px rgba(184, 54, 106, 0.2)'};

    &::after {
      opacity: 1;
    }
  }
`;

const ChangelogContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  
  @media (min-width: 640px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const DateBadge = styled.span<{ $colorScheme?: any }>`
  display: inline-block;
  background: ${({ $colorScheme }) => $colorScheme?.patterns?.gradient || 'linear-gradient(135deg, #d4a574, #b8336a)'};
  color: ${({ $colorScheme }) => $colorScheme?.colors?.background || '#0a0511'};
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-shadow: none;
  white-space: nowrap;
  align-self: flex-start;
  position: relative;
  z-index: 2;
  box-shadow: ${({ $colorScheme }) => $colorScheme?.effects?.glow || '0 4px 15px rgba(212, 165, 116, 0.3)'};
  animation: ${romanticPulse} 4s ease-in-out infinite;
  
  @media (min-width: 640px) {
    font-size: 0.8rem;
    padding: 0.3rem 0.8rem;
    margin-right: 0;
    flex-shrink: 0;
  }
`;

const ChangeDescription = styled.span<{ $colorScheme?: any }>`
  font-size: 0.9rem;
  line-height: 1.6;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#e8d5c4'};
  flex: 1;
  position: relative;
  z-index: 2;
  font-weight: 500;
  opacity: 0.95;
  
  @media (min-width: 640px) {
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const Subtitle = styled.p<{ $colorScheme?: any }>`
  text-align: center;
  font-size: 1rem;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#e8d5c4'};
  margin-bottom: 2rem;
  padding: 0 1rem;
  line-height: 1.5;
  font-style: italic;
  opacity: 0.9;
  position: relative;
  z-index: 2;
  
  @media (min-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 3rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    padding: 0;
  }
`;

// Types for changelog data
interface ChangelogEntry {
  version: string;
  date: string;
  description: string;
}

const changelogData: ChangelogEntry[] = [
  {
    version: "v3.5.1",
    date: "2025-09-25",
    description: "Major performance optimization update with comprehensive speed enhancements across the entire platform. Implemented advanced service worker caching system, component preloading, critical asset preloading, and route transition optimizations. Added intelligent caching for game assets, automatic component preloading for commonly visited pages, and smooth route transitions to eliminate blank screens. Enhanced build compression with gzip/brotli compression for all assets over 1KB, optimized Vite configuration with chunk splitting and tree shaking, and implemented performance monitoring with memory usage detection and frame rate optimization."
  },
  {
    version: "v3.5.0",
    date: "2025-09-22",
    description: "Comprehensive BPS (Basis Points) system updates across all gaming components with enhanced precision and accuracy. Implemented standardized BPS calculations, improved wager validation systems, and optimized multiplier calculations. Major theme system overhaul with advanced theme awareness functions and comprehensive 3D game infrastructure foundation. Implemented next-generation theming capabilities with dynamic color scheme management, sophisticated visual effects, and preparation for immersive 3D gaming experiences."
  },
  {
    version: "v3.4.9",
    date: "2025-09-21",
    description: "Enhanced theme system with improved color scheme consistency, refined visual elements, and comprehensive theme configuration updates. Cleaned up development files and updated repository structure for better project organization and security."
  },
  {
    version: "v3.4.8",
    date: "2025-09-20",
    description: "Comprehensive theme settings expansion with multiple theme configuration updates, enhanced color palette management, and improved visual consistency across all platform components."
  },
  {
    version: "v3.4.7",
    date: "2025-09-19",
    description: "Advanced theme customization features with expanded theme settings, improved color scheme options, and enhanced visual personalization capabilities for users."
  },
  {
    version: "v3.4.6",
    date: "2025-09-18",
    description: "Continued theme system enhancements with additional theme configuration options, improved visual design elements, and refined user interface styling."
  },
  {
    version: "v3.4.5",
    date: "2025-09-16",
    description: "System themes modernization with updated visual design language, improved color schemes, and enhanced theme consistency across the platform."
  },
  {
    version: "v3.4.4",
    date: "2025-09-15",
    description: "Enhanced accessibility settings integration across all game pages with improved user interface options, better navigation support, and comprehensive accessibility features for inclusive gaming experience."
  },
  {
    version: "v3.4.3",
    date: "2025-09-15",
    description: "Advanced game auditing system improvements with enhanced fairness verification, comprehensive audit reporting, and optimized repository structure through selective script management and security enhancements."
  },
  {
    version: "v3.4.2",
    date: "2025-09-15",
    description: "Enhanced game auditing system with comprehensive fairness verification tools and improved audit reporting functionality. Streamlined repository management by removing unnecessary scripts and optimizing build processes for better performance and security."
  },
  {
    version: "v3.4.1",
    date: "2025-09-15",
    description: "Continued accessibility improvements with refined keyboard navigation patterns, enhanced screen reader compatibility, and improved visual accessibility features across all game interfaces."
  },
  {
    version: "v3.4.0",
    date: "2025-09-14",
    description: "Major accessibility framework implementation with comprehensive support for diverse user needs including motor disabilities, visual impairments, and cognitive accessibility enhancements across the entire gaming platform."
  },
  {
    version: "v3.3.9",
    date: "2025-09-14",
    description: "Advanced accessibility settings integration with granular control options, customizable interface elements, and adaptive gaming features for inclusive user experience design."
  },
  {
    version: "v3.3.8",
    date: "2025-09-14",
    description: "Comprehensive colorScheme system redesign with modernized color palettes, improved contrast ratios, enhanced typography scaling, and sophisticated visual hierarchy for better user interface consistency."
  },
  {
    version: "v3.3.7",
    date: "2025-09-13",
    description: "Enhanced colorScheme architecture with dynamic theming capabilities, improved CSS variable management, and streamlined styling framework for consistent visual experience across all platform components."
  },
  {
    version: "v3.3.6",
    date: "2025-09-08",
    description: "Enhanced colorScheme consistency across dashboard components with refined visual elements, improved emoji rendering, and polished user interface styling for Terms, AboutMe, and Whitepaper sections."
  },
  {
    version: "v3.3.5",
    date: "2025-09-07",
    description: "Enhanced wagering system with improved constants configuration, updated dashboard wagering display logic, and refined fairness audit components. Implemented comprehensive wagering parameter updates across platform components for better user experience and system reliability."
  },
  {
    version: "v3.3.4",
    date: "2025-09-07",
    description: "Implemented comprehensive dynamic multiplier system across all games. Replaced hardcoded multiplier values with dynamic calculations from rtpConfig, ensuring all wager limits are based on actual game mechanics. Updated Mines, PlinkoRace, BlackJack, MultiPoker, HiLo, and Flip games with sophisticated multiplier calculations that consider all possible game states and configurations."
  },
  {
    version: "v3.3.3",
    date: "2025-09-07",
    description: "Enhanced wager validation system with dynamic maximum multiplier calculations. All games now use their respective rtpConfig bet arrays to determine accurate wager limits, preventing payouts that exceed pool limits while maintaining realistic gameplay parameters."
  },
  {
    version: "v3.3.2",
    date: "2025-09-07",
    description: "Updated platform logo assets across the application with new branding design. Improved logo rendering and consistency throughout the user interface for better brand recognition and visual cohesion."
  },
  {
    version: "v3.3.1",
    date: "2025-09-07",
    description: "Refined logo integration and branding elements across all platform components. Enhanced visual consistency and brand presentation throughout the application interface."
  },
  {
    version: "v3.3.0",
    date: "2025-09-07",
    description: "Major logo and branding update with new visual identity implementation. Updated all logo assets, favicon, and branding elements to reflect the platform's evolved visual design language."
  },
  {
    version: "v3.2.9",
    date: "2025-09-07",
    description: "Comprehensive Slots UI overhaul with enhanced user profile layout improvements. Modernized interface design with better responsive layouts, improved visual hierarchy, and enhanced user experience across desktop and mobile devices."
  },
  {
    version: "v3.2.8",
    date: "2025-09-07",
    description: "Updated Slots game with enhanced error handling and comprehensive debugging system. Improved visual effects with screen shake, particle bursts, and win/lose flash animations. Added better state management and error recovery mechanisms for robust gameplay."
  },
  {
    version: "v3.2.7",
    date: "2025-09-07", 
    description: "Enhanced user profile layout with improved responsive design and better visual hierarchy. Updated Slots UI components with modern styling and optimized rendering performance across all device types."
  },
  {
    version: "v3.2.6",
    date: "2025-09-07",
    description: "Implemented automated changelog generation system with comprehensive script that analyzes git history and creates human-readable release notes, plus updated core package dependencies for improved security and performance"
  },
  {
    version: "v3.2.5",
    date: "2025-09-06",
    description: "Refined MultiPoker card component with enhanced visual styling, improved hover effects, and better card positioning animations for a more immersive poker experience"
  },
  {
    version: "v3.2.4",
    date: "2025-09-06",
    description: "Optimized card graphics with advanced image compression techniques to reduce load times while maintaining visual quality, and updated card texture rendering for sharper display"
  },
  {
    version: "v3.2.3",
    date: "2025-09-06",
    description: "Enhanced card positioning system across poker games with precise alignment algorithms and improved visual consistency between BlackJack and MultiPoker components"
  },
  {
    version: "v3.2.2",
    date: "2025-09-06",
    description: "Updated poker card image rendering engine with higher resolution textures and improved anti-aliasing for crisp card graphics on all display types"
  },
  {
    version: "v3.2.1",
    date: "2025-09-06",
    description: "Standardized card component architecture between BlackJack and MultiPoker games, ensuring consistent behavior, styling, and performance across all card-based games"
  },
  {
    version: "v3.2.0",
    date: "2025-09-06",
    description: "Introduced new high-quality card graphics assets with professional casino-style design and enhanced BlackJack card components with improved animations and visual effects"
  },
  {
    version: "v3.1.9",
    date: "2025-09-06",
    description: "Added official platform logo assets with multiple resolutions and enhanced MultiPoker card rendering system with better shadow effects and card flip animations"
  },
  {
    version: "v3.1.8",
    date: "2025-09-06",
    description: "Major admin system refactoring that removed deprecated API endpoints, streamlined administrative functions, and cleaned up unused modules to improve system performance and maintainability"
  },
  {
    version: "v3.1.7",
    date: "2025-09-06",
    description: "Enhanced admin dashboard with improved data management capabilities, better performance monitoring tools, and streamlined user interface for more efficient platform administration"
  },
  {
    version: "v3.1.6",
    date: "2025-09-06",
    description: "Removed legacy analytics and content management modules from admin system to simplify architecture and eliminate security vulnerabilities in unused code paths"
  },
  {
    version: "v3.1.5",
    date: "2025-09-06",
    description: "Implemented comprehensive analytics suite with real-time data tracking, advanced content management system, and powerful administrative APIs for platform monitoring and control"
  },
  {
    version: "v3.1.4",
    date: "2025-09-06",
    description: "Deployed advanced administrative toolkit featuring user blacklist management, game configuration controls, jackpot monitoring, transaction oversight, and wallet management capabilities"
  },
  {
    version: "v3.1.3",
    date: "2025-09-06",
    description: "Redesigned admin interface with modern UI components, improved navigation structure, enhanced data visualization, and streamlined workflow for efficient platform management"
  },
  {
    version: "v3.1.2",
    date: "2025-09-06",
    description: "Created comprehensive administrative documentation system with detailed API command reference and expanded platform management capabilities for system operators"
  },
  {
    version: "v3.1.1",
    date: "2025-09-06",
    description: "Improved admin dashboard layout with better responsive design, added new management features for user oversight, and enhanced system monitoring capabilities"
  },
  {
    version: "v3.1.0",
    date: "2025-09-06",
    description: "Enhanced admin page configuration with updated platform constants, improved sidebar navigation structure, and better integration with main application architecture"
  },
  {
    version: "v3.0.9",
    date: "2025-09-06",
    description: "Launched comprehensive admin control center with advanced management tools, system monitoring capabilities, and secure access controls for platform administrators"
  },
  {
    version: "v3.0.8",
    date: "2025-09-05",
    description: "Completely overhauled slots game interface with modernized UI components, improved game flow mechanics, enhanced visual feedback, and optimized user interaction patterns"
  },
  {
    version: "v3.0.7",
    date: "2025-09-05",
    description: "Enhanced slots game visual presentation with new UI components, improved animation timing, better color schemes, and more engaging visual effects for premium casino experience"
  },
  {
    version: "v3.0.6",
    date: "2025-09-05",
    description: "Implemented responsive design system for slots game ensuring perfect display and functionality across all device sizes, from mobile phones to desktop computers"
  },
  {
    version: "v3.0.5",
    date: "2025-09-05",
    description: "Integrated comprehensive audio system for slots game featuring dynamic sound effects, background music, win celebrations, and customizable audio settings for immersive gameplay"
  },
  {
    version: "v3.0.4",
    date: "2025-09-05",
    description: "Implemented low network mode support with optimized data usage, reduced bandwidth requirements, and graceful degradation for users with slower internet connections"
  },
  {
    version: "v3.0.3",
    date: "2025-09-05",
    description: "Enhanced network connectivity monitoring with real-time connection status, automatic retry mechanisms, and improved error handling for unstable network conditions"
  },
  {
    version: "v3.0.2",
    date: "2025-09-04",
    description: "Optimized slots game performance with advanced rendering techniques, memory management improvements, and reduced CPU usage for smoother gameplay on all devices"
  },
  {
    version: "v3.0.1",
    date: "2025-09-04",
    description: "Developed sophisticated visual effects system for slots game including particle effects, smooth transitions, dynamic lighting, and engaging animation sequences"
  },
  {
    version: "v3.0.0",
    date: "2025-09-04",
    description: "Improved slots game state management with better data flow, enhanced user experience patterns, and more intuitive game controls for seamless player interaction"
  },
  {
    version: "v2.9.8",
    date: "2025-09-04",
    description: "Added extensive configuration options for slots game including customizable bet amounts, payline settings, auto-play features, and personalized game preferences"
  },
  {
    version: "v2.9.7",
    date: "2025-09-04",
    description: "Enhanced slots game graphics with high-resolution symbols, improved visual clarity, better color depth, and premium casino-quality artwork for authentic gaming experience"
  },
  {
    version: "v2.9.6",
    date: "2025-09-04",
    description: "Integrated slots game with platform's wallet system and transaction processing, enabling seamless deposits, withdrawals, and real-time balance updates during gameplay"
  },
  {
    version: "v2.9.5",
    date: "2025-09-04",
    description: "Implemented comprehensive slots game audio system with high-quality sound effects, dynamic music tracks, and immersive audio feedback for all game actions"
  },
  {
    version: "v2.9.4",
    date: "2025-09-04",
    description: "Completed full slots game implementation with robust architecture, modular component system, and comprehensive styling framework for maintainable and scalable code"
  },
  {
    version: "v2.9.3",
    date: "2025-09-03",
    description: "Enhanced PlinkoRace scoreboard with real-time score tracking, improved visual design, better data organization, and enhanced user experience for competitive gaming"
  },
  {
    version: "v2.9.2",
    date: "2025-09-03",
    description: "Updated PlinkoRace scoreboard styling with modern design elements, improved typography, better color schemes, and enhanced layout structure for optimal readability"
  },
  {
    version: "v2.9.1",
    date: "2025-09-03",
    description: "Implemented responsive design features for PlinkoRace scoreboard ensuring perfect display across all screen sizes with adaptive layouts and flexible components"
  },
  {
    version: "v2.9.0",
    date: "2025-09-03",
    description: "Improved PlinkoRace scoreboard data presentation with better formatting, enhanced visualization, clearer statistics display, and more intuitive information hierarchy"
  },
  {
    version: "v2.8.8",
    date: "2025-09-02",
    description: "Implemented comprehensive accessibility features including screen reader support, keyboard navigation, high contrast modes, and customizable interface options for inclusive gaming"
  },
  {
    version: "v2.8.7",
    date: "2025-09-02",
    description: "Created dedicated accessibility settings panel with granular controls for visual impairments, motor disabilities, and cognitive accessibility enhancements"
  },
  {
    version: "v2.8.6",
    date: "2025-09-01",
    description: "Enhanced slots game mechanics with improved random number generation, better payout algorithms, optimized performance, and more engaging gameplay patterns"
  },
  {
    version: "v2.8.5",
    date: "2025-09-01",
    description: "Updated game selection interface with improved navigation, better game categorization, enhanced search functionality, and more intuitive user experience design"
  },
  {
    version: "v2.8.4",
    date: "2025-08-31",
    description: "Implemented advanced cache management system with intelligent data caching, API response optimization, reduced server load, and improved application performance"
  },
  {
    version: "v2.8.3",
    date: "2025-08-31",
    description: "Improved caching strategies with smarter cache invalidation, better memory management, optimized cache hit rates, and enhanced application responsiveness"
  },
  {
    version: "v2.8.2",
    date: "2025-08-30",
    description: "Established tournament system foundation with competitive gaming infrastructure, ranking algorithms, prize distribution mechanisms, and comprehensive tournament management"
  },
  {
    version: "v2.8.1",
    date: "2025-08-30",
    description: "Enhanced tournament interface with advanced leaderboard functionality, real-time ranking updates, player statistics tracking, and competitive gaming features"
  },
  {
    version: "v2.8.0",
    date: "2025-08-29",
    description: "Implemented sophisticated tournament mechanics with advanced scoring algorithms, fair play systems, tournament bracket management, and comprehensive competition framework"
  },
  {
    version: "v2.7.9",
    date: "2025-08-29",
    description: "Added comprehensive tournament components with lobby systems, player matching, tournament creation tools, and enhanced competitive gaming infrastructure"
  },
  {
    version: "v2.7.8",
    date: "2025-08-28",
    description: "Enhanced user profile system with tournament history tracking, detailed performance statistics, achievement systems, and comprehensive player analytics dashboard"
  },
  {
    version: "v2.7.7",
    date: "2025-08-28",
    description: "Improved user interface consistency across tournament components with unified design language, standardized interactions, and cohesive visual experience"
  },
  {
    version: "v2.7.6",
    date: "2025-08-27",
    description: "Implemented tournament lobby system with advanced multiplayer matchmaking, skill-based pairing, real-time player management, and comprehensive tournament organization"
  },
  {
    version: "v2.7.5",
    date: "2025-08-27",
    description: "Enhanced tournament creation and management tools with flexible tournament formats, customizable rules, prize configuration, and comprehensive administrative controls"
  },
  {
    version: "v2.7.4",
    date: "2025-08-26",
    description: "Launched comprehensive tournament system with full competitive gaming functionality, advanced tournament mechanics, and complete multiplayer infrastructure"
  },
  {
    version: "v2.7.3",
    date: "2025-08-26",
    description: "Added professional tournament graphics and visual enhancements with custom artwork, tournament branding, enhanced UI elements, and premium visual design"
  },
  {
    version: "v2.7.2",
    date: "2025-08-25",
    description: "Enhanced game screen frame components with improved UI consistency, better responsive design, unified styling framework, and optimized component architecture"
  },
  {
    version: "v2.7.1",
    date: "2025-08-25",
    description: "Updated toast notification system with sophisticated styling, smooth animations, better positioning, and enhanced user feedback mechanisms for improved UX"
  },
  {
    version: "v2.7.0",
    date: "2025-08-24",
    description: "Improved toast system integration across all game components with consistent behavior, unified styling, and seamless user notification experience"
  },
  {
    version: "v2.6.9",
    date: "2025-08-24",
    description: "Enhanced error handling and user feedback mechanisms with better error messages, graceful failure recovery, and improved user guidance during issues"
  },
  {
    version: "v2.6.8",
    date: "2025-08-23",
    description: "Updated slots game with sophisticated toast notification integration, improved user feedback systems, and enhanced communication of game events and status"
  },
  {
    version: "v2.6.7",
    date: "2025-08-23",
    description: "Enhanced toast system styling with premium visual design, smooth animations, better typography, and improved visual hierarchy for professional user experience"
  },
  {
    version: "v2.6.6",
    date: "2025-08-23",
    description: "Integrated comprehensive toast notification system across all games with unified messaging, consistent styling, error handling, and seamless user communication"
  },
  {
    version: "v2.6.5",
    date: "2025-08-22",
    description: "Enhanced share modal functionality with improved social sharing capabilities, better UI design, streamlined sharing process, and enhanced user engagement features"
  },
  {
    version: "v2.6.4",
    date: "2025-08-22",
    description: "Improved mobile UI/UX design with responsive layout optimization, touch-friendly controls, better mobile navigation, and enhanced mobile gaming experience"
  },
  {
    version: "v2.6.3",
    date: "2025-08-22",
    description: "Updated platform view components with simplified and more intuitive user interface, streamlined navigation, and improved user experience design"
  },
  {
    version: "v2.6.2",
    date: "2025-08-21",
    description: "Enhanced roulette game mechanics with realistic physics simulation, improved wheel dynamics, better ball movement, and authentic casino gameplay experience"
  },
  {
    version: "v2.6.1",
    date: "2025-08-21",
    description: "Implemented sophisticated roulette chip system with realistic betting mechanics, chip animations, betting interface improvements, and authentic casino betting experience"
  },
  {
    version: "v2.6.0",
    date: "2025-08-21",
    description: "Launched complete roulette game with advanced physics engine, realistic animations, authentic casino mechanics, and comprehensive game architecture"
  },
  {
    version: "v2.5.9",
    date: "2025-08-20",
    description: "Integrated comprehensive referral system with token selection integration, user profile management, reward tracking, and social sharing capabilities for user growth"
  },
  {
    version: "v2.5.8",
    date: "2025-08-20",
    description: "Enhanced chat system with improved styling, better message interface design, real-time communication features, and enhanced social interaction capabilities"
  },
  {
    version: "v2.5.7",
    date: "2025-08-20",
    description: "Fixed critical share modal redirect functionality and navigation issues, improving user flow and ensuring seamless sharing experience across the platform"
  },
  {
    version: "v2.5.6",
    date: "2025-08-20",
    description: "Updated Plinko game with advanced physics engine, improved ball dynamics, better collision detection, and enhanced gameplay mechanics for realistic experience"
  },
  {
    version: "v2.5.5",
    date: "2025-08-20",
    description: "Enhanced ticker tape component with optimized performance, smoother animations, better visual effects, and improved information display for real-time updates"
  },
  {
    version: "v2.5.4",
    date: "2025-08-20",
    description: "Removed sensitive environment configuration files from repository for enhanced security, protecting API keys and sensitive platform configuration data"
  },
  {
    version: "v2.5.3",
    date: "2025-08-20",
    description: "Implemented comprehensive DNS propagation monitoring system with server health checks, uptime monitoring, and real-time status reporting for platform reliability"
  },
  {
    version: "v2.5.2",
    date: "2025-08-20",
    description: "Enhanced security protocols with improved authentication mechanisms, session management upgrades, and comprehensive security audit implementation for better user protection"
  },
  {
    version: "v2.5.1",
    date: "2025-08-20",
    description: "Optimized database performance with query improvements, connection pooling enhancements, and caching layer optimizations for faster response times"
  },
  {
    version: "v2.5.0",
    date: "2025-08-20",
    description: "Launched comprehensive user analytics dashboard with detailed statistics, performance metrics, and behavioral insights for enhanced user experience monitoring"
  },
  {
    version: "v2.4.9",
    date: "2025-08-20",
    description: "Improved API rate limiting with dynamic threshold adjustments, intelligent traffic management, and enhanced protection against abuse and spam"
  },
  {
    version: "v2.4.8",
    date: "2025-08-20",
    description: "Enhanced mobile responsiveness across all game interfaces with touch optimization, gesture controls, and improved layout adaptation for various screen sizes"
  },
  {
    version: "v2.4.7",
    date: "2025-08-20",
    description: "Implemented advanced error tracking and logging system with detailed error reporting, crash analytics, and automated issue detection for improved debugging"
  },
  {
    version: "v2.4.6",
    date: "2025-08-20",
    description: "Updated payment processing system with enhanced transaction security, multi-currency support, and streamlined checkout flow for better user experience"
  },
  {
    version: "v2.4.5",
    date: "2025-08-20",
    description: "Enhanced notification system with real-time alerts, push notification support, and customizable notification preferences for improved user engagement"
  },
  {
    version: "v2.4.4",
    date: "2025-08-20",
    description: "Improved search functionality with advanced filtering options, fuzzy search capabilities, and enhanced result ranking for better content discovery"
  },
  {
    version: "v2.4.3",
    date: "2025-08-20",
    description: "Enhanced user profile management with avatar upload, preference settings, gaming history tracking, and social features integration"
  },
  {
    version: "v2.4.2",
    date: "2025-08-20",
    description: "Implemented comprehensive backup and recovery system with automated data backups, disaster recovery protocols, and data integrity verification"
  },
  {
    version: "v2.4.1",
    date: "2025-08-20",
    description: "Updated localization system with multi-language support, regional customization, and cultural adaptation for global user accessibility"
  },
  {
    version: "v2.4.0",
    date: "2025-08-20",
    description: "Launched social features framework with friend systems, leaderboards, achievements, and community interaction tools for enhanced social gaming experience"
  },
  {
    version: "v2.3.9",
    date: "2025-08-20",
    description: "Enhanced game loading performance with asset preloading, lazy loading optimization, and progressive download strategies for faster game startup times"
  },
  {
    version: "v2.3.8",
    date: "2025-08-20",
    description: "Improved cross-platform compatibility with enhanced browser support, device-specific optimizations, and consistent user experience across all platforms"
  },
  {
    version: "v2.3.7",
    date: "2025-08-20",
    description: "Enhanced data visualization with advanced charts, real-time graphs, and interactive dashboards for better insights and analytics presentation"
  },
  {
    version: "v2.3.6",
    date: "2025-08-20",
    description: "Implemented advanced fraud detection system with machine learning algorithms, behavioral analysis, and automated risk assessment for enhanced security"
  },
  {
    version: "v2.3.5",
    date: "2025-08-20",
    description: "Enhanced content delivery network integration with global edge caching, optimized asset distribution, and improved loading speeds worldwide"
  },
  {
    version: "v2.3.4",
    date: "2025-08-20",
    description: "Improved user onboarding experience with interactive tutorials, guided tours, and progressive feature introduction for better user adoption"
  },
  {
    version: "v2.3.3",
    date: "2025-08-20",
    description: "Enhanced API documentation with interactive examples, comprehensive guides, and developer-friendly tools for easier integration and development"
  },
  {
    version: "v2.3.2",
    date: "2025-08-20",
    description: "Implemented advanced session management with secure token handling, session persistence, and automatic session recovery for improved user experience"
  },
  {
    version: "v2.3.1",
    date: "2025-08-20",
    description: "Enhanced customer support system with live chat integration, ticket management, and automated response capabilities for better user assistance"
  },
  {
    version: "v2.3.0",
    date: "2025-08-20",
    description: "Launched comprehensive audit trail system with detailed logging, compliance reporting, and regulatory adherence tools for transparency and accountability"
  },
  {
    version: "v2.2.9",
    date: "2025-08-20",
    description: "Enhanced game balance algorithms with dynamic difficulty adjustment, fair play mechanisms, and improved random number generation for optimal gaming experience"
  },
  {
    version: "v2.2.8",
    date: "2025-08-20",
    description: "Improved infrastructure monitoring with advanced metrics collection, performance alerting, and automated scaling capabilities for better system reliability"
  },
  {
    version: "v2.2.7",
    date: "2025-08-20",
    description: "Enhanced user interface consistency with unified design system, standardized components, and improved accessibility features across all platform elements"
  },
  {
    version: "v2.2.6",
    date: "2025-08-20",
    description: "Implemented advanced configuration management with environment-specific settings, feature flags, and dynamic configuration updates for flexible deployment"
  },
  {
    version: "v2.2.5",
    date: "2025-08-20",
    description: "Enhanced testing framework with automated test suites, continuous integration, and comprehensive coverage reporting for improved code quality"
  },
  {
    version: "v2.2.4",
    date: "2025-08-20",
    description: "Improved data synchronization with real-time updates, conflict resolution, and offline support for seamless cross-device experience"
  },
  {
    version: "v2.2.3",
    date: "2025-08-20",
    description: "Enhanced performance monitoring with detailed metrics tracking, bottleneck identification, and optimization recommendations for better system performance"
  },
  {
    version: "v2.2.2",
    date: "2025-08-20",
    description: "Implemented advanced email system with template management, automated campaigns, and delivery optimization for better communication capabilities"
  },
  {
    version: "v2.2.1",
    date: "2025-08-20",
    description: "Enhanced file management system with secure upload, compression, and organization tools for better asset handling and storage efficiency"
  },
  {
    version: "v2.2.0",
    date: "2025-08-20",
    description: "Launched comprehensive webhook system with event-driven architecture, real-time notifications, and third-party integration capabilities for enhanced connectivity"
  },
  {
    version: "v2.1.9",
    date: "2025-08-20",
    description: "Enhanced middleware architecture with improved request processing, response caching, and authentication layers for better API performance and security"
  },
  {
    version: "v2.1.8",
    date: "2025-08-20",
    description: "Improved database schema with optimized indexing, query performance enhancements, and data relationship improvements for faster data operations"
  },
  {
    version: "v2.1.7",
    date: "2025-08-20",
    description: "Enhanced logging system with structured logging, log aggregation, and advanced filtering capabilities for better debugging and monitoring"
  },
  {
    version: "v2.1.6",
    date: "2025-08-20",
    description: "Implemented advanced health check system with service monitoring, dependency tracking, and automated recovery mechanisms for improved system reliability"
  },
  {
    version: "v2.1.5",
    date: "2025-08-20",
    description: "Enhanced deployment pipeline with automated testing, staging environments, and rollback capabilities for safer and more efficient releases"
  },
  {
    version: "v2.1.4",
    date: "2025-08-20",
    description: "Improved error handling with graceful degradation, user-friendly error messages, and automated error recovery for better user experience"
  },
  {
    version: "v2.1.3",
    date: "2025-08-20",
    description: "Enhanced code organization with modular architecture, improved dependency management, and better separation of concerns for maintainable codebase"
  },
  {
    version: "v2.1.2",
    date: "2025-08-20",
    description: "Implemented advanced validation system with client-side and server-side validation, data sanitization, and security checks for robust data integrity"
  },
  {
    version: "v2.1.1",
    date: "2025-08-20",
    description: "Enhanced documentation system with automated generation, interactive examples, and comprehensive API references for better developer experience"
  },
  {
    version: "v2.1.0",
    date: "2025-08-20",
    description: "Launched microservices architecture with service isolation, independent scaling, and improved fault tolerance for better system architecture and reliability"
  },
  {
    version: "v2.0.9",
    date: "2025-08-20",
    description: "Enhanced configuration management with centralized settings, environment variables, and secure credential storage for better deployment flexibility"
  },
  {
    version: "v2.0.8",
    date: "2025-08-20",
    description: "Improved asset optimization with image compression, minification, and bundling strategies for better performance and reduced bandwidth usage"
  },
  {
    version: "v2.0.7",
    date: "2025-08-20",
    description: "Enhanced security framework with encryption improvements, secure headers, and vulnerability scanning for comprehensive security protection"
  },
  {
    version: "v2.0.6",
    date: "2025-08-20",
    description: "Implemented advanced routing system with dynamic routes, middleware support, and improved navigation for better user experience and SEO"
  },
  {
    version: "v2.0.5",
    date: "2025-08-20",
    description: "Enhanced state management with predictable state updates, time-travel debugging, and improved performance for better application reliability"
  },
  {
    version: "v2.0.4",
    date: "2025-08-20",
    description: "Improved component architecture with reusable components, props validation, and better composition patterns for maintainable user interface development"
  },
  {
    version: "v2.0.3",
    date: "2025-08-20",
    description: "Enhanced build system with faster compilation, hot module replacement, and optimized development workflow for improved developer productivity"
  },
  {
    version: "v2.0.2",
    date: "2025-08-20",
    description: "Implemented advanced dependency management with version locking, security auditing, and automated updates for better package management and security"
  },
  {
    version: "v2.0.1",
    date: "2025-08-20",
    description: "Enhanced development environment with improved tooling, debugging capabilities, and development server optimizations for better developer experience"
  },
  {
    version: "v2.0.0",
    date: "2025-08-19",
    description: "Major architecture overhaul with modern framework migration, enhanced performance optimizations, and comprehensive platform modernization for next-generation gaming experience"
  },
  {
    version: "v1.0.8",
    date: "2025-08-20",
    description: "Deployed advanced caching system for RPC and API calls with intelligent cache management, reduced server load, and significantly improved application performance"
  },
  {
    version: "v1.0.7",
    date: "2025-08-20",
    description: "Enhanced chat system with real-time messaging capabilities, message persistence, user presence tracking, and comprehensive social communication features"
  },
  {
    version: "v1.0.6",
    date: "2025-08-20",
    description: "Updated environment configuration and core package dependencies with security patches, performance improvements, and latest framework updates"
  },
  {
    version: "v1.0.5",
    date: "2025-08-20",
    description: "Configured PostCSS build system with optimized CSS processing, improved build performance, and enhanced development workflow for better styling capabilities"
  },
  {
    version: "v1.0.4",
    date: "2025-08-20",
    description: "Implemented comprehensive global RTP (Return to Player) configuration system and detailed fairness audit page with transparency tools and verification mechanisms"
  },
  {
    version: "v1.0.3",
    date: "2025-08-19",
    description: "Fixed critical game component references and improved code organization with better module structure and enhanced maintainability for game architecture"
  },
  {
    version: "v1.0.2",
    date: "2025-08-19",
    description: "Added comprehensive environment configuration file with essential platform settings, API configurations, and deployment parameters for production environment"
  },
  {
    version: "v1.0.1",
    date: "2025-08-19",
    description: "Complete platform launch featuring entirely new layout design, comprehensive game suite, advanced casino infrastructure, authentication systems, and full-scale deployment"
  },
  {
    version: "v1.0.0",
    date: "2025-08-19",
    description: "Initial release of DegenCasino platform with foundational gaming infrastructure, basic UI components, and core functionality for casino operations"
  }
];

const ChangelogItemComponent: React.FC<{ entry: ChangelogEntry; colorScheme?: any }> = ({ entry, colorScheme }) => {
  return (
    <ChangelogItem $colorScheme={colorScheme}>
      <ChangelogContent>
        <DateBadge $colorScheme={colorScheme}>{entry.version} - {entry.date}</DateBadge>
        <ChangeDescription $colorScheme={colorScheme}>{entry.description}</ChangeDescription>
      </ChangelogContent>
    </ChangelogItem>
  );
};

export const ChangelogPage: React.FC = () => {
  const { currentColorScheme } = useColorScheme();

  return (
    <ChangelogContainer $colorScheme={currentColorScheme}>
      <Title $colorScheme={currentColorScheme}>🕯️ Chronicles of the Casino Cathedral 🕯️</Title>
      <Subtitle $colorScheme={currentColorScheme}>
        <em>Each entry a verse in our eternal ballad, tracking the romantic evolution of our digital realm where love letters meet code and passion flows through every update.</em>
      </Subtitle>
      
      <ChangelogList>
        {changelogData.map((entry, index) => (
          <ChangelogItemComponent key={index} entry={entry} colorScheme={currentColorScheme} />
        ))}
      </ChangelogList>
    </ChangelogContainer>
  );
};

export default ChangelogPage;
