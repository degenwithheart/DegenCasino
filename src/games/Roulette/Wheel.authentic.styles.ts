import styled from 'styled-components'

export const StyledAuthenticalRouletteWheel = styled.div`
  /* CSS Variables for wheel styling */
  --plate-size: 350px;
  --pit-width: 32px;
  --rim-size: 6px;
  --trim-color: #4b2808;
  --trim-secondary: silver;
  --spin-button: green;
  --reset-button: darkgreen;
  --spin-duration: 3s;

  .main {
    width: calc(var(--plate-size) + 24px);
    margin: 0 auto;
    height: 100%;
    min-height: 0;
  }

  .plate {
    background-color: gray;
    width: var(--plate-size);
    height: var(--plate-size);
    margin: calc(var(--rim-size) * 2);
    border-radius: 50%;
    position: relative;
    animation: rotate 24s infinite linear;
  }

  .plate::after,
  .plate::before {
    content: "";
    display: block;
    position: absolute;
    border-radius: 50%;
  }

  .plate::after {
    top: calc(-1 * var(--rim-size));
    right: calc(-1 * var(--rim-size));
    bottom: calc(-1 * var(--rim-size));
    left: calc(-1 * var(--rim-size));
    border: var(--rim-size) solid var(--trim-color);
    box-shadow: inset 0px 0px 0px calc(var(--rim-size) / 3) #b8860b,
      0px 0px 0px calc(var(--rim-size) / 3) #ffd700;
  }

  .plate::before {
    background: rgba(0, 0, 0, 0.65);
    border: 1px solid var(--trim-secondary);
    box-shadow: inset 0px 0px 0px 2px #404040;
    top: 12%;
    left: 12%;
    right: 12%;
    bottom: 12%;
    z-index: 1;
  }

  .number {
    width: var(--pit-width);
    height: calc(var(--plate-size) / 2);
    display: inline-block;
    text-align: center;
    position: absolute;
    top: 0;
    left: calc(50% - (var(--pit-width) / 2));
    transform-origin: 50% 100%;
    background-color: transparent;
    border-left: calc(var(--pit-width) / 2) solid transparent;
    border-right: calc(var(--pit-width) / 2) solid transparent;
    border-top: calc(var(--plate-size) / 2) solid black;
    box-sizing: border-box;
  }

  .number:nth-child(odd) {
    border-top-color: red;
  }

  .number:nth-child(37) {
    border-top-color: green;
  }

  /* Individual number rotations */
  .number:nth-child(1) { transform: rotate(0deg); }
  .number:nth-child(2) { transform: rotate(9.73deg); }
  .number:nth-child(3) { transform: rotate(19.46deg); }
  .number:nth-child(4) { transform: rotate(29.19deg); }
  .number:nth-child(5) { transform: rotate(38.92deg); }
  .number:nth-child(6) { transform: rotate(48.65deg); }
  .number:nth-child(7) { transform: rotate(58.38deg); }
  .number:nth-child(8) { transform: rotate(68.11deg); }
  .number:nth-child(9) { transform: rotate(77.84deg); }
  .number:nth-child(10) { transform: rotate(87.57deg); }
  .number:nth-child(11) { transform: rotate(97.3deg); }
  .number:nth-child(12) { transform: rotate(107.03deg); }
  .number:nth-child(13) { transform: rotate(116.76deg); }
  .number:nth-child(14) { transform: rotate(126.49deg); }
  .number:nth-child(15) { transform: rotate(136.22deg); }
  .number:nth-child(16) { transform: rotate(145.95deg); }
  .number:nth-child(17) { transform: rotate(155.68deg); }
  .number:nth-child(18) { transform: rotate(165.41deg); }
  .number:nth-child(19) { transform: rotate(175.14deg); }
  .number:nth-child(20) { transform: rotate(184.87deg); }
  .number:nth-child(21) { transform: rotate(194.6deg); }
  .number:nth-child(22) { transform: rotate(204.33deg); }
  .number:nth-child(23) { transform: rotate(214.06deg); }
  .number:nth-child(24) { transform: rotate(223.79deg); }
  .number:nth-child(25) { transform: rotate(233.52deg); }
  .number:nth-child(26) { transform: rotate(243.25deg); }
  .number:nth-child(27) { transform: rotate(252.98deg); }
  .number:nth-child(28) { transform: rotate(262.71deg); }
  .number:nth-child(29) { transform: rotate(272.44deg); }
  .number:nth-child(30) { transform: rotate(282.17deg); }
  .number:nth-child(31) { transform: rotate(291.9deg); }
  .number:nth-child(32) { transform: rotate(301.63deg); }
  .number:nth-child(33) { transform: rotate(311.36deg); }
  .number:nth-child(34) { transform: rotate(321.09deg); }
  .number:nth-child(35) { transform: rotate(330.82deg); }
  .number:nth-child(36) { transform: rotate(340.55deg); }
  .number:nth-child(37) { transform: rotate(350.28deg); }

  .pit {
    color: #fff;
    padding-top: 12px;
    width: var(--pit-width);
    display: inline-block;
    font-size: 12px;
    transform: scale(1, 1.8);
    position: absolute;
    top: calc(-1 * var(--plate-size) / 2);
    left: calc(-1 * var(--pit-width) / 2);
  }

  .inner {
    display: block;
    height: var(--plate-size);
    width: var(--plate-size);
    position: relative;
  }

  .inner::after,
  .inner::before {
    content: "";
    display: block;
    position: absolute;
    border-radius: 50%;
  }

  .inner::after {
    z-index: 3;
    top: 24%;
    right: 24%;
    bottom: 24%;
    left: 24%;
    background-color: #111;
    border: 3px solid #333;
  }

  .inner::before {
    top: 24%;
    bottom: 21%;
    left: 24%;
    right: 22%;
    content: "\\2022";
    color: #fff;
    font-size: 60px;
    z-index: 5;
    border-radius: 0;
  }

  .inner.rest::before {
    transition: top 0.5s ease-in, right 0.5s ease-in, bottom 0.5s ease-in,
      left 0.5s ease-in;
    top: 25%;
    right: 25%;
    bottom: 24%;
    left: 25%;
  }

  /* Ball positions for each number */
  .inner[data-spinto="1"]::before { transform: rotateZ(-2602deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="2"]::before { transform: rotateZ(-2774deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="3"]::before { transform: rotateZ(-2850deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="4"]::before { transform: rotateZ(-2793deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="5"]::before { transform: rotateZ(-2642deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="6"]::before { transform: rotateZ(-2734deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="7"]::before { transform: rotateZ(-2526deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="8"]::before { transform: rotateZ(-2673deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="9"]::before { transform: rotateZ(-2564deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="10"]::before { transform: rotateZ(-2652deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="11"]::before { transform: rotateZ(-2693deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="12"]::before { transform: rotateZ(-2758deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="13"]::before { transform: rotateZ(-2614deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="14"]::before { transform: rotateZ(-2482deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="15"]::before { transform: rotateZ(-2813deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="16"]::before { transform: rotateZ(-2722deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="17"]::before { transform: rotateZ(-2855deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="18"]::before { transform: rotateZ(-2645deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="19"]::before { transform: rotateZ(-2788deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="20"]::before { transform: rotateZ(-2677deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="21"]::before { transform: rotateZ(-2589deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="22"]::before { transform: rotateZ(-2478deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="23"]::before { transform: rotateZ(-2586deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="24"]::before { transform: rotateZ(-2556deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="25"]::before { transform: rotateZ(-2688deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="26"]::before { transform: rotateZ(-2821deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="27"]::before { transform: rotateZ(-2665deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="28"]::before { transform: rotateZ(-2905deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="29"]::before { transform: rotateZ(-2749deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="30"]::before { transform: rotateZ(-2593deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="31"]::before { transform: rotateZ(-2482deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="32"]::before { transform: rotateZ(-2722deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="33"]::before { transform: rotateZ(-2532deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="34"]::before { transform: rotateZ(-2665deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="35"]::before { transform: rotateZ(-2319deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="36"]::before { transform: rotateZ(-2523deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }
  .inner[data-spinto="0"]::before { transform: rotateZ(-2833deg); transition: transform var(--spin-duration) ease-out; content: "\\2022"; }

  @keyframes rotate {
    0% { transform: rotateZ(0deg); }
    100% { transform: rotateZ(360deg); }
  }

  .data {
    display: block;
    position: absolute;
    top: 30%;
    right: 30%;
    bottom: 30%;
    left: 30%;
    border-radius: 50%;
    animation: rotate 24s reverse linear infinite;
    perspective: 2000px;
    z-index: 100;
  }

  .data-inner {
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.72s;
    transform-style: preserve-3d;
  }

  .data.reveal .data-inner {
    transform: rotateY(180deg);
  }

  .mask,
  .result {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    position: absolute;
    backface-visibility: hidden;
    border-radius: 50%;
    overflow: hidden;
    display: inline-block;
  }

  .mask {
    color: #fff;
    font-size: 24px;
    margin: auto;
    line-height: 1.4;
    padding-top: 36px;
  }

  .result {
    background-color: green;
    color: white;
    transform: rotateY(180deg);
    align-items: center;
  }

  .result-number {
    font-size: 72px;
    font-weight: 500;
    line-height: 1.2;
    margin-top: 12px;
  }

  .result-color {
    text-transform: uppercase;
    font-size: 21px;
    line-height: 1;
  }

  /* Previous results styling */
  .previous-results {
    max-width: var(--plate-size);
    margin: 24px 12px;
  }

  .previous-list {
    perspective: 2000px;
  }

  .previous-result {
    display: flex;
    margin: 1px;
    padding: 12px;
    color: #fff;
  }

  .previous-result:first-child {
    animation: flipin 0.48s ease-out;
  }

  .previous-number {
    flex: 1;
  }

  /* Color classes */
  .color-green { background-color: green; }
  .color-black { background-color: black; }
  .color-red { background-color: red; }

  /* Accessibility helper */
  .visuallyhidden {
    position: absolute;
    overflow: hidden;
    clip: rect(0 0 0 0);
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
  }

  @keyframes flipin {
    0% { transform: rotateX(90deg); }
    100% { transform: rotateX(0deg); }
  }
`

export const RED_NUMBERS = [
  32, 19, 21, 25, 34, 27, 36, 30, 23, 5, 16, 1, 14, 9, 18, 7, 12, 3,
]

export const ROULETTE_NUMBERS = [
  32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26, 0,
]
