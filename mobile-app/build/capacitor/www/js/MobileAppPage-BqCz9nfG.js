import{r as y,j as o}from"./three-D4AtYCWe.js";import{u as w,a1 as k,a2 as j,aJ as p,aK as c,d as t,aL as n,$ as m,a4 as v,a5 as F,a6 as C,S as D,a3 as z,a7 as A,m as g}from"./index-Dyfdn2uN.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-DLMfKFaI.js";const L=g`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 107, 122, 0.3);
    transform: translateY(0px) scale(1);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 107, 122, 0.6), 0 0 60px rgba(255, 215, 0, 0.2);
    transform: translateY(-3px) scale(1.02);
  }
`,P=g`
  0%, 100% {
    transform: scale(1);
    color: #FF6B7A;
  }
  50% {
    transform: scale(1.1);
    color: #FFD700;
  }
`,Y=g`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`,T=t.div`
  min-height: 100%;
  background: ${e=>e.$colorScheme.colors.background};
  color: ${e=>e.$colorScheme.colors.text};
  overflow-x: hidden;
  padding: ${p.mobile.base};
  
  ${c.tablet} {
    padding: ${p.tablet.base};
  }
  
  ${c.desktop} {
    padding: ${p.desktop.base};
  }
`,H=t.div`
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, 
    ${e=>e.$colorScheme.colors.surface}90,
    ${e=>e.$colorScheme.colors.background}50
  );
  border-radius: 20px;
  border: 2px solid ${e=>e.$colorScheme.colors.accent}40;
  position: relative;
  overflow: hidden;
  margin-bottom: 3rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      90deg,
      transparent,
      ${e=>e.$colorScheme.colors.accent}15,
      transparent
    );
    ${n`animation: ${Y} 3s ease-in-out infinite;`}
  }
  
  ${c.mobileLg} {
    padding: 2rem 1rem;
  }
`,K=t.h1`
  font-size: 3.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, ${e=>e.$colorScheme.colors.accent}, #FFD700, ${e=>e.$colorScheme.colors.secondary});
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
  z-index: 1;
  text-transform: uppercase;
  letter-spacing: 2px;
  
  ${c.mobileLg} {
    font-size: 2.5rem;
  }
  
  &::after {
    content: '💖';
    position: absolute;
    top: -10px;
    right: -20px;
    font-size: 2rem;
    ${n`animation: ${P} 2s ease-in-out infinite;`}
  }
`,B=t.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  color: ${e=>e.$colorScheme.colors.textSecondary};
  position: relative;
  z-index: 1;
`,G=t.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
`,S=t(m.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: 15px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  ${e=>e.$variant==="primary"?n`
    background: linear-gradient(135deg, ${e.$colorScheme.colors.accent}, ${e.$colorScheme.colors.secondary});
    color: white;
    border: 2px solid transparent;
    ${n`animation: ${L} 3s ease-in-out infinite;`}
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(255, 107, 122, 0.4);
    }
  `:n`
    background: ${e.$colorScheme.colors.surface};
    color: ${e.$colorScheme.colors.text};
    border: 2px solid ${e.$colorScheme.colors.accent}30;
    
    &:hover {
      border-color: ${e.$colorScheme.colors.accent};
      background: ${e.$colorScheme.colors.accent}10;
    }
  `}
  
  svg {
    font-size: 1.3rem;
  }
`,N=t.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
  
  ${c.mobileLg} {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`,O=t(m.div)`
  padding: 2rem;
  border-radius: 20px;
  background: linear-gradient(135deg, 
    ${e=>e.$colorScheme.colors.surface}80,
    ${e=>e.$colorScheme.colors.background}40
  );
  border: 2px solid ${e=>e.$colorScheme.colors.accent}20;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: ${e=>e.$colorScheme.colors.accent}60;
    transform: translateY(-5px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${e=>e.$colorScheme.colors.accent}, ${e=>e.$colorScheme.colors.secondary});
  }
`,M=t.div`
  font-size: 3rem;
  color: ${e=>e.$colorScheme.colors.accent};
  margin-bottom: 1rem;
  
  svg {
    filter: drop-shadow(0 4px 8px rgba(255, 107, 122, 0.3));
  }
`,I=t.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${e=>e.$colorScheme.colors.text};
`,E=t.p`
  color: ${e=>e.$colorScheme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`,W=t.div`
  margin: 4rem 0;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, 
    ${e=>e.$colorScheme.colors.surface}60,
    ${e=>e.$colorScheme.colors.background}20
  );
  border-radius: 20px;
  border: 2px solid ${e=>e.$colorScheme.colors.accent}30;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 50% 50%, ${e=>e.$colorScheme.colors.accent}05, transparent);
  }
