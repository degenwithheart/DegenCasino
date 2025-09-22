import * as React from 'react';
import { Helmet } from 'react-helmet-async';

interface GameSEOProps {
  gameName: string;
  description: string;
  image?: string;
  dynamicTitle?: string;
  rtp?: number;
  maxWin?: string;
}

/**
 * Custom hook for consistent game SEO metadata using React Helmet
 * 
 * @param gameName - The name of the game (e.g., "Dice", "Plinko")
 * @param description - Short description for meta tags
 * @param image - Optional custom image path (defaults to /png/games/{game-name}.png)
 * @param dynamicTitle - Optional dynamic title override
 * @param rtp - Optional Return to Player percentage for enhanced SEO
 * @param maxWin - Optional maximum win amount for enhanced SEO
 * @returns JSX element with Helmet configuration
 */
export const useGameSEO = ({ 
  gameName, 
  description, 
  image, 
  dynamicTitle, 
  rtp, 
  maxWin 
}: GameSEOProps) => {
  const baseTitle = "DegenHeart.casino - Solana On-chain Web3 Casino";
  const title = dynamicTitle || `${gameName} - ${baseTitle}`;
  const gameImage = image || `/png/games/${gameName.toLowerCase().replace(/\s+/g, '-')}.png`;
  
  // Enhanced description with RTP and max win if provided
  const enhancedDescription = [
    description,
    rtp ? `${rtp}% RTP` : 'Provably fair',
    maxWin ? `Max win: ${maxWin}` : 'Instant payouts',
    'Play on Solana blockchain.'
  ].join('. ');

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={enhancedDescription} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={enhancedDescription} />
      <meta property="og:image" content={gameImage} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={enhancedDescription} />
      <meta name="twitter:image" content={gameImage} />
      
      {/* Game-specific structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Game",
          "name": gameName,
          "description": enhancedDescription,
          "image": gameImage,
          "publisher": {
            "@type": "Organization",
            "name": "DegenHeart.casino"
          },
          "gamePlatform": "Web Browser",
          "genre": "Casino Game"
        })}
      </script>
    </Helmet>
  );
};

/**
 * Simple page SEO helper for non-game pages
 */
export const usePageSEO = (pageTitle: string, description: string, image?: string) => {
  const title = `${pageTitle} - DegenHeart.casino`;
  const pageImage = image || '/png/images/casino.png';

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={pageImage} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={pageImage} />
    </Helmet>
  );
};