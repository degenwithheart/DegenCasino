
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SIDEBAR_LINKS } from '../../constants';
import { useWallet } from '@solana/wallet-adapter-react';
import styled, { css } from 'styled-components';
import { useColorScheme } from '../../themes/ColorSchemeContext';

const SIDEBAR_WIDTH = 80;

const SidebarContainer = styled.nav<{ $colorScheme?: any }>`
	position: fixed;
	top: 0;
	left: 0;
	height: 100vh;
	width: ${SIDEBAR_WIDTH}px;
	background: linear-gradient(
		180deg, 
		rgba(10, 5, 17, 0.95) 0%, 
		rgba(139, 90, 158, 0.15) 50%,
		rgba(10, 5, 17, 0.95) 100%
	);
	backdrop-filter: blur(20px) saturate(1.3);
	border-right: 1px solid rgba(212, 165, 116, 0.2);
	box-shadow: 
		2px 0 16px rgba(10, 5, 17, 0.6),
		2px 0 8px rgba(212, 165, 116, 0.2);
	display: flex;
	flex-direction: column;
	align-items: center;
	z-index: 200;
	
	/* Hide sidebar on tablets and below */
	@media (max-width: 900px) {
		display: none;
	}
`;

const SidebarList = styled.ul`
	list-style: none;
	padding: 0;
	margin: 0;
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
	width: 100%;
`;

const SidebarItem = styled.li<{ $active?: boolean; $colorScheme?: any }>`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	a, button {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem 0;
		width: 100%;
		color: ${({ $active }) => ($active ? 'var(--love-letter-gold)' : 'rgba(212, 165, 116, 0.7)')};
		background: ${({ $active }) => $active ? 
			'linear-gradient(135deg, rgba(212, 165, 116, 0.1) 0%, rgba(184, 51, 106, 0.05) 100%)' : 
			'none'
		};
		border: none;
		font-size: 1rem;
		font-family: 'DM Sans', sans-serif;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		border-radius: ${({ $active }) => $active ? '12px' : '8px'};
		margin: 0 8px;
		backdrop-filter: ${({ $active }) => $active ? 'blur(10px)' : 'none'};
		border: ${({ $active }) => $active ? '1px solid rgba(212, 165, 116, 0.2)' : '1px solid transparent'};
		
		&:hover {
			color: var(--love-letter-gold);
			background: linear-gradient(
				135deg, 
				rgba(212, 165, 116, 0.15) 0%, 
				rgba(184, 51, 106, 0.1) 50%,
				rgba(139, 90, 158, 0.15) 100%
			);
			text-shadow: 0 0 8px rgba(212, 165, 116, 0.6);
			transform: translateX(2px);
			border-color: rgba(212, 165, 116, 0.3);
			backdrop-filter: blur(10px);
		}
		
		svg {
			font-size: 1.5rem;
			margin-bottom: 0.3rem;
			filter: drop-shadow(0 0 4px rgba(212, 165, 116, 0.3));
		}
	}
`;

const CasinoLogo = styled.div<{ $colorScheme?: any }>`
	margin: 2rem 0 2.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	
	img {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		border: 2px solid rgba(212, 165, 116, 0.5);
		box-shadow: 
			0 0 16px rgba(212, 165, 116, 0.4),
			0 4px 8px rgba(10, 5, 17, 0.3);
		background: linear-gradient(
			135deg,
			rgba(212, 165, 116, 0.1) 0%,
			rgba(184, 51, 106, 0.05) 100%
		);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		filter: contrast(1.1) brightness(1.05);
		
		&:hover {
			transform: scale(1.1) rotate(5deg);
			box-shadow: 
				0 0 20px rgba(212, 165, 116, 0.6),
				0 6px 12px rgba(10, 5, 17, 0.4);
			border-color: rgba(212, 165, 116, 0.7);
		}
	}
`;

export default function Sidebar() {
	const { connected, publicKey } = useWallet();
	const location = useLocation();
	const { currentColorScheme } = useColorScheme();

	return (
		<SidebarContainer $colorScheme={currentColorScheme}>
			<CasinoLogo $colorScheme={currentColorScheme}>
				<img src="/webp/fakemoney.webp" alt="Casino Logo" />
			</CasinoLogo>
			<SidebarList>
				{SIDEBAR_LINKS.filter(link =>
					typeof link.showWhen === 'function'
						? link.showWhen(connected, publicKey)
						: true
				).map((link, i) => {
					const to =
						typeof link.to === 'function'
							? link.to(publicKey?.toBase58() ?? null)
							: link.to;
					const isActive =
						to && typeof to === 'string'
							? location.pathname === to
							: false;
					if (link.external) {
						return (
							<SidebarItem key={i} $colorScheme={currentColorScheme}>
								<a href={to as string} target="_blank" rel="noopener noreferrer">
									<link.icon />
									<span style={{ fontSize: '0.8rem' }}>{link.label}</span>
								</a>
							</SidebarItem>
						);
					}
					if (link.label === 'Games') {
						// Games button triggers modal, handled in App.tsx context
						return (
							<SidebarItem key={i} $colorScheme={currentColorScheme}>
								<button
									type="button"
									onClick={() => {
										window.dispatchEvent(new CustomEvent('openGamesModal'));
									}}
								>
									<link.icon />
									<span style={{ fontSize: '0.8rem' }}>{link.label}</span>
								</button>
							</SidebarItem>
						);
					}
					return (
						<SidebarItem key={i} $active={isActive} $colorScheme={currentColorScheme}>
							<Link to={to as string}>
								<link.icon />
								<span style={{ fontSize: '0.8rem' }}>{link.label}</span>
							</Link>
						</SidebarItem>
					);
				})}
			</SidebarList>
		</SidebarContainer>
	);
}
