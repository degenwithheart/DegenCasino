import React from "react";
import styled from "styled-components";

const Layout = styled.div<{ $display?: string }>`
  display: ${props => props.$display || 'flex'};
  width: 100%;
  margin: 0;
  align-items: center;
  justify-content: center;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;


const Right = styled.div`
  flex: 2;
  @media (max-width: 1200px) {
    display: none;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.7);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface GameScreenLayoutProps {
  left: React.ReactNode;
  right?: React.ReactNode;
  display?: string;
  controls?: React.ReactElement | null;
}

export function GameScreenLayout({ left, right, display, controls }: GameScreenLayoutProps) {
  const [showOverlay, setShowOverlay] = React.useState(false);

  // Mobile detection (same as in GameControls)
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1200);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Clone controls and inject openSidebar prop if possible
  let controlsWithSidebar = controls;
  if (controls && right) {
    controlsWithSidebar = React.cloneElement(controls, {
      onOpenSidebar: () => setShowOverlay(true),
    });
  }

  return (
    <Layout $display={display}>
      <Left>
        {left}
        {controlsWithSidebar}
      </Left>
      {/* Only show right as overlay, never inline */}
      {right && showOverlay && (
        <Overlay onClick={() => setShowOverlay(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#181b20', borderRadius: 16, padding: 24, minWidth: 300, maxWidth: '90vw', maxHeight: '90vh', overflow: 'auto' }}>
            <button style={{ float: 'right', fontSize: 22, background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={() => setShowOverlay(false)}>&times;</button>
            {right}
          </div>
        </Overlay>
      )}
    </Layout>
  );
}
