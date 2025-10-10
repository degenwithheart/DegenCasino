import{j as r}from"./three-D4AtYCWe.js";import{o as i,u as n,a as s,Z as c,d as o}from"./index-Dyfdn2uN.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-DLMfKFaI.js";const d=o.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, ${({$colorScheme:e})=>e?.colors?.background||"#0a0a0a"} 0%, ${({$colorScheme:e})=>e?.colors?.surface||"#1a1a2e"} 50%, ${({$colorScheme:e})=>e?.colors?.border||"#16213e"} 100%);
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
      radial-gradient(circle at 25% 25%, ${({$colorScheme:e})=>e?.colors?.primary||"rgba(255, 215, 0, 0.03)"} 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, ${({$colorScheme:e})=>e?.colors?.secondary||"rgba(162, 89, 255, 0.03)"} 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`,l=o.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: ${({$colorScheme:e})=>e?.colors?.surface||"rgba(24, 24, 24, 0.95)"};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${({$colorScheme:e})=>e?.colors?.border||"rgba(255, 215, 0, 0.2)"};
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`,p=o.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({$colorScheme:e})=>e?.colors?.primary||"#ffd700"};
  margin: 0;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  text-shadow: 0 0 16px ${({$colorScheme:e})=>e?.colors?.primary||"#ffd700"};
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`,m=o.button`
  background: ${({$colorScheme:e})=>e?.colors?.surface||"rgba(255, 255, 255, 0.1)"};
  border: 1px solid ${({$colorScheme:e})=>e?.colors?.border||"rgba(255, 255, 255, 0.2)"};
  border-radius: 12px;
  color: ${({$colorScheme:e})=>e?.colors?.text||"#fff"};
  padding: 0.75rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${({$colorScheme:e})=>e?.colors?.surface||"rgba(255, 255, 255, 0.2)"};
    border-color: ${({$colorScheme:e})=>e?.colors?.primary||"rgba(255, 215, 0, 0.5)"};
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
  background: ${({$colorScheme:e})=>e?.colors?.surface||"rgba(24, 24, 24, 0.9)"};
  backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid ${({$colorScheme:e})=>e?.colors?.border||"rgba(255, 215, 0, 0.2)"};
  padding: 1.5rem;
  box-shadow: 0 8px 32px ${({$colorScheme:e})=>e?.colors?.shadow||"rgba(0, 0, 0, 0.3)"};
  max-width: 600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1.25rem;
    border-radius: 14px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 12px;
  }
`,x=o.p`
  color: ${({$colorScheme:e})=>e?.colors?.textSecondary||"rgba(255, 255, 255, 0.7)"};
  text-align: center;
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
  line-height: 1.5;

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
`;function w(){const e=s("Select Token","Choose your preferred cryptocurrency to play with! Select from SOL, USDC, and other supported tokens"),t=i(),a=n();return r.jsxs(d,{$colorScheme:a,children:[e,r.jsxs(l,{$colorScheme:a,children:[r.jsx(p,{$colorScheme:a,children:"🪙 Select Token"}),r.jsx(m,{$colorScheme:a,onClick:()=>t(-1),"aria-label":"Go back",children:"← Back"})]}),r.jsx(g,{children:r.jsxs(b,{$colorScheme:a,children:[r.jsx(x,{$colorScheme:a,children:"Choose your preferred token for playing games and earning rewards"}),r.jsx(c,{})]})})]})}export{w as default};
