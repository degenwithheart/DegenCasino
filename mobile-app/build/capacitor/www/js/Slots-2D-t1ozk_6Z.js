import{j as t,R as S,r as X}from"./three-D4AtYCWe.js";import{d as j,aL as Y,m as R,G as T,aP as re,W as ae,az as se,aw as le,ay as pe,ax as de,aR as ce,aS as ge,aB as me,aC as xe,aD as fe}from"./index-Dyfdn2uN.js";import{G as be}from"./GameStatsHeader-BAMe0qyx.js";import{u as B}from"./useGameMeta-5-HRcCSO.js";import{G as he}from"./GameRecentPlaysHorizontal-Ddh_VF4k.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-DLMfKFaI.js";const ue="/assets/lose-BiZND7-V.mp3",we="/assets/insert-vz9zGVF9.mp3",ye="/assets/reveal-legendary-Df5GMKym.mp3",Se="/assets/win-D69axww9.mp3",ve="/assets/spin-DL-crDyg.mp3",Me="/assets/win-BZLpk71b.mp3",Ee="/assets/heads-BMVAyMSZ.webp",ke="/assets/slot-sol-wJznu0TT.webp",Ne="/assets/slot-usdc-DeepKBec.webp",Le="/assets/slot-jup-CUkZG17O.webp",Ae="/assets/slot-bonk-DYoHYieQ.webp",Re="/assets/slot-mythical-KjTyodPM.webp",De="/assets/slot-legendary-ChRyqJi3.webp",$e="/assets/slot-wojak-VzQjs9VJ.webp",te={slots:{LEGENDARY_THRESHOLD:5,symbols:[{name:"LEGENDARY",multiplier:7,weight:1},{name:"DGHRT",multiplier:5,weight:2},{name:"SOL",multiplier:3,weight:5},{name:"USDC",multiplier:2,weight:15},{name:"JUP",multiplier:1,weight:80},{name:"BONK",multiplier:1,weight:80},{name:"WOJAK",multiplier:.5,weight:817}],betArray:[7,5,5,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,.5,.5,.5,.5,.5,...Array(15).fill(0)]}},W=te.slots,Oe={MYTHICAL:Re,LEGENDARY:De,DGHRT:Ee,SOL:ke,USDC:Ne,JUP:Le,BONK:Ae,WOJAK:$e},u=te.slots.symbols.map(e=>({multiplier:e.multiplier,image:Oe[e.name]||""})),J={classic:{NUM_REELS:4,NUM_ROWS:3,NUM_PAYLINES:1},wide:{NUM_REELS:6,NUM_ROWS:3,NUM_PAYLINES:1}},ne=e=>J[e].NUM_REELS,ie=e=>J[e].NUM_ROWS,je=e=>J[e].NUM_PAYLINES,Ge=e=>ne(e)*ie(e),ze=1500,Ie=300,Ce=500,Te=W.LEGENDARY_THRESHOLD,Ye=j.div`
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
`,Pe=Object.entries(u.reduce((e,n)=>{const r=e[n.multiplier]??[];return{...e,[n.multiplier]:[...r,n]}},{})).map(([e,n])=>({multiplier:Number(e),items:n})).sort((e,n)=>e.multiplier-n.multiplier);function Ue({betArray:e,winningMultiplier:n,isWinning:r=!1}){return t.jsx("div",{style:{display:"flex",justifyContent:"center"},children:t.jsx(Ye,{children:Pe.map(({items:x,multiplier:a},i)=>t.jsxs("div",{className:`
              ${e.includes(a)?"":"hidden"} 
              ${r&&n===a?"winning":""}
            `,children:[t.jsxs("div",{className:"multiplier",children:[a,"x"]}),t.jsx("div",{className:"icon",children:t.jsx("img",{className:"slotImage",src:x[0].image})},i)]},i))})})}const K={0:["MYTHICAL","LEGENDARY","DGHRT","SOL","USDC","JUP","BONK","WOJAK"],1:["WOJAK","BONK","JUP","USDC","SOL","DGHRT","LEGENDARY","MYTHICAL"],2:["SOL","JUP","WOJAK","MYTHICAL","BONK","USDC","DGHRT","LEGENDARY"],3:["LEGENDARY","USDC","WOJAK","JUP","MYTHICAL","BONK","SOL","DGHRT"],4:["BONK","DGHRT","MYTHICAL","WOJAK","JUP","LEGENDARY","SOL","USDC"],5:["USDC","MYTHICAL","BONK","LEGENDARY","WOJAK","SOL","JUP","DGHRT"]},_e=R`
  0% {
    transform: translateY(-100px); /* Start position (1 slot height) */
  }
  100% {
    transform: translateY(-800px); /* Move up by height of 7 more slots (7 * 100px) */
  }
`,We=R`
  0% {
    transform: translateY(-800px); /* Start position */
  }
  100% {
    transform: translateY(-100px); /* Move down by height of 7 more slots */
  }
`;R`
  0% { 
    transform: rotateX(12deg) translateY(10px);
    opacity: 0.8;
  }
  100% { 
    transform: rotateX(12deg) translateY(0px);
    opacity: 1;
  }
`;const He=j.div`
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
`,Be=j.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  opacity: ${e=>e.$enableMotion&&e.$isSpinning?1:0};
  transition: ${e=>e.$enableMotion?"opacity 0.3s ease":"none"};

  ${e=>e.$isSpinning&&e.$enableMotion&&Y`
    animation: ${e.$reelIndex%2===1?We:_e} 0.6s linear infinite;
    filter: blur(1px);
  `}
