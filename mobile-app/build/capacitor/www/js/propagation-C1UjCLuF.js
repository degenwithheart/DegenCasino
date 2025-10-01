import{r as p,j as r}from"./three-DV31HySq.js";import{u as P,U as k,f as S,c as A,b as h,i as L,g as D,d as o,m as u}from"./index-BarUt2o_.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-Bm3pLP40.js";function M(e,c){const a=p.useRef(0);return p.useCallback(()=>{const l=Date.now();l-a.current>c&&(a.current=l,e())},[e,c])}const $=u`
  0% { 
    box-shadow: 0 0 24px rgba(255, 215, 0, 0.3), 0 0 48px rgba(255, 215, 0, 0.2);
    border-color: rgba(255, 215, 0, 0.4);
  }
  100% { 
    box-shadow: 0 0 48px rgba(255, 215, 0, 0.6), 0 0 96px rgba(255, 215, 0, 0.4);
    border-color: rgba(255, 215, 0, 0.8);
  }
`,b=u`
  0%, 100% { opacity: 0; transform: rotate(0deg) scale(0.8); }
  50% { opacity: 1; transform: rotate(180deg) scale(1.2); }
`,z=u`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`,y=o.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 2px solid ${e=>e.$isOnline?"rgba(16, 185, 129, 0.4)":"rgba(220, 38, 127, 0.4)"};
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${e=>e.$isOnline?"radial-gradient(circle at 30% 20%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)":"radial-gradient(circle at 30% 20%, rgba(220, 38, 127, 0.05) 0%, transparent 50%)"};
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px) scale(1.02);
    border-color: ${e=>e.$isOnline?"rgba(16, 185, 129, 0.8)":"rgba(220, 38, 127, 0.8)"};
    box-shadow: ${e=>e.$isOnline?"0 20px 60px rgba(16, 185, 129, 0.2)":"0 20px 60px rgba(220, 38, 127, 0.2)"};
  }
`;o.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${({$colorScheme:e})=>e?.colors?.background||"rgba(24, 24, 24, 0.95)"}, ${({$colorScheme:e})=>e?.colors?.surface||"rgba(47, 32, 82, 0.9)"}, ${({$colorScheme:e})=>e?.colors?.border||"rgba(66, 32, 66, 0.85)"});
  padding: 1.5rem;
  position: relative;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 20%, ${({$colorScheme:e})=>e?.colors?.primary||"rgba(255, 215, 0, 0.08)"} 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, ${({$colorScheme:e})=>e?.colors?.secondary||"rgba(162, 89, 255, 0.08)"} 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, ${({$colorScheme:e})=>e?.colors?.accent||"rgba(255, 0, 204, 0.05)"} 0%, transparent 70%);
    pointer-events: none;
    z-index: -1;
  }
`;o.div`
  max-width: 112rem;
  margin: 0 auto;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: -20px;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${({$colorScheme:e})=>e?.colors?.primary||"#ffd700"}, ${({$colorScheme:e})=>e?.colors?.secondary||"#a259ff"}, ${({$colorScheme:e})=>e?.colors?.accent||"#ff00cc"}, ${({$colorScheme:e})=>e?.colors?.primary||"#ffd700"});
    background-size: 300% 100%;
    animation: ${z} 4s linear infinite;
    border-radius: 2px;
    z-index: 1;
  }
`;o.div`
  text-align: center;
  margin-bottom: 3rem;
  position: relative;

  &::before {
    content: '🌟';
    position: absolute;
    top: -20px;
    right: 20%;
    font-size: 2rem;
    animation: ${b} 3s infinite;
  }

  &::after {
    content: '✨';
    position: absolute;
    top: 20px;
    left: 15%;
    font-size: 1.5rem;
    animation: ${b} 2s infinite reverse;
  }
`;o.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: ${({$colorScheme:e})=>e?.colors?.primary||"#ffd700"};
  margin-bottom: 1rem;
  text-shadow: 0 0 16px ${({$colorScheme:e})=>e?.colors?.primary||"#ffd700"}, 0 0 32px ${({$colorScheme:e})=>e?.colors?.secondary||"#a259ff"};
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 2px;
  position: relative;
  
  @media (min-width: 768px) {
    font-size: 3rem;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 200px;
    height: 3px;
    background: linear-gradient(90deg, transparent, ${({$colorScheme:e})=>e?.colors?.primary||"#ffd700"}, ${({$colorScheme:e})=>e?.colors?.secondary||"#a259ff"}, ${({$colorScheme:e})=>e?.colors?.primary||"#ffd700"}, transparent);
    background-size: 200% 100%;
    animation: ${z} 3s linear infinite;
    border-radius: 2px;
  }
