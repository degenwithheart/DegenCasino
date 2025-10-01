import{j as t,R as k}from"./three-DV31HySq.js";import{S as m}from"./utils-D_fBc4qe.js";import{d as o,aF as $,be as l,m as r}from"./index-BarUt2o_.js";const S=o.div`
  display: flex;
  gap: 18px;
  padding: 20px 30px 10px;
  background: transparent;
  border-radius: 0;
  border: none;
  box-shadow: none;
  margin-bottom: 0;
  justify-content: center;
  margin-top: 15px;

  & > div {
    position: relative;
    width: 60px;
    aspect-ratio: 1/1.2;
    border-radius: 12px;
    border: 2px solid transparent;
    background: 
      linear-gradient(145deg, 
        rgba(15, 15, 25, 0.9) 0%,
        rgba(25, 20, 35, 0.85) 100%
      );
    background-image: 
      linear-gradient(145deg, rgba(15, 15, 25, 0.9), rgba(25, 20, 35, 0.85)),
      linear-gradient(145deg, 
        rgba(59, 130, 246, 0.4) 0%,
        rgba(147, 51, 234, 0.3) 50%,
        rgba(220, 38, 127, 0.4) 100%
      );
    background-origin: border-box;
    background-clip: content-box, border-box;
    transition: all 0.3s ease;
    box-shadow: 
      0 4px 10px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 
        0 8px 20px rgba(0, 0, 0, 0.5),
        inset 0 2px 0 rgba(255, 255, 255, 0.2);
    }
  }

  & > div.hidden {
    opacity: 0.4;
    filter: grayscale(0.6);
    transform: scale(0.95);
  }

  /* Winning item animation */
  & > div.winning {
    animation: winningPulse 1.5s ease-in-out infinite, winningGlow 2s ease-in-out infinite;
    transform: scale(1.05);
    
    & > .icon img {
      filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)) 
              drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
    }
    
    & > .multiplier {
      animation: multiplierGlow 1s ease-in-out infinite;
      background: 
        linear-gradient(135deg, 
          rgba(255, 215, 0, 1) 0%,
          rgba(255, 140, 0, 0.95) 100%
        );
      box-shadow: 
        0 0 20px rgba(255, 215, 0, 0.6),
        0 3px 8px rgba(0, 0, 0, 0.4),
        0 2px 4px rgba(255, 215, 0, 0.4);
    }
  }

  @keyframes winningPulse {
    0%, 100% { transform: scale(1.05); }
    50% { transform: scale(1.1); }
  }

  @keyframes winningGlow {
    0%, 100% { 
      box-shadow: 
        0 6px 15px rgba(0, 0, 0, 0.4),
        0 0 30px rgba(255, 215, 0, 0.4),
        inset 0 2px 0 rgba(255, 255, 255, 0.12);
    }
    50% { 
      box-shadow: 
        0 8px 25px rgba(0, 0, 0, 0.5),
        0 0 50px rgba(255, 215, 0, 0.8),
        inset 0 2px 0 rgba(255, 255, 255, 0.3);
    }
  }

  @keyframes multiplierGlow {
    0%, 100% { transform: scale(0.95); }
    50% { transform: scale(1.1); }
  }

  & > div > .icon {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    padding: 8px;
    box-sizing: border-box;
  }

  & > div > .icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.4));
    transition: all 0.3s ease;
  }

  & > div > .multiplier {
    position: absolute;
    right: -4px;
    top: -4px;
    color: #1a1a1a;
    background: 
      linear-gradient(135deg, 
        rgba(255, 215, 0, 0.95) 0%,
        rgba(255, 236, 99, 0.9) 100%
      );
    z-index: 10;
    padding: 3px 6px;
    border-radius: 8px;
    font-size: 10px;
    font-weight: bold;
    border: 2px solid rgba(255, 215, 0, 0.8);
    box-shadow: 
      0 2px 6px rgba(0, 0, 0, 0.4),
      0 1px 3px rgba(255, 215, 0, 0.4);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    transform: scale(0.9);
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }
  }
`,z=Object.entries(m.reduce((e,i)=>{const n=e[i.multiplier]??[];return{...e,[i.multiplier]:[...n,i]}},{})).map(([e,i])=>({multiplier:Number(e),items:i})).sort((e,i)=>e.multiplier-i.multiplier);function U({betArray:e,winningMultiplier:i,isWinning:n=!1}){return t.jsx("div",{style:{display:"flex",justifyContent:"center"},children:t.jsx(S,{children:z.map(({items:c,multiplier:s},a)=>t.jsxs("div",{className:`
              ${e.includes(s)?"":"hidden"} 
              ${n&&i===s?"winning":""}
            `,children:[t.jsxs("div",{className:"multiplier",children:[s,"x"]}),t.jsx("div",{className:"icon",children:t.jsx("img",{className:"slotImage",src:c[0].image})},a)]},a))})})}const h={0:["MYTHICAL","LEGENDARY","DGHRT","SOL","USDC","JUP","BONK","WOJAK"],1:["WOJAK","BONK","JUP","USDC","SOL","DGHRT","LEGENDARY","MYTHICAL"],2:["SOL","JUP","WOJAK","MYTHICAL","BONK","USDC","DGHRT","LEGENDARY"],3:["LEGENDARY","USDC","WOJAK","JUP","MYTHICAL","BONK","SOL","DGHRT"],4:["BONK","DGHRT","MYTHICAL","WOJAK","JUP","LEGENDARY","SOL","USDC"],5:["USDC","MYTHICAL","BONK","LEGENDARY","WOJAK","SOL","JUP","DGHRT"]},R=r`
  0% {
    transform: translateY(-100px); /* Start position (1 slot height) */
  }
  100% {
    transform: translateY(-800px); /* Move up by height of 7 more slots (7 * 100px) */
  }
`,j=r`
  0% {
    transform: translateY(-800px); /* Start position */
  }
  100% {
    transform: translateY(-100px); /* Move down by height of 7 more slots */
  }
`;r`
  0% { 
    transform: rotateX(12deg) translateY(10px);
    opacity: 0.8;
  }
  100% { 
    transform: rotateX(12deg) translateY(0px);
    opacity: 1;
  }
`;const M=o.div`
  position: relative;
  width: 100%;
  height: 300px; /* Height for 3 slots at 100px each (3-row layout) */
  overflow: hidden;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  transform: none; /* Let parent container handle 3D transforms */
  transform-style: preserve-3d;
  box-shadow: 
    inset 0 0 20px rgba(0, 0, 0, 0.5),
    0 4px 15px rgba(0, 0, 0, 0.3);
  flex: 1; /* Allow flex sizing */
  min-width: 80px; /* Increased minimum width for better visibility */
  max-width: 150px; /* Increased maximum width */



  /* Responsive height adjustments for small screens */
  @media (max-width: 480px) {
    height: 240px; /* Reduced height for very small screens (80px per slot × 3 slots) */
    border-radius: 6px;
  }

  @media (min-width: 481px) and (max-width: 640px) {
    height: 270px; /* Slightly reduced height for small screens (90px per slot × 3 slots) */
  }
`,Y=o.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: ${e=>e.$enableMotion&&e.$isSpinning?1:0};
  transition: ${e=>e.$enableMotion?"opacity 0.3s ease":"none"};

  ${e=>e.$isSpinning&&e.$enableMotion&&l`
    animation: ${e.$reelIndex%2===1?j:R} 0.6s linear infinite;
    filter: blur(1px);
  `}