`,Ke=j.div`
  width: 100%;
  height: 100px; /* Reduced slot cell height for 4-row layout */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 0;
  z-index: 2; /* Ensure slots appear above the winning row highlight */
  /* Replace scale trick with simple opacity depth cue to avoid reflow/centering issues */
  ${e=>e.$enableMotion&&e.$position==="top"&&Y`opacity: .88;`}
  ${e=>e.$enableMotion&&e.$position==="bottom"&&Y`opacity: 1;`}

  /* Responsive slot height adjustments */
  @media (max-width: 480px) {
    height: 80px; /* Smaller slots for very small screens */
  }

  @media (min-width: 481px) and (max-width: 640px) {
    height: 90px; /* Slightly smaller slots for small screens */
  }

  ${e=>e.$good&&e.$revealed&&e.$enableMotion&&Y`
    animation: slotWin 1.8s ease-in-out infinite alternate;
  `}
  ${e=>e.$good&&e.$revealed&&!e.$enableMotion&&Y`filter: brightness(1.3) saturate(1.4);`}

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
    ${e=>e.$good&&e.$revealed&&Y`filter: brightness(1.4) saturate(1.3) drop-shadow(0 0 20px rgba(255,215,0,.7));`}

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
`,Je=j.div`
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
`,Fe=j.div`
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


`;function qe({revealed:e,good:n,reelIndex:r,items:x,isSpinning:a,enableMotion:i=!0}){const l=S.useMemo(()=>{const p=r%Object.keys(K).length,M=(K[p]||K[0]).map(N=>{const y=W.symbols.find(A=>A.name===N);if(!y)return console.error("Symbol not found in config during spinning:",N),u[0];const w=u.find(A=>Math.abs(A.multiplier-y.multiplier)<.001);return w||(console.error("SlotItem not found for multiplier during spinning:",y.multiplier),u[0])}),E=[];return E.push(...M),E.push(...M),E.push(...M),E},[r]);return t.jsxs(He,{$revealed:e,$isSpinning:a,$enableMotion:i,children:[t.jsx(Be,{$isSpinning:a,$reelIndex:r,$enableMotion:i,children:l.map((p,v)=>t.jsx(Je,{$good:!1,$revealed:!1,$enableMotion:i,children:t.jsx("img",{src:p.image,alt:""})},v))}),t.jsx(Fe,{$good:!1,$revealed:e,$enableMotion:i,children:x.map((p,v)=>{const M=v===0?"top":"bottom";return t.jsx(Ke,{$good:n[v],$revealed:e,$position:M,$enableMotion:i,children:t.jsx("img",{src:p.image,alt:""})},v)})})]})}const Ve=R`
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
`,Xe=R`
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
`,Qe=R`
  0%, 100% { 
    opacity: 0.05;
    transform: rotate(-20deg) scale(1);
  }
  50% { 
    opacity: 0.08;
    transform: rotate(-15deg) scale(1.02);
  }
