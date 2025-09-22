import React from 'react';
import styled from 'styled-components';
import { useGameScrollGestures, useDiceScrollGestures, useSlotsScrollGestures } from '../../hooks/ui/useGameScrollGestures';

// Example usage of the scroll system in a component

const ScrollContainer = styled.div`
  height: 400px;
  overflow-y: auto;
  padding: 20px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 20px 0;

  /* Custom styling for demonstration */
  .scroll-item {
    padding: 15px;
    margin: 10px 0;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const ExampleScrollComponent: React.FC = () => {
  // General scroll gestures
  const { containerRef, scrollToTop, scrollToBottom, scrollToElement } = useGameScrollGestures({
    enableHorizontalScroll: true,
    enableSnapScrolling: true,
    preventPullToRefresh: true,
  });

  // Game-specific scroll examples
  const diceScrollRef = useDiceScrollGestures().containerRef;
  const slotsScrollRef = useSlotsScrollGestures().containerRef;

  return (
    <div>
      <h2>Global Scroll System Examples</h2>
      
      <h3>General Game Container</h3>
      <ScrollContainer ref={containerRef} className="game-container">
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className="scroll-item">
            Item {i + 1} - This container has enhanced scroll gestures including:
            <ul>
              <li>Smooth scrolling</li>
              <li>Momentum scrolling on mobile</li>
              <li>Horizontal scroll with Shift+Wheel</li>
              <li>Keyboard navigation</li>
              <li>Custom themed scrollbars</li>
            </ul>
          </div>
        ))}
      </ScrollContainer>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => scrollToTop()}>Scroll to Top</button>
        <button onClick={() => scrollToBottom()}>Scroll to Bottom</button>
        <button onClick={() => scrollToElement('.scroll-item')}>Scroll to First Item</button>
      </div>

      <h3>Dice Game Container (No Snap Scrolling)</h3>
      <ScrollContainer ref={diceScrollRef} className="game-container">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="scroll-item">
            Dice Result {i + 1} - Optimized for fast scrolling without snap behavior
          </div>
        ))}
      </ScrollContainer>

      <h3>Slots Game Container (With Snap Scrolling)</h3>
      <ScrollContainer ref={slotsScrollRef} className="game-container">
        {Array.from({ length: 15 }, (_, i) => (
          <div key={i} className="scroll-item">
            Slot Spin {i + 1} - Enhanced with snap scrolling and horizontal support
          </div>
        ))}
      </ScrollContainer>
    </div>
  );
};

export default ExampleScrollComponent;