`,N=o.div`
  width: 100%;
  height: 100px; /* Reduced slot cell height for 4-row layout */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0;
  z-index: 2; /* Ensure slots appear above the winning row highlight */
  /* Replace scale trick with simple opacity depth cue to avoid reflow/centering issues */
  ${e=>e.$enableMotion&&e.$position==="top"&&l`opacity: .88;`}
  ${e=>e.$enableMotion&&e.$position==="bottom"&&l`opacity: 1;`}

  /* Responsive slot height adjustments */
  @media (max-width: 480px) {
    height: 80px; /* Smaller slots for very small screens */
  }

  @media (min-width: 481px) and (max-width: 640px) {
    height: 90px; /* Slightly smaller slots for small screens */
  }

  ${e=>e.$good&&e.$revealed&&e.$enableMotion&&l`
    animation: slotWin 1.8s ease-in-out infinite alternate;
  `}
  ${e=>e.$good&&e.$revealed&&!e.$enableMotion&&l`filter: brightness(1.3) saturate(1.4);`}

  @keyframes slotWin {
    0% { filter: brightness(1) saturate(1); }
    100% { filter: brightness(1.3) saturate(1.4); }
  }

  > img {
    width: 80px;
    height: 80px;
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    filter: drop-shadow(0 6px 12px rgba(0,0,0,.4));
    border-radius: 12px;
    transition: ${e=>e.$enableMotion?"filter .4s ease":"none"};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    ${e=>e.$good&&e.$revealed&&l`filter: brightness(1.4) saturate(1.3) drop-shadow(0 0 20px rgba(255,215,0,.7));`}

    /* Responsive sizing for different screen sizes */
    @media (max-width: 480px) {
      width: 60px;
      height: 60px;
    }

    @media (min-width: 481px) and (max-width: 640px) {
      width: 70px;
      height: 70px;
    }
  }