`,Ze=j.div`
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
    animation: ${Ve} 8s ease-in-out infinite;

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
    animation: ${Xe} 6s ease-in-out infinite;

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
      animation: ${Qe} 10s ease-in-out infinite;

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
`,et=R`
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
`,Q=R`
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
`,tt=R`
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
`,nt=j.div`
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
  animation: ${tt} 12s ease-in-out infinite;
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
    animation: ${et} 8s ease-in-out infinite;

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
    animation: ${Q} 6s ease-in-out infinite;

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
    animation: ${Q} 10s ease-in-out infinite;
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
`;function it(e){let n=1779033703^e.length;for(let r=0;r<e.length;r++)n=Math.imul(n^e.charCodeAt(r),3432918353),n=n<<13|n>>>19;return function(){return n=Math.imul(n^n>>>16,2246822507),n=Math.imul(n^n>>>13,3266489909),((n^=n>>>16)>>>0)/4294967296}}const Z=(e,n)=>e[Math.floor(n()*e.length)],ot=(e,n,r=50)=>W.betArray.slice(0,r),rt=(e,n)=>{const r=Math.floor(n/2),x=[];for(let a=0;a<e;a++)x.push(r+a*n);return[x]},at=(e,n)=>{const r=n.map(i=>e[i]),x=r[0];return r.every(i=>i.multiplier===x.multiplier&&x.multiplier>0)?x:null},ee=(e,n,r)=>{const x=rt(n,r),a=[];return x.forEach((i,l)=>{const p=at(e,i);p&&a.push({payline:i,symbol:p})}),a},st=(e,n,r,x,a,i)=>{const l=it(`${x}:${n}:${r.length}:${e}:${a}:${i}`),p=["MYTHICAL","LEGENDARY","DGHRT","SOL","USDC","JUP","BONK","WOJAK"],M=(c=>{const s=[];for(let d=0;d<c;d++)if(d===0)s.push([...p]);else if(d===1)s.push([...p].reverse());else{const o=[...p.slice(d),...p.slice(0,d)];s.push(o)}return s})(a),E=c=>{const s=W.symbols.find(o=>o.name===c);if(!s)return console.error("Symbol not found in config:",c),u[0];const d=u.find(o=>Math.abs(o.multiplier-s.multiplier)<.001);return d||(console.error("SlotItem not found for multiplier:",s.multiplier),u[0])},N=(c,s,d)=>{const o=M[c];return o?[...o].map((g,b)=>{const P=Math.floor(d()*(b+1)),z=o[b];return o[b]=o[P],o[P]=z,o[b]}).slice(0,s).map(g=>E(g)):Array(s).fill(u[0])},y=Math.floor(i/2);if(n>0){const c=u.filter(o=>o.multiplier===n),s=c.length>0?Z(c,l):Z(u,l),d=new Array(e).fill(null);for(let o=0;o<a;o++){const G=N(o,i,l);for(let g=0;g<i;g++){const b=o*i+g;g===y?d[b]=s:d[b]=G[g]}}return d}const w=new Array(e).fill(null);for(let c=0;c<a;c++){const s=N(c,i,l);for(let d=0;d<i;d++){const o=c*i+d;w[o]=s[d]}}let A=0;for(;A<10;){const c=[];for(let g=0;g<a;g++){const b=g*i+y;c.push(w[b])}const s=c[0];if(!c.every(g=>g.multiplier===s.multiplier&&s.multiplier>0))break;const o=Math.floor(l()*a),G=N(o,i,l);for(let g=0;g<i;g++){const b=o*i+g;w[b]=G[g]}A++}return w};function bt(){const e=T.useGame(),n=re(),{mobile:r}=ae(),x=se("slots"),a=r?"classic":"wide",i=ne(a),l=ie(a),p=Ge(a);je(a);const[v,M]=S.useState(!1),[E,N]=S.useState(),[y,w]=S.useState(!1),[A,c]=S.useState(p),[s,d]=le(),[o,G]=S.useState(Array.from({length:p}).map(()=>u[0])),[g,b]=S.useState([]),[P,z]=S.useState(null);S.useEffect(()=>{console.log("🎰 RESPONSIVE MODE CHANGE:",{isMobile:r,slotMode:a,NUM_REELS:i,NUM_ROWS:l,NUM_SLOTS:p,previousCombinationLength:o.length}),G(Array.from({length:p}).map(()=>u[0])),c(p),b([]),z(null),w(!1)},[p,r]);const{settings:H}=pe();console.log("🎰 SLOTS DEBUG:",{isMobile:r,slotMode:r?"4×3":"6×3",NUM_REELS:i,NUM_ROWS:l,NUM_SLOTS:p,spinning:v,result:!!E,good:y,revealedSlots:A,wager:s,enableMotion:H.enableMotion,combination:o.map(h=>h.multiplier),winningPaylines:g.length,combinationLength:o.length});const I=de({win:Me,lose:ue,reveal:Se,revealLegendary:ye,spin:ve,play:we}),D=S.useMemo(()=>(Math.min(n.maxPayout,s*Math.max(...W.betArray)),ot()),[n.maxPayout,s]);S.useMemo(()=>Math.max(...D),[D]);const U=X.useRef(),L=S.useRef(null),F=s>0&&D.some(h=>h>0);X.useEffect(()=>()=>{U.current&&clearTimeout(U.current)},[]);const q=(h,m=0)=>{I.play("reveal",{playbackRate:1.1});const $=(m+1)*l;c($);const C=h.slice(0,$).concat(Array.from({length:p-$}).map(()=>u[0])),O=ee(C,i,l);for(let f=0;f<l;f++){const k=m*l+f;if(k<h.length&&h[k].multiplier>=Te&&O.some(_=>_.payline.includes(k))){I.play("revealLegendary");break}}if(m<i-1)U.current=setTimeout(()=>q(h,m+1),Ie);else if(m===i-1){I.sounds.spin.player.stop();const f=ee(h,i,l);b(f),U.current=setTimeout(()=>{if(M(!1),f.length>0?(w(!0),z(f[0].symbol),I.play("win"),console.log("🎰 SLOTS WIN! Triggering visual effects"),L.current?.winFlash(),L.current?.particleBurst(50,40),f.length>=3?(L.current?.screenShake(2,1e3),L.current?.particleBurst(25,60,void 0,10),L.current?.particleBurst(75,60,void 0,10)):f.length>=2?L.current?.screenShake(1.5,700):L.current?.screenShake(1,500)):(w(!1),z(null),I.play("lose"),console.log("💥 SLOTS LOSE! Triggering lose effects"),L.current?.loseFlash(),L.current?.screenShake(.5,300)),E){const k=E.payout>0;x.updateStats(k?E.payout:0)}},Ce)}},V=async()=>{if(s<=0){console.error("❌ BLOCKED: Cannot play with zero wager");return}try{M(!0),N(void 0),console.log("🎰 Starting Slots game with:",{wager:s,bet:D.slice(0,10)+"...",betLength:D.length}),await e.play({wager:s,bet:[...D]}),I.play("play"),c(0),w(!1),b([]),z(null);const h=Date.now();I.play("spin",{playbackRate:.5}),console.log("🎰 Waiting for game result...");const m=await e.result();console.log("🎰 Game result received:",{payout:m.payout,multiplier:m.multiplier});const $=Date.now()-h,C=Math.max(0,ze-$),O=`${m.resultIndex}:${m.multiplier}:${m.payout}`,f=st(p,m.multiplier,[...D],O,i,l);G(f),N(m),U.current=setTimeout(()=>q(f),C)}catch(h){console.error("🎰 SLOTS ERROR:",h),M(!1),N(void 0),c(p),w(!1),b([]),z(null);return}};return t.jsxs(t.Fragment,{children:[t.jsx(T.Portal,{target:"recentplays",children:t.jsx(he,{gameId:"slots"})}),t.jsx(T.Portal,{target:"stats",children:t.jsx(be,{gameName:"Slots",gameMode:"Classic",stats:x.stats,onReset:x.resetStats,isMobile:r})}),t.jsx(T.Portal,{target:"screen",children:t.jsxs(nt,{children:[t.jsx("div",{className:"slots-bg-elements"}),t.jsx("div",{className:"casino-bg-elements"}),t.jsx("div",{className:"decorative-overlay"}),t.jsx(Ze,{children:t.jsxs(ce,{ref:L,...B("slots")&&{title:B("slots").name,description:B("slots").description},disableContainerTransforms:!0,children:[y&&t.jsx(ge,{src:P?.image||o[0].image}),t.jsx(T.Responsive,{children:t.jsx("div",{className:"slots-content",children:t.jsxs("div",{className:"slots",children:[t.jsx("div",{className:"winning-line-display",children:t.jsx(Ue,{betArray:[...D],winningMultiplier:P?.multiplier,isWinning:y})}),t.jsxs("div",{className:`slots-reels ${H.enableMotion?"motion-enabled":"motion-disabled"}`,children:[t.jsx("div",{className:`ecg-winning-line ${y?"active":""}`}),t.jsx("div",{className:"winning-line-arrow winning-line-arrow-left",children:t.jsx("div",{className:"arrow-icon",children:"▶"})}),Array.from({length:i}).map((h,m)=>{const $=Array.from({length:l}).map((f,k)=>{const _=m*l+k;return o[_]||u[0]}),C=Array.from({length:l}).map((f,k)=>{const _=m*l+k;return y&&g.some(oe=>oe.payline.includes(_))}),O=A>m*l;return console.log(`🎰 RENDERING REEL ${m}:`,{NUM_REELS:i,NUM_ROWS:l,NUM_SLOTS:p,slotMode:a,combinationLength:o.length,reelRevealed:O,isSpinning:v&&!O,enableMotion:H.enableMotion,reelItems:$.map(f=>f?.multiplier||"undefined"),reelGoodSlots:C,slotIndicesForThisReel:Array.from({length:l}).map((f,k)=>m*l+k)}),t.jsx(qe,{reelIndex:m,revealed:O,good:C,items:$,isSpinning:v&&!O,enableMotion:H.enableMotion},m)}),t.jsx("div",{className:"winning-line-arrow winning-line-arrow-right",children:t.jsx("div",{className:"arrow-icon",children:"◀"})})]})]})})})]})})]})}),t.jsxs(T.Portal,{target:"controls",children:[t.jsx(me,{wager:s,setWager:d,onPlay:V,playDisabled:!F,playText:"Spin"}),t.jsx(xe,{onPlay:V,playDisabled:!F,playText:"Spin",children:t.jsx(fe,{value:s,onChange:d})})]})]})}export{bt as default};
