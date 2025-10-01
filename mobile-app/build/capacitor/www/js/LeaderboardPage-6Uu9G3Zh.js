import{j as e}from"./three-DV31HySq.js";import{r as t,a as i,ap as n,P as d,d as o}from"./index-BarUt2o_.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-Bm3pLP40.js";const s=o.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, ${({$colorScheme:r})=>r?.colors?.background||"#0a0a0a"} 0%, ${({$colorScheme:r})=>r?.colors?.surface||"#1a1a2e"} 50%, ${({$colorScheme:r})=>r?.colors?.border||"#16213e"} 100%);
  z-index: 9999;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 30% 30%, ${({$colorScheme:r})=>r?.colors?.primary||"#ffd700"}11 0%, transparent 50%),
      radial-gradient(circle at 70% 70%, ${({$colorScheme:r})=>r?.colors?.secondary||"#a259ff"}11 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`,l=o.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: ${({$colorScheme:r})=>r?.colors?.surface||"rgba(24, 24, 24, 0.95)"};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${({$colorScheme:r})=>r?.colors?.border||"rgba(255, 215, 0, 0.2)"};
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`,c=o.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({$colorScheme:r})=>r?.colors?.primary||"#ffd700"};
  margin: 0;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  text-shadow: 0 0 16px ${({$colorScheme:r})=>r?.colors?.primary||"#ffd700"};
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`,p=o.button`
  background: ${({$colorScheme:r})=>r?.colors?.surface||"rgba(255, 255, 255, 0.1)"};
  border: 1px solid ${({$colorScheme:r})=>r?.colors?.border||"rgba(255, 255, 255, 0.2)"};
  border-radius: 12px;
  color: ${({$colorScheme:r})=>r?.colors?.text||"#fff"};
  padding: 0.75rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${({$colorScheme:r})=>r?.colors?.surface||"rgba(255, 255, 255, 0.2)"};
    border-color: ${({$colorScheme:r})=>r?.colors?.primary||"rgba(255, 215, 0, 0.5)"};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 480px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
  }
`,g=o.div`
  position: absolute;
  top: 80px; /* Account for header height */
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  padding: 1rem;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 0.75rem;
    top: 70px; /* Smaller header on mobile */
  }
`,b=o.div`
  background: ${({$colorScheme:r})=>r?.colors?.surface||"rgba(24, 24, 24, 0.95)"};
  border: 1px solid ${({$colorScheme:r})=>r?.colors?.border||"rgba(255, 215, 0, 0.2)"};
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 800px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px ${({$colorScheme:r})=>r?.colors?.shadow||"rgba(0, 0, 0, 0.3)"};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, ${({$colorScheme:r})=>r?.colors?.primary||"#ffd700"}, ${({$colorScheme:r})=>r?.colors?.secondary||"#ff6b35"});
  }

  @media (max-width: 768px) {
    margin: 1rem;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    margin: 0.5rem;
    padding: 1rem;
  }
`;function w(){const r=i("Leaderboard","Check out the top players and biggest wins! See who's leading in our casino competitions and rankings"),a=t();return e.jsxs(s,{children:[r,e.jsxs(l,{children:[e.jsx(c,{children:"🏆 Leaderboard"}),e.jsx(p,{onClick:()=>a(-1),"aria-label":"Go back",children:"← Back"})]}),e.jsx(g,{children:e.jsx(b,{children:e.jsx(n,{creator:d.toBase58()})})})]})}export{w as default};