`,O=o.div`
  width: 100%;
  height: 100px; /* Height of one slot - updated to match new layout */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0; /* Remove padding for perfect centering */
  
  /* During spinning, create transition effect based on vertical position */
  transform: scale(1.0);
  
  /* Apply scaling based on position in the reel strip */
  &:nth-child(even) {
    transform: scale(0.75); /* Smaller for "top" positions */
  }
  
  &:nth-child(odd) {
    transform: scale(1.0); /* Full size for "bottom" positions */
  }



  > img {
    width: 100px; /* Fixed size for all images */
    height: 100px; /* Fixed size for all images */
    object-fit: contain;
    object-position: center center; /* Ensure centered positioning */
    filter: drop-shadow(0 6px 12px rgba(0, 0, 0, 0.4));
    border-radius: 12px;
    transition: ${e=>e.$enableMotion?"all 0.4s ease":"none"};
    display: block;
    /* Perfect centering */
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    /* Responsive image sizing */
    @media (max-width: 480px) {
      width: 60px;
      height: 60px;
      border-radius: 8px;
    }

    @media (min-width: 481px) and (max-width: 640px) {
      width: 70px;
      height: 70px;
      border-radius: 10px;
    }

    @media (min-width: 641px) and (max-width: 768px) {
      width: 80px;
      height: 80px;
    }
  }
