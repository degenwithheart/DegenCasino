import React from 'react';
import styled, { css } from 'styled-components';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  range: [number, number];
  onChange: (value: number) => void;
  disabled?: boolean;
}

const Container = styled.div`
  position: relative;
  width: 100%;
`;

const Wrapper = styled.div`
  position: relative;
  background: rgba(255, 85, 106, 0.4);
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  height: 15px;
  cursor: pointer;
`;

const Track = styled.div`
  background: #55f275;
  height: 100%;
  border-radius: 10px 0 0 10px;
`;

const StyledSlider = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 100%;
  background: transparent;
  outline: none;
  background: none;
  border-radius: 10px;
  margin: 0;
  padding: 0;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #fff;
    cursor: pointer;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #fff;
    cursor: pointer;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.7);
  }
`;

const Label = styled.div<{$active: boolean}>`
  margin-top: 10px;
  position: absolute;
  transform: translateX(-50%);
  text-align: center;
  background: rgba(50, 41, 67, 0.5);
  padding: 5px;
  border-radius: 10px;
  min-width: 30px;
  color: #ff949f;
  transition: left 0.2s ease;
  font-size: 75%;

  ${(props) =>
    props.$active &&
    css`
      color: #94ff94;
    `}
`;

function Slider({ min: minValue, max: maxValue, value, onChange, disabled, range: [min, max] }: SliderProps) {
  const labels = Array.from({ length: 5 }).map((_, i, arr) => min + Math.floor((i / (arr.length - 1)) * (max - min)));

  const change = (newValue: number) => {
    const fixedValue = Math.max(minValue, Math.min(maxValue, newValue));
    if (fixedValue !== value) onChange(fixedValue);
  };

  return (
    <Container>
      <Wrapper>
        <Track style={{ width: `calc(${(value / max) * 100}%)` }} />
        <StyledSlider
          type="range"
          value={value}
          disabled={disabled}
          min={min}
          max={max}
          onChange={(event) => change(Number(event.target.value))}
        />
      </Wrapper>
      {labels.map((label, i) => (
        <Label key={i} $active={value >= label} style={{ left: `${(label / max) * 100}%` }}>
          {label}
        </Label>
      ))}
    </Container>
  );
}

export default Slider;
