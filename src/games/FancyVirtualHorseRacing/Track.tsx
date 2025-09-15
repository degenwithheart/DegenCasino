
import React from "react";
import styled from "styled-components";
import { Horse, HorseProps } from "./Horse";

const grass = 'repeating-linear-gradient(90deg, #b3e0a0 0 24px, #a0d080 24px 48px)';
const dirt = 'repeating-linear-gradient(90deg, #e2c290 0 18px, #c2a060 18px 36px)';

const TrackWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, #b3e0ff 0%, #e0f7fa 100%);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 6px 32px #0003;
  border: 5px solid #fff8;
`;

const Lane = styled.div<{ idx: number }>`
  position: absolute;
  left: 0;
  width: 100%;
  height: 90px;
  top: ${({ idx }) => idx * 90}px;
  background: linear-gradient(to bottom, #e2c290 60%, #b3e0a0 100%);
  /* Dirt track in the center, grass on the sides */
  &:before {
    content: '';
    position: absolute;
    left: 12%;
    width: 76%;
    top: 10px;
    height: 70px;
    background: ${dirt};
    border-radius: 18px;
    box-shadow: 0 2px 12px #bfa76a55 inset;
    z-index: 1;
    opacity: 0.95;
  }
  /* Lane separation */
  border-bottom: 3px dashed #bdbdbd;
  z-index: 0;
  opacity: 0.85;
`;

const FinishLine = styled.div<{ idx: number }>`
  position: absolute;
  right: 7%;
  width: 18px;
  height: 70px;
  top: ${({ idx }) => idx * 90 + 10}px;
  background: repeating-linear-gradient(
    180deg,
    #fff 0 10px,
    #222 10px 20px
  );
  border-radius: 6px;
  z-index: 4;
  box-shadow: 0 0 12px #fff8, 0 0 0 3px #ffe06699;
  border: 2px solid #ffe066;
  display: flex;
  align-items: center;
  justify-content: center;
  &:after {
    content: '';
    position: absolute;
    left: 50%;
    top: -8px;
    width: 2px;
    height: 86px;
    background: repeating-linear-gradient(
      0deg,
      #fff 0 8px,
      #222 8px 16px
    );
    border-radius: 2px;
    opacity: 0.7;
    transform: translateX(-50%);
    z-index: 5;
  }
`;

const TrackEdge = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  height: 14px;
  background: linear-gradient(90deg, #7c5e3c 60%, #bfa76a 100%);
  box-shadow: 0 2px 8px #7c5e3c55 inset;
  z-index: 10;
`;

export interface TrackProps {
  horses: HorseProps[];
}

export const Track: React.FC<TrackProps> = ({ horses }) => (
  <TrackWrapper>
    <TrackEdge style={{ top: 0 }} />
    {[0, 1, 2, 3].map((laneIdx) => (
      <Lane key={laneIdx} idx={laneIdx} />
    ))}
    {/* Add subtle shadow for depth */}
    <div style={{
      position: 'absolute',
      left: '12%',
      width: '76%',
      top: 0,
      height: '100%',
      boxShadow: '0 8px 32px #bfa76a33 inset',
      pointerEvents: 'none',
      zIndex: 2,
    }} />
    {horses.map((horse, index) => (
      <React.Fragment key={horse.name}>
        <Horse {...horse} top={index * 90 + 20} />
        <FinishLine idx={index} />
      </React.Fragment>
    ))}
    <TrackEdge style={{ bottom: 0 }} />
  </TrackWrapper>
);
