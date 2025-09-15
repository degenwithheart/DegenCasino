import React from 'react';

type CandleProps = {
  index: number;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  minPrice: number;
  maxPrice: number;
};

const Candle: React.FC<CandleProps> = ({
  index,
  open,
  close,
  high,
  low,
  volume,
  minPrice,
  maxPrice,
}) => {
  const candleWidth = 10;
  const chartHeight = 100;
  const priceToY = (price: number) =>
    chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight;

  const x = index * (candleWidth + 4);

  const isRed = close < open;
  const color = isRed ? '#d50000' : '#00c853';

  return (
    <g>
      {/* Wick */}
      <line
        x1={x + candleWidth / 2}
        x2={x + candleWidth / 2}
        y1={priceToY(high)}
        y2={priceToY(low)}
        stroke={color}
        strokeWidth={2}
      />
      {/* Body */}
      <rect
        x={x}
        y={priceToY(Math.max(open, close))}
        width={candleWidth}
        height={Math.max(2, Math.abs(priceToY(open) - priceToY(close)))}
        fill={color}
        rx={2}
      />
    </g>
  );
};

export default Candle;