`;o.div`
  font-size: 1.25rem;
  color: ${({$colorScheme:e})=>e?.colors?.primary||"#ffd700"};
  background: ${({$colorScheme:e})=>e?.colors?.surface||"rgba(24, 24, 24, 0.8)"};
  backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 1rem 2rem;
  display: inline-block;
  border: 2px solid ${({$colorScheme:e})=>e?.colors?.border||"rgba(255, 215, 0, 0.3)"};
  box-shadow: 0 0 24px ${({$colorScheme:e})=>e?.colors?.primary||"rgba(255, 215, 0, 0.2)"};
  transition: all 0.3s ease;
  animation: ${$} 2s ease-in-out infinite alternate;
  --primary-color: ${({$colorScheme:e})=>e?.colors?.primary||"#ffd700"};
  --secondary-color: ${({$colorScheme:e})=>e?.colors?.secondary||"#a259ff"};
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 32px ${({$colorScheme:e})=>e?.colors?.primary||"rgba(255, 215, 0, 0.4)"};
    border-color: ${({$colorScheme:e})=>e?.colors?.primary||"rgba(255, 215, 0, 0.6)"};
  }
  
  code {
    color: ${({$colorScheme:e})=>e?.colors?.secondary||"#a259ff"};
    font-weight: 600;
    text-shadow: 0 0 8px ${({$colorScheme:e})=>e?.colors?.secondary||"#a259ff"};
  }
`;o.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
`;o.div`
  background: ${({$colorScheme:e})=>e?.colors?.surface||"rgba(24, 24, 24, 0.8)"};
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 2.5rem;
  border: 2px solid ${({$colorScheme:e})=>e?.colors?.border||"rgba(255, 215, 0, 0.2)"};
  box-shadow: 0 0 32px ${({$colorScheme:e})=>e?.colors?.shadow||"rgba(0, 0, 0, 0.4)"};
  animation: ${$} 2s ease-in-out infinite alternate;
  --primary-color: ${({$colorScheme:e})=>e?.colors?.primary||"#ffd700"};
  --secondary-color: ${({$colorScheme:e})=>e?.colors?.secondary||"#a259ff"};
`;o.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  .spinner {
    width: 3rem;
    height: 3rem;
    border: 3px solid ${({$colorScheme:e})=>e?.colors?.border||"rgba(255, 215, 0, 0.2)"};
    border-top: 3px solid ${({$colorScheme:e})=>e?.colors?.primary||"#ffd700"};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    box-shadow: 0 0 16px ${({$colorScheme:e})=>e?.colors?.primary||"rgba(255, 215, 0, 0.3)"};
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  p {
    color: ${({$colorScheme:e})=>e?.colors?.primary||"#ffd700"};
    font-size: 1.125rem;
    font-weight: 600;
    text-shadow: 0 0 8px ${({$colorScheme:e})=>e?.colors?.primary||"#ffd700"};
  }
`;o.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;const U=o.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`,E=o.div`
  font-size: 2rem;
  ${e=>e.$isOnline&&"animation: sparkle 3s infinite;"}
  
  @keyframes sparkle {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.1) rotate(5deg); }
  }
`,G=o.div`
  font-size: 1.75rem;
  ${e=>e.$isOnline&&"animation: bounce 2s infinite;"}
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
`,N=o.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`,R=o.h3`
  font-weight: 700;
  color: #ffd700;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  text-shadow: 0 0 8px #ffd700;
  font-family: 'Luckiest Guy', cursive, sans-serif;
  letter-spacing: 1px;
  
  ${y}:hover & {
    color: #ffffff;
    text-shadow: 0 0 16px #ffd700;
  }
`,F=o.p`
  font-size: 0.95rem;
  font-weight: 500;
  color: ${e=>e.$isOnline?"#6ee7b7":"#fca5a5"};
  text-shadow: ${e=>e.$isOnline?"0 0 4px rgba(110, 231, 183, 0.5)":"0 0 4px rgba(252, 165, 165, 0.5)"};
`,I=o.div`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 2px solid;
  transition: all 0.3s ease;
  
  background: ${e=>e.$isOnline?"rgba(16, 185, 129, 0.2)":"rgba(220, 38, 127, 0.2)"};
  
  color: ${e=>e.$isOnline?"#6ee7b7":"#fca5a5"};
  border-color: ${e=>e.$isOnline?"rgba(16, 185, 129, 0.5)":"rgba(220, 38, 127, 0.5)"};
  
  box-shadow: ${e=>e.$isOnline?"0 0 8px rgba(16, 185, 129, 0.3)":"0 0 8px rgba(220, 38, 127, 0.3)"};

  ${y}:hover & {
    transform: scale(1.05);
    box-shadow: ${e=>e.$isOnline?"0 0 16px rgba(16, 185, 129, 0.5)":"0 0 16px rgba(220, 38, 127, 0.5)"};
  }
`;o.div`
  margin-top: 4rem;
  text-align: center;
  position: relative;

  &::before {
    content: '📊';
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 2rem;
    animation: ${b} 3s infinite;
  }
`;const Y=o.div`
  display: inline-flex;
  align-items: center;
  gap: 2rem;
  background: rgba(24, 24, 24, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem 3rem;
  border: 2px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.4);
  animation: ${$} 3s ease-in-out infinite alternate;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 0 48px rgba(255, 215, 0, 0.3);
    border-color: rgba(255, 215, 0, 0.4);
  }
