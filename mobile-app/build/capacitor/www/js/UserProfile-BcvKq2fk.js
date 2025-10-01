import{r as n,j as e}from"./three-DV31HySq.js";import{d as j,j as T,r as A,u as F,s as U,t as W,v as D,w as I,x as m,y as M,U as z,c as E,b as a,z as K,G as l,R as $,A as G}from"./index-BarUt2o_.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-Bm3pLP40.js";const L=j.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 2px solid #2a2a4a;
  background-color: #0f0f23;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ffd700;
    box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
  }
`,P=j.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background-color: #0f0f23;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #2a2a4a;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ffd700;
    box-shadow: 0 0 24px rgba(255, 215, 0, 0.2);
  }

  @media (max-width: 600px) {
    width: 60px;
    height: 60px;
  }
`;function O(){const t=T(),c=A(),{currentColorScheme:N}=F(),[y,d]=n.useState("Guest"),[v,f]=n.useState(""),[Y,w]=n.useState(!1),{balance:S,bonusBalance:k}=U(),s=W(),o=D(),[x,p]=n.useState(!1),h=I(),C=()=>t.disconnect(),u=t.publicKey?.toBase58(),g=u?`https://robohash.org/${u}?size=90x90&set=set5`:null;n.useEffect(()=>{if(!t.publicKey){d("Guest"),f("");return}const r=t.publicKey.toString();let i=localStorage.getItem(`username-${r}`);i||(i=m(r),localStorage.setItem(`username-${r}`,i)),d(i),f(M(r))},[t.publicKey]);const[b,B]=n.useState(!1);n.useEffect(()=>{setTimeout(()=>w(!0),50)},[]),n.useEffect(()=>{t.connecting||B(!0)},[t.connecting]),n.useEffect(()=>{b&&!t.connected&&!t.connecting&&c("/")},[b,t.connected,t.connecting,c]);const R=async()=>{try{p(!0),await o.removeInvite()}finally{p(!1)}};return e.jsxs(e.Fragment,{children:[e.jsxs(z,{children:[e.jsx(E,{children:"👤 User Profile 🎰"}),e.jsx(a,{children:e.jsxs("div",{style:{position:"relative",width:"100%",height:300,borderRadius:12,overflow:"hidden",border:"1px solid #2a2a4a",background:"#0f0f23",marginBottom:"2rem"},children:[e.jsx("img",{src:"/webp/images/casino.webp",alt:"Banner",style:{width:"100%",height:"100%",objectFit:"fill",display:"block",userSelect:"none",pointerEvents:"none"}}),g?e.jsx(L,{children:e.jsx("img",{src:g,alt:"User Avatar"})}):e.jsx(P,{children:e.jsx(K,{size:40,color:"#ccc"})}),e.jsx("div",{style:{position:"absolute",background:"rgba(255, 255, 255, 0.15)",padding:"1.5rem",borderRadius:"12px 12px 0 0",width:"100%",bottom:0,boxShadow:"0 4px 20px rgba(0, 0, 0, 0.15)",transition:"0.4s",opacity:1,transform:"translateY(0)",color:"#fff",fontSize:24,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",gap:12},children:e.jsx("span",{children:y})})]})}),e.jsx(a,{title:"📜 Degen Folk Lore",children:e.jsx("div",{style:{color:"#fff",fontFamily:"inherit",fontSize:15,lineHeight:1.5,whiteSpace:"pre-line",wordBreak:"break-word"},children:v})}),e.jsx(a,{title:"💼 Wallet Info",children:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px"},children:[e.jsxs("div",{children:[e.jsx("p",{style:{margin:0,fontWeight:"bold",color:"#fff"},children:t.publicKey?.toString()}),e.jsxs("p",{style:{margin:0,color:"#ccc",fontSize:14},children:["Connected with ",t.wallet?.adapter.name]})]}),e.jsxs("div",{style:{display:"flex",gap:12,alignItems:"center"},children:[e.jsx("a",{href:`https://solscan.io/account/${t.publicKey?.toString()}`,target:"_blank",rel:"noopener noreferrer",style:{padding:"8px 16px",border:"2px solid rgba(255, 215, 0, 0.3)",borderRadius:8,textDecoration:"none",color:"#ffd700",fontSize:14,transition:"all 0.3s ease",background:"rgba(255, 215, 0, 0.1)"},onMouseEnter:r=>{r.currentTarget.style.backgroundColor="rgba(255, 215, 0, 0.2)",r.currentTarget.style.borderColor="#ffd700",r.currentTarget.style.boxShadow="0 0 15px rgba(255, 215, 0, 0.4)"},onMouseLeave:r=>{r.currentTarget.style.backgroundColor="rgba(255, 215, 0, 0.1)",r.currentTarget.style.borderColor="rgba(255, 215, 0, 0.3)",r.currentTarget.style.boxShadow="none"},children:"🔍 View on Solscan"}),e.jsx(l.Button,{onClick:C,"aria-label":"Disconnect wallet",children:"🔌 Disconnect Wallet"})]})]})}),e.jsx(a,{title:"📊 Referral Dashboard",children:e.jsx($,{})}),e.jsx(a,{title:"🔗 Referral Connection",children:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"12px"},children:[e.jsx("div",{style:{flex:"1 1 auto",minWidth:"200px",color:"#ccc",fontSize:14},children:o.referrerAddress?x?e.jsx(e.Fragment,{children:"Removing invite..."}):e.jsxs(e.Fragment,{children:["You were invited by"," ",e.jsx("a",{target:"_blank",href:`https://solscan.io/account/${o.referrerAddress.toString()}`,rel:"noopener noreferrer",style:{color:"#ffd700",textDecoration:"underline"},children:G(o.referrerAddress.toString(),6,6)}),e.jsxs(e.Fragment,{children:[" (",m(o.referrerAddress.toBase58()),")"]}),"."]}):e.jsx("span",{children:"No referral connection yet."})}),e.jsxs("div",{style:{flex:"0 0 auto",display:"flex",gap:"8px"},children:[e.jsx(l.Button,{onClick:h.openModal,children:"🏆 Leaderboard"}),o.referrerAddress&&e.jsx(l.Button,{disabled:x,onClick:R,children:"Remove invite"})]})]})}),e.jsxs(a,{title:"💰 Token and Bonus Balance",children:[e.jsxs("p",{children:[e.jsx("b",{children:"Token Balance:"})," ",(S/Math.pow(10,s?.decimals??0)).toFixed(2),s?.name?` ${s.name}`:""]}),e.jsxs("p",{children:[e.jsx("b",{children:"Bonus Balance:"})," ",(k/Math.pow(10,s?.decimals??0)).toFixed(2)]})]})]}),h.Modal]})}export{O as Profile,O as default};