`,J=t.h2`
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 3rem;
  color: ${e=>e.$colorScheme.colors.accent};
  position: relative;
  z-index: 1;
  
  &::after {
    content: '';
    display: block;
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, ${e=>e.$colorScheme.colors.accent}, ${e=>e.$colorScheme.colors.secondary});
    margin: 1rem auto;
    border-radius: 2px;
  }
`,i=t(m.div)`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${e=>e.$colorScheme.colors.surface}40;
  border-radius: 15px;
  border-left: 4px solid ${e=>e.$colorScheme.colors.accent};
  position: relative;
  z-index: 1;
  
  ${c.mobileLg} {
    flex-direction: column;
    text-align: center;
  }
  
  &:hover {
    background: ${e=>e.$colorScheme.colors.surface}60;
    transform: translateX(10px);
  }
`,a=t.div`
  font-size: 2rem;
  font-weight: 900;
  color: ${e=>e.$colorScheme.colors.accent};
  margin-right: 1.5rem;
  min-width: 60px;
  text-align: center;
  
  ${c.mobileLg} {
    margin-right: 0;
    margin-bottom: 1rem;
  }
`,l=t.div`
  flex: 1;
`,s=t.h4`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${e=>e.$colorScheme.colors.text};
`,d=t.p`
  color: ${e=>e.$colorScheme.colors.textSecondary};
  line-height: 1.6;
  margin: 0;
`,R=t.div`
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, 
    ${e=>e.$colorScheme.colors.accent}10,
    ${e=>e.$colorScheme.colors.secondary}10
  );
  border-radius: 15px;
  border: 2px solid ${e=>e.$colorScheme.colors.accent}30;
  margin: 2rem 0;
`,U=t.code`
  background: ${e=>e.$colorScheme.colors.surface};
  color: ${e=>e.$colorScheme.colors.accent};
  padding: 1rem;
  border-radius: 8px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  border: 1px solid ${e=>e.$colorScheme.colors.accent}40;
  display: inline-block;
  margin: 1rem 0;
`,X=t(m.button)`
  background: ${e=>e.$copied?e.$colorScheme.colors.success:e.$colorScheme.colors.accent};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  margin-left: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${e=>e.$copied?e.$colorScheme.colors.success:e.$colorScheme.colors.accent}40;
  }
