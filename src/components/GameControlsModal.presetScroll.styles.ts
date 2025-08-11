import styled from 'styled-components'

export const PresetScroll = styled.div<{ $isMobile: boolean }>`
  display: flex;
  flex-wrap: ${({ $isMobile }) => ($isMobile ? 'nowrap' : 'wrap')};
  gap: 12px;
  justify-content: ${({ $isMobile }) => ($isMobile ? 'flex-start' : 'center')};
  width: 100%;
  margin: 0 0 8px 0;
  overflow-x: ${({ $isMobile }) => ($isMobile ? 'auto' : 'visible')};
  -webkit-overflow-scrolling: touch;
  padding-bottom: ${({ $isMobile }) => ($isMobile ? '8px' : '0')};

  /* Custom scrollbar styling for mobile */
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.1) transparent;
`
