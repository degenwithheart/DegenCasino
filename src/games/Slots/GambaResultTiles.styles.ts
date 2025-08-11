import styled from "styled-components";

export const StyledGambaResultTiles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  max-width: 600px;
  width: 100%;

  .title {
    font-size: 12px;
    color: #888;
    text-transform: uppercase;
    font-weight: bold;
    letter-spacing: 1px;
  }

  .tiles-container {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    justify-content: center;
    max-height: 60px;
    overflow-y: auto;
    padding: 2px;
  }

  .tile {
    min-width: 28px;
    height: 20px;
    background: #1a1a2e;
    border: 1px solid #2d2d57;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: bold;
    color: #fff;
    transition: all 0.2s ease;
    padding: 0 4px;
  }

  .tile.zero {
    background: #333;
    color: #666;
  }

  .tile.selected {
    background: #ffec63;
    color: #000;
    border-color: #ffec63;
    box-shadow: 0 0 8px rgba(255, 236, 99, 0.5);
    transform: scale(1.1);
    z-index: 10;
    position: relative;
  }

  .tile:not(.selected):not(.zero) {
    opacity: 0.7;
  }

  .tile.selected::after {
    content: "";
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 6px solid #ffec63;
  }
`
