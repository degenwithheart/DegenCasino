import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../../themes/ThemeContext';

// Keyframe animations matching the project style
const moveGradient = keyframes`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const ChangelogContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
  color: white;
  min-height: 100vh;
  
  @media (min-width: 768px) {
    padding: 2rem;
    max-width: 1200px;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc);
  background-size: 300% 100%;
  animation: ${moveGradient} 3s linear infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  
  @media (min-width: 768px) {
    font-size: 3rem;
    margin-bottom: 2rem;
  }
`;

const ChangelogList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ChangelogItem = styled.li`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 215, 0, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 215, 0, 0.15);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #ffd700, #a259ff, #ff00cc);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
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

const DateBadge = styled.span`
  display: inline-block;
  background: linear-gradient(45deg, #a259ff, #ff00cc);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  align-self: flex-start;
  
  @media (min-width: 640px) {
    font-size: 0.8rem;
    padding: 0.3rem 0.8rem;
    margin-right: 0;
    flex-shrink: 0;
  }
`;

const ChangeDescription = styled.span`
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  flex: 1;
  
  @media (min-width: 640px) {
    font-size: 1rem;
    line-height: 1.5;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
  padding: 0 1rem;
  line-height: 1.5;
  
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

const ChangelogItemComponent: React.FC<{ entry: ChangelogEntry }> = ({ entry }) => {
  return (
    <ChangelogItem>
      <ChangelogContent>
        <DateBadge>{entry.version} - {entry.date}</DateBadge>
        <ChangeDescription>{entry.description}</ChangeDescription>
      </ChangelogContent>
    </ChangelogItem>
  );
};

export const ChangelogPage: React.FC = () => {
  const { currentTheme } = useTheme();

  return (
    <ChangelogContainer>
      <Title>📋 Changelog</Title>
      <Subtitle>
        Track all the latest updates, improvements, and new features added to the platform.
      </Subtitle>
      
      <ChangelogList>
        {changelogData.map((entry, index) => (
          <ChangelogItemComponent key={index} entry={entry} />
        ))}
      </ChangelogList>
    </ChangelogContainer>
  );
};

export default ChangelogPage;
