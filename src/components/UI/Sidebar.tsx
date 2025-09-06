
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SIDEBAR_LINKS } from '../../constants';
import { useWallet } from '@solana/wallet-adapter-react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../themes/ThemeContext';

const SIDEBAR_WIDTH = 80;

const SidebarContainer = styled.nav<{ $theme?: any }>`
	position: fixed;
	top: 0;
	left: 0;
	height: 100vh;
	width: ${SIDEBAR_WIDTH}px;
	background: linear-gradient(180deg, ${({ $theme }) => $theme?.colors?.background || '#222'} 0%, ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'} 100%);
	box-shadow: 2px 0 16px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}44;
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

const SidebarItem = styled.li<{ $active?: boolean; $theme?: any }>`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	a, button {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 0.7rem 0;
		width: 100%;
		color: ${({ $active, $theme }) => ($active ? $theme?.colors?.primary || '#ffd700' : $theme?.colors?.text || '#fff')};
		background: none;
		border: none;
		font-size: 1.2rem;
		font-family: 'Luckiest Guy', cursive, sans-serif;
		cursor: pointer;
		transition: color 0.2s;
		&:hover {
			color: ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
			text-shadow: 0 0 8px ${({ $theme }) => $theme?.colors?.secondary || '#a259ff'};
		}
		svg {
			font-size: 1.7rem;
			margin-bottom: 0.2rem;
		}
	}
`;

const CasinoLogo = styled.div<{ $theme?: any }>`
	margin: 1.5rem 0 2rem;
	img {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		border: 2px solid ${({ $theme }) => $theme?.colors?.primary || '#ffd700'};
		box-shadow: 0 0 12px ${({ $theme }) => $theme?.colors?.primary || '#ffd700'}88;
		background: ${({ $theme }) => $theme?.colors?.background || '#fff'};
	}
`;

export default function Sidebar() {
	const { connected, publicKey } = useWallet();
	const location = useLocation();
	const { currentTheme } = useTheme();

	return (
		<SidebarContainer $theme={currentTheme}>
			<CasinoLogo $theme={currentTheme}>
				<img src="/webp/fakemoney.webp" alt="Casino Logo" />
			</CasinoLogo>
			<SidebarList>
				{SIDEBAR_LINKS.filter(link =>
					typeof link.showWhen === 'function'
						? link.showWhen(connected)
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
							<SidebarItem key={i} $theme={currentTheme}>
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
							<SidebarItem key={i} $theme={currentTheme}>
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
						<SidebarItem key={i} $active={isActive} $theme={currentTheme}>
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
