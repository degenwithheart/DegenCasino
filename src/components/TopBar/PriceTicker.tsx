import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { tokenPriceService, TokenPrice } from '../../services/TokenPriceService';
import { useUserStore } from '../../hooks/data/useUserStore';

const Container = styled.div<{ $colorScheme?: any; }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: ${({ $colorScheme }) => $colorScheme?.colors?.surface || 'rgba(255, 255, 255, 0.05)'};
  border-radius: 20px;
  border: 1px solid ${({ $colorScheme }) => $colorScheme?.colors?.border || 'rgba(255, 255, 255, 0.1)'};
  font-size: 14px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'white'};
`;

const Label = styled.span<{ $colorScheme?: any; }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.textSecondary || '#888'};
`;

const Value = styled.span<{ $colorScheme?: any; }>`
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'white'};
  font-weight: 600;
`;

const PriceTicker: React.FC<{ colorScheme: any; }> = ({ colorScheme }) => {
    const [solPrice, setSolPrice] = useState<TokenPrice | null>(null);
    const tickerInterval = useUserStore(s => s.tickerInterval || 15000);
    const backgroundThrottle = useUserStore(s => !!s.backgroundThrottle);

    useEffect(() => {
        const updatePrice = async () => {
            // Get SOL price (assuming SOL mint is known)
            const solMint = 'So11111111111111111111111111111111111111112'; // SOL mint
            const price = await tokenPriceService.getTokenPrice(solMint);
            setSolPrice(price);
        };

        updatePrice();

        if (tickerInterval > 0) {
            const interval = setInterval(() => {
                if (!backgroundThrottle || document.visibilityState === 'visible') {
                    updatePrice();
                }
            }, tickerInterval);
            return () => clearInterval(interval);
        }
    }, [tickerInterval, backgroundThrottle]);

    if (!solPrice || tickerInterval === 0) return null;

    return (
        <Container $colorScheme={colorScheme}>
            <Label $colorScheme={colorScheme}>SOL</Label>
            <Value $colorScheme={colorScheme}>${solPrice.currentPrice.toFixed(2)}</Value>
        </Container>
    );
};

export default PriceTicker;