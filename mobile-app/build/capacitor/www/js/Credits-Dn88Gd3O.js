import{j as t}from"./three-D4AtYCWe.js";import{u as d,d as r,m as o}from"./index-Dyfdn2uN.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-DLMfKFaI.js";const m=o`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;o`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;const p=o`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(212, 165, 116, 0.3);
  }
  50% { 
    box-shadow: 0 0 30px rgba(212, 165, 116, 0.6), 0 0 60px rgba(184, 51, 106, 0.4);
  }
`,a=o`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`,g=r.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  min-height: calc(100vh - 200px);
  
  background: linear-gradient(135deg, 
    rgba(10, 5, 17, 0.95) 0%,
    rgba(25, 15, 35, 0.98) 50%,
    rgba(15, 8, 22, 0.95) 100%
  );
  
  border-radius: 20px;
  border: 1px solid rgba(212, 165, 116, 0.3);
  backdrop-filter: blur(20px);
  
  /* Romantic glassmorphism effect */
  box-shadow: 
    0 20px 60px rgba(139, 90, 158, 0.15),
    0 8px 32px rgba(212, 165, 116, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  /* Elegant border animation */
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      transparent 30%, 
      rgba(212, 165, 116, 0.1) 50%, 
      transparent 70%
    );
    background-size: 200% 200%;
    animation: ${a} 8s ease-in-out infinite;
    pointer-events: none;
    border-radius: 20px;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
    border-radius: 15px;
  }
`,h=r.h1`
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 1rem;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  
  background: linear-gradient(135deg, 
    ${({$colorScheme:e})=>e?.colors?.primary||"#ffd700"} 0%,
    ${({$colorScheme:e})=>e?.colors?.secondary||"#a259ff"} 50%,
    ${({$colorScheme:e})=>e?.colors?.accent||"#ff00cc"} 100%
  );
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${a} 6s ease-in-out infinite;
  
  text-shadow: 0 0 30px rgba(212, 165, 116, 0.5);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 2rem;
  }
`,u=r.p`
  text-align: center;
  font-size: 1.2rem;
  color: ${({$colorScheme:e})=>e?.colors?.textSecondary||"rgba(255, 255, 255, 0.8)"};
  margin-bottom: 3rem;
  font-style: italic;
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
`,b=r.section`
  margin-bottom: 3rem;
  padding: 2rem;
  
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(212, 165, 116, 0.2);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  
  transition: all 0.3s ease;
  animation: ${m} 6s ease-in-out infinite;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(212, 165, 116, 0.4);
    box-shadow: 0 15px 40px rgba(139, 90, 158, 0.2);
  }
  
  &:nth-child(even) {
    animation-delay: 1s;
  }
  
  &:nth-child(3n) {
    animation-delay: 2s;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
`,f=r.h2`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: ${({$colorScheme:e})=>e?.colors?.primary||"#ffd700"};
  
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '';
    width: 4px;
    height: 30px;
    background: linear-gradient(180deg, 
      ${({$colorScheme:e})=>e?.colors?.primary||"#ffd700"} 0%,
      ${({$colorScheme:e})=>e?.colors?.secondary||"#a259ff"} 100%
    );
    border-radius: 2px;
    animation: ${p} 3s ease-in-out infinite;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`,x=r.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`,w=r.a`
  display: block;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(212, 165, 116, 0.15);
  border-radius: 10px;
  transition: all 0.3s ease;
  text-decoration: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(212, 165, 116, 0.3);
    transform: scale(1.02);
    box-shadow: 0 8px 25px rgba(212, 165, 116, 0.2);
  }
  
  /* Hover shimmer effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(212, 165, 116, 0.1), 
      transparent
    );
    transition: left 0.5s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  /* External link indicator */
  &::after {
    content: '↗';
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    color: ${({$colorScheme:e})=>e?.colors?.primary||"#ffd700"};
    font-size: 0.9rem;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::after {
    opacity: 0.7;
  }
`,y=r.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({$colorScheme:e})=>e?.colors?.text||"#fff"};
  margin-bottom: 0.5rem;
`,k=r.p`
  font-size: 0.9rem;
  color: ${({$colorScheme:e})=>e?.colors?.textSecondary||"rgba(255, 255, 255, 0.7)"};
  line-height: 1.4;
`,S=r.div`
  text-align: center;
  padding: 3rem 2rem;
  margin-top: 2rem;
  
  background: linear-gradient(135deg, 
    rgba(212, 165, 116, 0.1) 0%,
    rgba(184, 51, 106, 0.08) 50%,
    rgba(139, 90, 158, 0.1) 100%
  );
  
  border-radius: 15px;
  border: 1px solid rgba(212, 165, 116, 0.3);
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
  }
