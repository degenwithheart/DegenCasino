import{r as i,j as r}from"./three-D4AtYCWe.js";import{o as n,W as c,u as l,a as d,_ as p,d as e}from"./index-eL7pTMGs.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-DLMfKFaI.js";const b=e.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background: linear-gradient(135deg, ${({$colorScheme:o})=>o?.colors?.background||"#0a0a0a"} 0%, ${({$colorScheme:o})=>o?.colors?.surface||"#1a1a2e"} 50%, ${({$colorScheme:o})=>o?.colors?.border||"#16213e"} 100%);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 20%, ${({$colorScheme:o})=>o?.colors?.primary||"#ffd700"}11 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, ${({$colorScheme:o})=>o?.colors?.secondary||"#a259ff"}11 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }
`,f=e.header`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: ${({$colorScheme:o})=>o?.colors?.surface||"rgba(24, 24, 24, 0.95)"};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${({$colorScheme:o})=>o?.colors?.border||"rgba(255, 215, 0, 0.2)"};
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`,u=e.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({$colorScheme:o})=>o?.colors?.primary||"#ffd700"};
  margin: 0;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  text-shadow: 0 0 16px ${({$colorScheme:o})=>o?.colors?.primary||"#ffd700"};
  letter-spacing: 1px;
`,m=e.button`
  background: ${({$colorScheme:o})=>o?.colors?.surface||"rgba(255, 255, 255, 0.1)"};
  border: 1px solid ${({$colorScheme:o})=>o?.colors?.border||"rgba(255, 255, 255, 0.2)"};
  border-radius: 12px;
  color: ${({$colorScheme:o})=>o?.colors?.text||"#fff"};
  padding: 0.75rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${({$colorScheme:o})=>o?.colors?.surface||"rgba(255, 255, 255, 0.2)"};
    border-color: ${({$colorScheme:o})=>o?.colors?.primary||"rgba(255, 215, 0, 0.5)"};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`,g=e.div`
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
`;function k(){const o=d("Bonus","Claim your casino bonuses and rewards! Get free spins, deposit bonuses, and special promotions"),s=n(),{mobile:a}=c(),{currentColorScheme:t}=l();return i.useEffect(()=>{a||s("/")},[a]),r.jsxs(r.Fragment,{children:[o,r.jsxs(b,{$colorScheme:t,children:[r.jsxs(f,{$colorScheme:t,children:[r.jsx(u,{$colorScheme:t,children:"🎁 Bonus"}),r.jsx(m,{$colorScheme:t,onClick:()=>s(-1),"aria-label":"Close",children:"✕ Close"})]}),r.jsx(g,{children:r.jsx(p,{})})]})]})}export{k as default};