`,ee=()=>{const{currentColorScheme:e}=w(),[$,x]=y.useState(!1),r=e||{colors:{background:"#1a1a2e",surface:"#16213e",text:"#ffffff",textSecondary:"#b0b0b0",accent:"#FF6B7A",secondary:"#FFD700",success:"#4CAF50"}},b=()=>{navigator.clipboard.writeText("https://degenheart.casino/mobile/degencasino-latest.apk"),x(!0),setTimeout(()=>x(!1),2e3)},f=[{icon:o.jsx(v,{}),title:"All Your Favorite Games",description:"Access the complete DegenHeart Casino experience on mobile. Dice, Crash, Mines, and more - all optimized for touch gameplay."},{icon:o.jsx(F,{}),title:"Lightning Fast Updates",description:"Get the latest features instantly! No need to download new APKs - updates happen automatically with degen speed."},{icon:o.jsx(C,{}),title:"Secure & Non-Custodial",description:"Your wallet, your keys, your crypto. Connect with any Solana wallet and maintain full control of your degen funds."},{icon:o.jsx(D,{}),title:"Instant Degen Payouts",description:"Winnings go directly to your wallet. No waiting, no intermediaries - just instant, provably fair degen gaming on Solana."},{icon:o.jsx(z,{}),title:"Optimized Performance",description:"Built specifically for mobile degens. Smooth animations, responsive design, and optimized for all screen sizes."},{icon:o.jsx(A,{}),title:"Cross-Device Sync",description:"Start playing on desktop, continue on mobile. Your degen progress and settings sync seamlessly across all devices."}];return o.jsxs(T,{$colorScheme:r,children:[o.jsxs(H,{$colorScheme:r,children:[o.jsx(K,{$colorScheme:r,children:"DegenHeart Mobile"}),o.jsx(B,{$colorScheme:r,children:"The ultimate degen casino experience, now in your pocket. Play anywhere, win everywhere, and let your degen heart lead the way! 💖"}),o.jsxs(G,{children:[o.jsxs(S,{as:"a",href:"https://degenheart.casino/mobile/degencasino-latest.apk",download:!0,$colorScheme:r,$variant:"primary",whileHover:{scale:1.05},whileTap:{scale:.95},children:[o.jsx(k,{}),"Download APK"]}),o.jsxs(S,{as:"button",onClick:()=>alert("iOS version coming soon! Follow us for updates 💖"),$colorScheme:r,$variant:"secondary",whileHover:{scale:1.05},whileTap:{scale:.95},children:[o.jsx(j,{}),"iOS Coming Soon"]})]}),o.jsxs(R,{$colorScheme:r,children:[o.jsx("p",{children:"Direct APK Link:"}),o.jsx(U,{$colorScheme:r,children:"https://degenheart.casino/mobile/degencasino-latest.apk"}),o.jsx("br",{}),o.jsx(X,{onClick:b,$colorScheme:r,$copied:$,whileHover:{scale:1.05},whileTap:{scale:.95},children:$?"💖 Copied!":"Copy Link"})]})]}),o.jsx(N,{children:f.map((h,u)=>o.jsxs(O,{$colorScheme:r,initial:{opacity:0,y:30},animate:{opacity:1,y:0},transition:{delay:u*.1},whileHover:{y:-5},children:[o.jsx(M,{$colorScheme:r,children:h.icon}),o.jsx(I,{$colorScheme:r,children:h.title}),o.jsx(E,{$colorScheme:r,children:h.description})]},u))}),o.jsxs(W,{$colorScheme:r,children:[o.jsx(J,{$colorScheme:r,children:"Get Started in 4 Degen Steps"}),o.jsxs(i,{$colorScheme:r,initial:{opacity:0,x:-30},animate:{opacity:1,x:0},transition:{delay:.2},children:[o.jsx(a,{$colorScheme:r,children:"1"}),o.jsxs(l,{children:[o.jsx(s,{$colorScheme:r,children:"Download & Install"}),o.jsx(d,{$colorScheme:r,children:'Download the APK file and install it on your Android device. Make sure to enable "Install from unknown sources" in your settings for the ultimate degen experience.'})]})]}),o.jsxs(i,{$colorScheme:r,initial:{opacity:0,x:-30},animate:{opacity:1,x:0},transition:{delay:.4},children:[o.jsx(a,{$colorScheme:r,children:"2"}),o.jsxs(l,{children:[o.jsx(s,{$colorScheme:r,children:"Connect Your Degen Wallet"}),o.jsx(d,{$colorScheme:r,children:"Open the app and connect your favorite Solana wallet. Phantom, Solflare, or any wallet adapter-compatible wallet works perfectly with your degen lifestyle."})]})]}),o.jsxs(i,{$colorScheme:r,initial:{opacity:0,x:-30},animate:{opacity:1,x:0},transition:{delay:.6},children:[o.jsx(a,{$colorScheme:r,children:"3"}),o.jsxs(l,{children:[o.jsx(s,{$colorScheme:r,children:"Choose Your Degen Token"}),o.jsx(d,{$colorScheme:r,children:"Select from SOL, USDC, BONK, and other supported tokens. Your mobile degen gaming session is now ready to rock!"})]})]}),o.jsxs(i,{$colorScheme:r,initial:{opacity:0,x:-30},animate:{opacity:1,x:0},transition:{delay:.8},children:[o.jsx(a,{$colorScheme:r,children:"4"}),o.jsxs(l,{children:[o.jsx(s,{$colorScheme:r,children:"Start Your Degen Journey!"}),o.jsx(d,{$colorScheme:r,children:"Enjoy all your favorite casino games with instant payouts and automatic updates. Welcome to the future of mobile degen gaming! 💖🚀"})]})]})]})]})};export{ee as default};
