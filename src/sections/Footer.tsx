import React from 'react'
import * as S from './Footer.styles'
import { FOOTER_LINKS, SIDEBAR_LINKS, MOBILE_FOOTER_LINKS_CONNECTED, MOBILE_FOOTER_LINKS_DISCONNECTED } from '../constants'
import ConnectionStatus from '../components/Connection/ConnectionStatus'
import { useWallet } from '@solana/wallet-adapter-react';
import { useTheme } from '../themes/ThemeContext';

function Footer() {
  const { connected, publicKey } = useWallet();
  const { currentTheme } = useTheme();
  return (
    <>
  <S.StyledFooter $theme={currentTheme}>
  <S.StyledConnectionStatus>
          <ConnectionStatus />
  </S.StyledConnectionStatus>
  <S.FooterLinks $theme={currentTheme}>
          {FOOTER_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} rel="noopener noreferrer">
                {link.title}
              </a>
            </li>
          ))}
  </S.FooterLinks>
  </S.StyledFooter>

    <S.MobileFooter $theme={currentTheme}>
        {(connected ? MOBILE_FOOTER_LINKS_CONNECTED : MOBILE_FOOTER_LINKS_DISCONNECTED).map((link) => {
          // Special handling for Games modal trigger (only available when connected)
          if ('label' in link && link.label === 'Games') {
            return (
              <S.MobileFooterButton
                key={link.title}
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('openGamesModal'));
                }}
              >
                {link.title}
              </S.MobileFooterButton>
            );
          }
          
          // Regular navigation links
          const href = typeof link.href === 'string' && link.href.includes('${base58}') 
            ? link.href.replace('${base58}', publicKey?.toBase58() || '') 
            : link.href;
            
          return (
            <S.MobileFooterLink
              key={link.title}
              href={href}
              rel="noopener noreferrer"
            >
              {link.title}
            </S.MobileFooterLink>
          );
        })}
  </S.MobileFooter>
    </>
  );
}

export default Footer;