`,G=o.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  opacity: ${e=>e.$enableMotion?e.$revealed?1:0:1};
  transform: ${e=>(e.$enableMotion,"translateY(0px)")};
  transition: ${e=>e.$enableMotion?"opacity 0.5s ease-out":"none"};
  z-index: 5;


`;function H({revealed:e,good:i,reelIndex:n,items:c,isSpinning:s,enableMotion:a=!0}){const v=k.useMemo(()=>{const d=n%Object.keys(h).length,g=(h[d]||h[0]).map(u=>{const b=$.symbols.find(f=>f.name===u);if(!b)return console.error("Symbol not found in config during spinning:",u),m[0];const w=m.find(f=>Math.abs(f.multiplier-b.multiplier)<.001);return w||(console.error("SlotItem not found for multiplier during spinning:",b.multiplier),m[0])}),x=[];return x.push(...g),x.push(...g),x.push(...g),x},[n]);return t.jsxs(M,{$revealed:e,$isSpinning:s,$enableMotion:a,children:[t.jsx(Y,{$isSpinning:s,$reelIndex:n,$enableMotion:a,children:v.map((d,p)=>t.jsx(O,{$good:!1,$revealed:!1,$enableMotion:a,children:t.jsx("img",{src:d.image,alt:""})},p))}),t.jsx(G,{$good:!1,$revealed:e,$enableMotion:a,children:c.map((d,p)=>{const g=p===0?"top":"bottom";return t.jsx(N,{$good:i[p],$revealed:e,$position:g,$enableMotion:a,children:t.jsx("img",{src:d.image,alt:""})},p)})})]})}const L=r`
  0%, 100% { 
    transform: rotate(-12deg) scale(1);
    text-shadow: 
      0 0 20px rgba(212, 165, 116, 0.4),
      3px 3px 8px rgba(10, 5, 17, 0.8);
  }
  50% { 
    transform: rotate(-8deg) scale(1.05);
    text-shadow: 
      0 0 30px rgba(212, 165, 116, 0.6),
      3px 3px 12px rgba(10, 5, 17, 0.9);
  }
`,C=r`
  0%, 100% { 
    transform: rotate(20deg) scale(1);
    text-shadow: 
      0 0 25px rgba(184, 51, 106, 0.5),
      3px 3px 8px rgba(10, 5, 17, 0.8);
  }
  50% { 
    transform: rotate(25deg) scale(1.08);
    text-shadow: 
      0 0 35px rgba(184, 51, 106, 0.7),
      3px 3px 12px rgba(10, 5, 17, 0.9);
  }
`,D=r`
  0%, 100% { 
    opacity: 0.05;
    transform: rotate(-20deg) scale(1);
  }
  50% { 
    opacity: 0.08;
    transform: rotate(-15deg) scale(1.02);
  }
`,F=o.div`
  perspective: 100px;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(10, 5, 17, 0.95) 0%, 
    rgba(139, 90, 158, 0.25) 20%,
    rgba(184, 51, 106, 0.2) 40%,
    rgba(212, 165, 116, 0.15) 60%,
    rgba(139, 90, 158, 0.25) 80%,
    rgba(10, 5, 17, 0.95) 100%
  );
  border-radius: 20px;
  border: 2px solid rgba(212, 165, 116, 0.3);
  box-shadow: 
    0 25px 50px rgba(10, 5, 17, 0.7),
    inset 0 2px 4px rgba(212, 165, 116, 0.15),
    inset 0 -2px 4px rgba(10, 5, 17, 0.5),
    0 0 30px rgba(212, 165, 116, 0.2);
  overflow: hidden;
  
  /* Romantic slot machine elements */
  &::before {
    content: '🎰';
    position: absolute;
    top: 8%;
    left: 6%;
    font-size: 90px;
    opacity: 0.12;
    color: rgba(212, 165, 116, 0.4);
    z-index: 0;
    pointer-events: none;
    animation: ${L} 8s ease-in-out infinite;

    @media (max-width: 768px) {
      font-size: 70px;
      top: 6%;
      left: 4%;
    }

    @media (max-width: 479px) {
      font-size: 50px;
      opacity: 0.08;
    }
  }

  &::after {
    content: '�';
    position: absolute;
    bottom: 12%;
    right: 8%;
    font-size: 80px;
    opacity: 0.15;
    color: rgba(184, 51, 106, 0.5);
    z-index: 0;
    pointer-events: none;
    animation: ${C} 6s ease-in-out infinite;

    @media (max-width: 768px) {
      font-size: 60px;
      bottom: 8%;
      right: 5%;
    }

    @media (max-width: 479px) {
      font-size: 45px;
      opacity: 0.1;
    }
  }

  /* Override GameScreenFrame backgrounds */
  & .absolute.inset-\\[2px\\].rounded-\\[0\\.65rem\\].bg-\\[\\#0c0c11\\] {
    background: transparent !important;
  }

  & [class*="bg-[#0c0c11]"] {
    background: transparent !important;
  }

  & > * {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
  }

  .slots-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0;
    transform: rotateX(2deg) rotateY(0deg);
    position: relative;
    z-index: 2;
    padding: 0;
    max-width: 1400px; /* Increased max-width for 6-reel layout */
    margin: 0 auto;
    min-height: 100%;
    width: 100%;
    font-family: 'DM Sans', sans-serif;

    @media (max-width: 768px) {
      transform: rotateX(1deg);
      max-width: 100%;
    }

    @media (max-width: 479px) {
      transform: none;
      padding: 0 4px; /* Reduced padding for very small screens */
    }
  }

  /* Romantic casino background elements */
  .casino-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    &::before {
      content: '�';
      position: absolute;
      top: 40%;
      right: 12%;
      font-size: 70px;
      color: rgba(184, 51, 106, 0.3);
      animation: ${D} 10s ease-in-out infinite;

      @media (max-width: 768px) {
        font-size: 50px;
        right: 8%;
      }

      @media (max-width: 479px) {
        font-size: 35px;
        opacity: 0.06;
      }
    }

    &::after {
      content: '🔔';
      position: absolute;
      bottom: 30%;
      left: 10%;
      font-size: 75px;
      opacity: 0.07;
      transform: rotate(25deg);
      color: #e879f9;
    }
  }

  /* Decorative corner elements */
  .decorative-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, rgba(255, 20, 147, 0.08) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  @keyframes slotsPulse {
    0%, 30% {
      transform: scale(1)
    }
    10% {
      transform: scale(1.3)
    }
  }

  @keyframes reveal-glow {
    0%, 30% {
      border-color: #2d2d57;
      background: #ffffff00;
    }
    10% {
      border-color: white;
      background: #ffffff33;
    }
  }

  @keyframes shine {
    0%, 30% {
      background: #ffffff00;
    }
    10% {
      background: #ffffff33;
    }
  }

  @keyframes result-flash {
    25%, 75% {
      background-color: #ffec63;
      color: #333;
    }
    50% {
      background-color: #ffec6311;
      color: #ffec63;
    }
  }
  @keyframes result-flash-2 {
    0%, 50% {
      background-color: #ffec6388;
      filter: brightness(2.5) contrast(1.5) saturate(10);
    }
    100% {
      background-color: #ffec6300;
      filter: brightness(1) contrast(1);
    }
  }

  .result {
    border: none;
    padding: 30px 40px;
    text-transform: uppercase;
    position: relative;
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
    border-radius: 20px;
    background: 
      linear-gradient(135deg, 
        rgba(30, 30, 50, 0.9) 0%,
        rgba(40, 25, 60, 0.85) 50%,
        rgba(25, 35, 55, 0.9) 100%
      );
    border: 3px solid transparent;
    background-image: 
      linear-gradient(135deg, rgba(30, 30, 50, 0.9), rgba(25, 35, 55, 0.9)),
      linear-gradient(135deg, 
        rgba(255, 236, 99, 0.7) 0%,
        rgba(255, 215, 0, 0.5) 50%,
        rgba(255, 236, 99, 0.7) 100%
      );
    background-origin: border-box;
    background-clip: content-box, border-box;
    color: #ffe066;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
    letter-spacing: 1.5px;
    box-shadow: 
      0 12px 35px rgba(0, 0, 0, 0.4),
      0 6px 20px rgba(255, 236, 99, 0.15),
      inset 0 2px 0 rgba(255, 255, 255, 0.15);
    text-shadow: 
      0 0 15px rgba(255, 236, 99, 0.6),
      0 3px 6px rgba(0, 0, 0, 0.4);
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        45deg,
        transparent 30%,
        rgba(255, 255, 255, 0.15) 50%,
        transparent 70%
      );
      border-radius: 20px;
      animation: shimmer 3s ease-in-out infinite;
    }
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  .result[data-good="true"] {
    animation: result-flash 2s infinite, victoryPulse 1s ease-in-out infinite alternate;
    background: 
      linear-gradient(135deg, 
        rgba(255, 215, 0, 0.2) 0%,
        rgba(255, 140, 0, 0.15) 50%,
        rgba(255, 215, 0, 0.2) 100%
      );
    border-image: linear-gradient(
      45deg,
      rgba(255, 215, 0, 0.8) 0%,
      rgba(255, 140, 0, 0.6) 50%,
      rgba(255, 215, 0, 0.8) 100%
    ) 1;
    box-shadow: 
      0 0 30px rgba(255, 215, 0, 0.4),
      0 0 60px rgba(255, 215, 0, 0.2),
      0 8px 25px rgba(0, 0, 0, 0.3);
  }

  @keyframes victoryPulse {
    0% { transform: scale(1); }
    100% { transform: scale(1.02); }
  }

  .slots {
    display: flex;
    flex-direction: column;
    gap: 0;
    justify-content: center;
    box-sizing: border-box;
    border-radius: 25px;
    background: 
      linear-gradient(145deg, 
        rgba(30, 30, 30, 0.9) 0%,
        rgba(15, 15, 25, 0.95) 50%,
        rgba(20, 20, 30, 0.9) 100%
      );
    padding: 0;
    border: 3px solid transparent;
    background-image: 
      linear-gradient(145deg, rgba(30, 30, 30, 0.9), rgba(15, 15, 25, 0.95)),
      linear-gradient(145deg, 
        rgba(255, 215, 0, 0.4) 0%,
        rgba(220, 38, 127, 0.3) 25%,
        rgba(147, 51, 234, 0.4) 50%,
        rgba(59, 130, 246, 0.3) 75%,
        rgba(255, 215, 0, 0.4) 100%
      );
    background-origin: border-box;
    background-clip: content-box, border-box;
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.5),
      0 15px 30px rgba(147, 51, 234, 0.15),
      inset 0 2px 0 rgba(255, 255, 255, 0.1),
      inset 0 -2px 0 rgba(0, 0, 0, 0.2);
    position: relative;
    min-height: 300px;
    width: 100%;
    overflow: hidden;

    /* Responsive width constraints */
    @media (min-width: 768px) {
      min-width: 1000px; /* 6-reel layout on desktop */
    }

    @media (max-width: 767px) {
      min-width: 500px; /* 4-reel layout on mobile */
    }
    
    &::before {
      content: '';
      position: absolute;
      top: -3px;
      left: -3px;
      right: -3px;
      bottom: -3px;
      background: linear-gradient(45deg, 
        rgba(255, 215, 0, 0.3) 0%,
        rgba(220, 38, 127, 0.2) 25%,
        rgba(147, 51, 234, 0.3) 50%,
        rgba(59, 130, 246, 0.2) 75%,
        rgba(255, 215, 0, 0.3) 100%
      );
      border-radius: 28px;
      z-index: -1;
      animation: borderGlow 3s ease-in-out infinite alternate;
    }
  }

  .winning-line-display {
    background: 
      linear-gradient(135deg, 
        rgba(10, 10, 20, 0.95) 0%,
        rgba(20, 15, 30, 0.9) 50%,
        rgba(15, 10, 25, 0.95) 100%
      );
    border-bottom: 2px solid rgba(147, 51, 234, 0.3);
    padding: 20px 30px;
    border-radius: 22px 22px 0 0;
    position: relative;
    
    &::before {
      content: 'WINNING COMBINATIONS';
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 10px;
      font-weight: bold;
      color: rgba(147, 51, 234, 0.8);
      letter-spacing: 1px;
      text-transform: uppercase;
    }
  }

  .slots-reels {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    perspective: 800px;
    transform: rotateX(-5deg); /* Slight tilt so top appears further back */
    position: relative;
    width: 100%;

    /* Responsive layout adjustments */
    @media (min-width: 768px) {
      gap: 8px; /* Tighter gap for 6 reels on desktop */
      padding: 40px 10px;
      min-width: 700px;
    }

    @media (max-width: 767px) {
      gap: 12px; /* More generous gap for 4 reels on mobile */
      padding: 40px 20px;
      min-width: 400px;
    }
  }

  .winning-line-arrow {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px; /* Match new reel height (3 rows × 100px) */
    position: relative;
    z-index: 10;
    pointer-events: none;

    /* Responsive width based on number of reels */
    @media (min-width: 768px) {
      width: 40px; /* Smaller width for 6-reel desktop layout */
    }

    @media (max-width: 767px) {
      width: 50px; /* Normal width for 4-reel mobile layout */
    }
  }

  .winning-line-arrow-left {
    @media (min-width: 768px) {
      margin-right: 5px; /* Tighter margin for 6-reel desktop */
    }

    @media (max-width: 767px) {
      margin-right: 10px; /* Normal margin for 4-reel mobile */
    }
  }

  .winning-line-arrow-right {
    @media (min-width: 768px) {
      margin-left: 5px; /* Tighter margin for 6-reel desktop */
    }

    @media (max-width: 767px) {
      margin-left: 10px; /* Normal margin for 4-reel mobile */
    }
  }

  .arrow-icon {
    color: #ffd700;
    text-shadow: 
      0 0 10px rgba(255, 215, 0, 0.8),
      0 0 20px rgba(255, 215, 0, 0.6),
      0 0 30px rgba(255, 215, 0, 0.4);
    animation: arrowPulse 2s ease-in-out infinite;
    /* Position the arrow to align perfectly with the ECG line on middle row (3-row layout) */
    transform: translateY(0px); /* Centered for middle row of 3-row layout */
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));

    /* Responsive sizing */
    @media (min-width: 768px) {
      font-size: 30px; /* Smaller for 6-reel desktop layout */
    }

    @media (max-width: 767px) {
      font-size: 36px; /* Normal size for 4-reel mobile layout */
    }
  }

  .winning-line-arrow-left .arrow-icon {
    transform: translateY(0px) rotate(0deg);
  }

  .winning-line-arrow-right .arrow-icon {
    transform: translateY(0px) rotate(0deg);
  }

  @keyframes arrowPulse {
    0%, 100% {
      opacity: 0.7;
      transform: translateY(0px) scale(1); /* Updated to match ECG line exactly */
    }
    50% {
      opacity: 1;
      transform: translateY(0px) scale(1.1); /* Updated to match ECG line exactly */
    }
  }

  /* ECG-style winning line animation */
  .ecg-winning-line {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 3px;
    background: transparent;
    z-index: 15;
    pointer-events: none;
    transform: translateY(0px); /* Position at middle row for 3-row layout */
    opacity: 0;
    transition: opacity 0.3s ease;
    
    &.active {
      opacity: 1;
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      background: #00ff41;
      box-shadow: 
        0 0 6px #00ff41,
        0 0 12px #00ff41,
        0 0 18px #00ff41;
      clip-path: inset(0 100% 0 0);
      animation: none;
    }
    
    &.active::before {
      animation: ecgDraw 4s ease-out 1s forwards, ecgLinePulse 1.5s ease-in-out 5s infinite;
    }
  }

  @keyframes ecgDraw {
    0% {
      clip-path: inset(0 100% 0 0);
    }
    100% {
      clip-path: inset(0 0% 0 0);
    }
  }

  @keyframes ecgLinePulse {
    0%, 100% {
      box-shadow: 
        0 0 6px #00ff41,
        0 0 12px #00ff41,
        0 0 18px #00ff41;
      filter: brightness(1);
      transform: scaleY(1);
    }
    50% {
      box-shadow: 
        0 0 20px #00ff41,
        0 0 40px #00ff41,
        0 0 60px #00ff41,
        0 0 80px #00ff41;
      filter: brightness(2.5);
      transform: scaleY(2);
    }
  }

  @keyframes borderGlow {
    0% { opacity: 0.6; }
    100% { opacity: 1; }
  }

  .slot::after {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
  }

  @keyframes reveal {
    0% {
      transform: translateY(100%);
      opacity: 0;
    }
    100% {
      transform: translateY(0%);
      opacity: 1;
    }
  }

  .slotImage {
    aspect-ratio: 1/1;
    max-width: 100%;
    max-height: 100%;
  }

  /* Mobile responsive adjustments for arrows */
  @media (max-width: 480px) {
    .slots-reels {
      gap: 1px; /* Very tight gap for small phones to fit 6 reels */
      padding: 15px 2px; /* Minimal padding */
      overflow-x: auto; /* Allow horizontal scroll on very small screens */
    }

    .winning-line-arrow {
      width: 15px; /* Very small arrows */
      display: none; /* Hide arrows on very small screens */
    }

    .arrow-icon {
      font-size: 12px;
    }
  }

  @media (min-width: 481px) and (max-width: 640px) {
    .slots-reels {
      gap: 3px; /* Tighter gap for 6 reels on mobile */
      padding: 20px 4px; /* Further reduced padding for mobile */
    }

    .winning-line-arrow {
      width: 20px; /* Smaller arrows for mobile */
    }

    .winning-line-arrow-left {
      margin-right: 1px;
    }

    .winning-line-arrow-right {
      margin-left: 1px;
    }

    .arrow-icon {
      font-size: 16px; /* Smaller arrow icons */
    }
  }

  @media (min-width: 641px) and (max-width: 768px) {
    .slots-reels {
      gap: 5px; /* Tighter gap for tablets */
      padding: 25px 8px;
    }

    .winning-line-arrow {
      width: 28px;
    }

    .winning-line-arrow-left {
      margin-right: 3px;
    }

    .winning-line-arrow-right {
      margin-left: 3px;
    }

    .arrow-icon {
      font-size: 20px;
    }
  }

  @media (min-width: 769px) and (max-width: 899px) {
    .slots-reels {
      gap: 8px;
      padding: 30px 15px;
    }

    .winning-line-arrow {
      width: 38px;
    }

    .winning-line-arrow-left {
      margin-right: 5px;
    }

    .winning-line-arrow-right {
      margin-left: 5px;
    }

    .arrow-icon {
      font-size: 28px;
    }
  }

  @media (min-width: 900px) {
    .slots-reels {
      gap: 8px; /* Further reduced for 6 reels */
      padding: 35px 15px;
    }

    .winning-line-arrow {
      width: 40px;
    }

    .winning-line-arrow-left {
      margin-right: 5px;
    }

    .winning-line-arrow-right {
      margin-left: 5px;
    }

    .arrow-icon {
      font-size: 30px;
    }
  }
`,I=r`
  0%, 100% { 
    transform: rotate(-15deg) scale(1);
    text-shadow: 
      0 0 20px rgba(212, 165, 116, 0.5),
      3px 3px 8px rgba(10, 5, 17, 0.8);
  }
  50% { 
    transform: rotate(-10deg) scale(1.05);
    text-shadow: 
      0 0 30px rgba(212, 165, 116, 0.7),
      3px 3px 12px rgba(10, 5, 17, 0.9);
  }
`,y=r`
  0%, 100% { 
    transform: rotate(18deg) scale(1);
    text-shadow: 
      0 0 25px rgba(184, 51, 106, 0.6),
      3px 3px 8px rgba(10, 5, 17, 0.8);
  }
  50% { 
    transform: rotate(25deg) scale(1.08);
    text-shadow: 
      0 0 35px rgba(184, 51, 106, 0.8),
      3px 3px 12px rgba(10, 5, 17, 0.9);
  }
`,A=r`
  0% { 
    background-position: 0% 50%; 
    opacity: 0.3;
  }
  50% { 
    background-position: 100% 50%;
    opacity: 0.6;
  }
  100% { 
    background-position: 0% 50%;
    opacity: 0.3;
  }
`,J=o.div`
  perspective: 100px;
  user-select: none;
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, 
    rgba(10, 5, 17, 0.95) 0%, 
    rgba(139, 90, 158, 0.2) 25%,
    rgba(184, 51, 106, 0.15) 50%,
    rgba(139, 90, 158, 0.2) 75%,
    rgba(10, 5, 17, 0.95) 100%
  );
  background-size: 400% 400%;
  animation: ${A} 12s ease-in-out infinite;
  border-radius: 20px;
  border: 2px solid rgba(212, 165, 116, 0.3);
  box-shadow: 
    0 25px 50px rgba(10, 5, 17, 0.8),
    inset 0 2px 4px rgba(212, 165, 116, 0.15),
    inset 0 -2px 4px rgba(10, 5, 17, 0.6),
    0 0 35px rgba(212, 165, 116, 0.2);
  overflow: hidden;
  z-index: 0;

  /* Romantic glow overlay */
  &::before {
    content: '🎰';
    position: absolute;
    top: 12%;
    left: 7%;
    font-size: 100px;
    opacity: 0.12;
    color: rgba(212, 165, 116, 0.4);
    z-index: 0;
    pointer-events: none;
    animation: ${I} 8s ease-in-out infinite;

    @media (max-width: 768px) {
      font-size: 80px;
      top: 8%;
      left: 5%;
    }

    @media (max-width: 479px) {
      font-size: 60px;
      opacity: 0.08;
    }
  }

  &::after {
    content: '💝';
    position: absolute;
    bottom: 10%;
    right: 8%;
    font-size: 90px;
    opacity: 0.15;
    color: rgba(184, 51, 106, 0.5);
    z-index: 0;
    pointer-events: none;
    animation: ${y} 6s ease-in-out infinite;

    @media (max-width: 768px) {
      font-size: 70px;
      bottom: 8%;
      right: 5%;
    }

    @media (max-width: 479px) {
      font-size: 50px;
      opacity: 0.1;
    }
  }

  /* Romantic mystical particles */
  &:before:nth-child(3) {
    content: '';
    position: absolute;
    top: 30%;
    right: 20%;
    width: 4px;
    height: 4px;
    background: var(--love-letter-gold);
    border-radius: 50%;
    box-shadow: 
      0 0 10px rgba(212, 165, 116, 0.8),
      20px 30px 0 rgba(184, 51, 106, 0.6),
      -30px 20px 0 rgba(139, 90, 158, 0.5),
      40px -20px 0 rgba(212, 165, 116, 0.4);
    animation: ${y} 10s ease-in-out infinite;
  }

  /* Override GameScreenFrame's backgrounds to show romantic colorScheme */
  & .absolute.inset-\\[2px\\].rounded-\\[0\\.65rem\\].bg-\\[\\#0c0c11\\] {
    background: transparent !important;
  }

  & [class*="bg-[#0c0c11]"] {
    background: transparent !important;
  }

  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    border-radius: 16px;
    background-size: 300% 300%;
  }

  @media (max-width: 479px) {
    border-radius: 12px;
    background-size: 200% 200%;
    box-shadow: 
      0 15px 30px rgba(10, 5, 17, 0.7),
      inset 0 1px 2px rgba(212, 165, 116, 0.1),
      0 0 20px rgba(212, 165, 116, 0.15);
  }
`;export{U as I,H as R,J as S,F as a};