`,v=r.p`
  font-size: 1.3rem;
  color: ${({$colorScheme:e})=>e?.colors?.text||"#fff"};
  font-weight: 300;
  line-height: 1.6;
  font-style: italic;
  
  &::before, &::after {
    content: '"';
    font-size: 2rem;
    color: ${({$colorScheme:e})=>e?.colors?.primary||"#ffd700"};
    opacity: 0.6;
  }
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;function P(){const{currentColorScheme:e}=d(),s=[{category:"Blockchain & Gaming",items:[{name:"Solana",description:"High-performance blockchain powering our casino",url:"https://solana.com"},{name:"Gamba SDK v2",description:"Provably fair gaming engine and smart contracts",url:"https://gamba.so"},{name:"@solana/web3.js",description:"Solana blockchain interaction library",url:"https://solana-labs.github.io/solana-web3.js"},{name:"@solana/wallet-adapter",description:"Seamless wallet integration",url:"https://github.com/solana-labs/wallet-adapter"}]},{category:"Frontend Framework",items:[{name:"React 18",description:"Modern UI framework with concurrent features",url:"https://react.dev"},{name:"TypeScript",description:"Type-safe JavaScript for robust development",url:"https://www.typescriptlang.org"},{name:"Vite",description:"Lightning-fast build tool and dev server",url:"https://vitejs.dev"},{name:"React Router",description:"Client-side routing and navigation",url:"https://reactrouter.com"}]},{category:"Styling & Design",items:[{name:"styled-components",description:"CSS-in-JS for component styling",url:"https://styled-components.com"},{name:"Tailwind CSS",description:"Utility-first CSS framework",url:"https://tailwindcss.com"},{name:"React Icons",description:"Beautiful iconography throughout the app",url:"https://react-icons.github.io/react-icons"},{name:"Luckiest Guy Font",description:"Playful typography for gaming aesthetics",url:"https://fonts.google.com/specimen/Luckiest+Guy"}]},{category:"State & Data Management",items:[{name:"Zustand",description:"Lightweight state management solution",url:"https://zustand-demo.pmnd.rs"},{name:"React Context",description:"Global state for themes and network",url:"https://react.dev/reference/react/createContext"},{name:"Local Storage",description:"Persistent user preferences",url:"https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"},{name:"Service Workers",description:"Background processing and caching",url:"https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API"}]},{category:"Performance & Infrastructure",items:[{name:"Vercel",description:"Edge deployment and global CDN",url:"https://vercel.com"},{name:"Edge Functions",description:"Server-side logic at the edge",url:"https://vercel.com/docs/functions/edge-functions"},{name:"Smart Caching",description:"Intelligent API response caching",url:"https://web.dev/cache-api-quick-guide"},{name:"Bundle Splitting",description:"Optimized asset loading",url:"https://webpack.js.org/guides/code-splitting"}]},{category:"External Services",items:[{name:"Helius",description:"Enhanced Solana RPC and data services",url:"https://helius.xyz"},{name:"Syndica",description:"High-performance Solana RPC endpoints",url:"https://syndica.io"},{name:"CoinGecko",description:"Real-time cryptocurrency price feeds",url:"https://www.coingecko.com"},{name:"GitHub",description:"Version control and collaboration",url:"https://github.com"}]}];return t.jsxs(g,{$colorScheme:e,children:[t.jsx(h,{$colorScheme:e,children:"Credits & Acknowledgments"}),t.jsx(u,{$colorScheme:e,children:"A heartfelt thank you to all the incredible technologies and teams that made DegenHeart Casino possible"}),s.map((i,c)=>t.jsxs(b,{$colorScheme:e,children:[t.jsx(f,{$colorScheme:e,children:i.category}),t.jsx(x,{children:i.items.map((n,l)=>t.jsxs(w,{$colorScheme:e,href:n.url,target:"_blank",rel:"noopener noreferrer",children:[t.jsx(y,{$colorScheme:e,children:n.name}),t.jsx(k,{$colorScheme:e,children:n.description})]},l))})]},c)),t.jsx(S,{$colorScheme:e,children:t.jsx(v,{$colorScheme:e,children:"Without these amazing tools, libraries, and services, DegenHeart Casino wouldn't exist. Every component, every animation, every blockchain interaction stands on the shoulders of giants. Thank you to all the developers, maintainers, and communities who make building incredible experiences possible. This is what happens when passion meets open-source innovation. 💜"})})]})}export{P as default};