`,O=o.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`,C=o.div`
  width: 1rem;
  height: 1rem;
  background: ${e=>e.$color};
  border-radius: 50%;
  box-shadow: 0 0 8px ${e=>e.$color}66;
  ${e=>e.$color==="#10b981"&&"animation: propagationPulse 2s infinite;"}
  
  @keyframes propagationPulse {
    0%, 100% { 
      opacity: 1; 
      transform: scale(1);
      box-shadow: 0 0 8px ${e=>e.$color}66;
    }
    50% { 
      opacity: 0.7; 
      transform: scale(1.1);
      box-shadow: 0 0 16px ${e=>e.$color}88;
    }
  }
`,T=o.span`
  color: ${e=>e.$color};
  font-weight: 600;
  font-size: 1.1rem;
  text-shadow: 0 0 8px ${e=>e.$color}44;
`,B=o.div`
  width: 2px;
  height: 2rem;
  background: linear-gradient(to bottom, transparent, #ffd700, #a259ff, transparent);
  border-radius: 1px;
`,H=e=>String.fromCodePoint(...[...e.toUpperCase()].map(c=>127397+c.charCodeAt(0)));function X(e){const a={Google:"https://cdn-icons-png.flaticon.com/512/300/300221.png",Cloudflare:"https://cdn-icons-png.flaticon.com/512/4144/4144716.png",Quad9:"https://cdn-icons-png.flaticon.com/512/1048/1048953.png",NextDNS:"https://cdn-icons-png.flaticon.com/512/1048/1048953.png",OpenDNS:"https://cdn-icons-png.flaticon.com/512/1048/1048953.png",CleanBrowsing:"https://cdn-icons-png.flaticon.com/512/1048/1048953.png",AdGuard:"https://cdn-icons-png.flaticon.com/512/1048/1048953.png",Neustar:"https://cdn-icons-png.flaticon.com/512/1048/1048953.png",Yandex:"https://cdn-icons-png.flaticon.com/512/5968/5968705.png",PowerDNS:"https://cdn-icons-png.flaticon.com/512/1048/1048953.png"}[e]||"https://cdn-icons-png.flaticon.com/512/44/44948.png";return r.jsx("img",{src:a,alt:e+" icon",style:{width:20,height:20,objectFit:"contain",marginRight:6,verticalAlign:"middle",filter:"drop-shadow(0 0 2px #0008)"},onError:l=>{l.currentTarget.src="https://cdn-icons-png.flaticon.com/512/44/44948.png"}})}function K(){const[e,c]=p.useState(""),[a,l]=p.useState([]),[f,j]=p.useState(!1),{currentColorScheme:t}=P(),w=6e4,g=M(()=>{const m=new URLSearchParams(window.location.search).get("domain");m&&(c(m),j(!0),fetch(`/api/dns/check-dns?domain=${m}`).then(i=>{if(!i.ok)throw new Error("Failed to fetch DNS status");return i.json()}).then(i=>{Array.isArray(i)?l(i):i&&Array.isArray(i.results)?l(i.results):l([])}).catch(console.error).finally(()=>j(!1)))},w);return p.useEffect(()=>{g();const s=setInterval(()=>{g()},w);return()=>clearInterval(s)},[g]),e?r.jsxs(k,{$colorScheme:t,children:[r.jsx(A,{$colorScheme:t,style:{fontFamily:"Luckiest Guy, cursive, sans-serif",letterSpacing:"2px"},children:"🌍 Server Status"}),f&&r.jsx(h,{$colorScheme:t,children:r.jsx(S,{$colorScheme:t,style:{display:"flex",alignItems:"center",justifyContent:"center",padding:"5rem 0",textAlign:"center"},children:r.jsx("div",{style:{background:"rgba(255, 255, 255, 0.05)",backdropFilter:"blur(20px)",borderRadius:"16px",padding:"2.5rem",border:"1px solid rgba(255, 215, 0, 0.2)"},children:r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"1.5rem"},children:[r.jsx("div",{className:"spinner"}),r.jsx("p",{children:"Checking server status..."})]})})})}),!f&&r.jsx(h,{$colorScheme:t,children:r.jsx(L,{style:{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(350px, 1fr))",gap:"1.5rem"},children:a.map(({location:s,country:m,code:i,status:d,providers:v})=>r.jsxs(y,{$isOnline:d==="online",$colorScheme:t,children:[r.jsxs(U,{children:[r.jsx(E,{$isOnline:d==="online",children:H(i)}),r.jsx(G,{$isOnline:d==="online",children:d==="online"?"✅":"❌"})]}),r.jsxs(N,{children:[r.jsx(R,{children:s}),r.jsx(F,{$isOnline:d==="online",children:m}),r.jsx(I,{$isOnline:d==="online",children:d==="online"?"🟢 Online":"🔴 Offline"}),r.jsx("div",{style:{marginTop:"0.75rem"},children:r.jsxs("table",{style:{width:"100%",fontSize:"0.95rem",background:"rgba(0,0,0,0.15)",borderRadius:8,overflow:"hidden"},children:[r.jsx("thead",{children:r.jsxs("tr",{style:{color:"#ffd700",background:"rgba(162,89,255,0.08)"},children:[r.jsx("th",{style:{padding:"0.25rem 0.5rem"},children:"Provider"}),r.jsx("th",{style:{padding:"0.25rem 0.5rem"},children:"Status"}),r.jsx("th",{style:{padding:"0.25rem 0.5rem"},children:"Time"}),r.jsx("th",{style:{padding:"0.25rem 0.5rem"},children:"Checked"})]})}),r.jsx("tbody",{children:v.slice().filter(n=>typeof n.responseTimeMs=="number").sort((n,x)=>n.responseTimeMs-x.responseTimeMs).concat(v.filter(n=>typeof n.responseTimeMs!="number")).slice(0,2).map((n,x)=>r.jsxs("tr",{style:{color:n.status==="online"?"#6ee7b7":"#fca5a5"},children:[r.jsxs("td",{style:{padding:"0.25rem 0.5rem",fontWeight:600},children:[X(n.provider),n.provider]}),r.jsxs("td",{style:{padding:"0.25rem 0.5rem"},children:[n.status==="online"?"🟢 Online":"🔴 Offline",n.error&&r.jsxs("span",{style:{color:"#fca5a5",marginLeft:6,fontSize:"0.9em"},children:["(",n.error,")"]})]}),r.jsx("td",{style:{padding:"0.25rem 0.5rem"},children:typeof n.responseTimeMs=="number"?`${n.responseTimeMs} ms`:"--"}),r.jsx("td",{style:{padding:"0.25rem 0.5rem"},children:n.checkedAt?new Date(n.checkedAt).toLocaleTimeString():"--"})]},n.provider+x))})]})})]})]},`${s}-${i}`))})}),!f&&a.length>0&&r.jsxs(h,{$colorScheme:t,children:[r.jsx(D,{$colorScheme:t,children:"Statistics"}),r.jsxs(Y,{children:[r.jsxs(O,{children:[r.jsx(C,{$color:"#10b981"}),r.jsxs(T,{$color:"#6ee7b7",children:[a.filter(s=>s.status==="online").length," Online"]})]}),r.jsx(B,{}),r.jsxs(O,{children:[r.jsx(C,{$color:"#dc2626"}),r.jsxs(T,{$color:"#fca5a5",children:[a.filter(s=>s.status==="offline").length," Offline"]})]})]})]})]}):r.jsx(k,{$colorScheme:t,children:r.jsx(S,{$colorScheme:t,style:{padding:"1rem",textAlign:"center",color:"#dc2626"},children:"Missing domain query parameter"})})}export{K as default};
