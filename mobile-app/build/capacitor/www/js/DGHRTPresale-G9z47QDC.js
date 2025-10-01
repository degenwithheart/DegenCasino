import{r as o,j as e}from"./three-DV31HySq.js";import{n as $}from"./blockchain-C0nfa7Sw.js";import{d as s,j as _,k as F,u as U,l as Q,a as X,U as Y,c as V,e as J,b as R,n as A,g as K,f as q,h as ee,i as M,P as te}from"./index-BarUt2o_.js";import"./react-vendor-faCf7XlP.js";import"./physics-audio-Bm3pLP40.js";const re=s.div`
  text-align: center;
  margin-bottom: 2rem;

  .logo {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    border: 3px solid #ffd700;
    margin-bottom: 2rem;
  }

  .subtitle {
    font-size: 1.2rem;
    color: var(--text-secondary);
    margin-top: 1rem;
  }
`,oe=s.div`
  margin-bottom: 2rem;

  label {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }
`,se=s.div`
  margin-bottom: 2rem;

  label {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .token-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--slate-1);
    border: 1px solid var(--slate-6);
    border-radius: 8px;
    margin-bottom: 0.5rem;

    img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }

    .token-name {
      font-weight: 600;
      color: var(--text-primary);
    }
  }

  .token-note {
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-style: italic;
  }
`,ne=s.div`
  margin-bottom: 2rem;

  label {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .amount-input-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--slate-1);
    border: 1px solid var(--slate-6);
    border-radius: 8px;
    margin-bottom: 1rem;

    input {
      flex: 1;
      background: none;
      border: none;
      color: var(--text-primary);
      font-size: 1.2rem;
      font-weight: 600;
      outline: none;

      &::placeholder {
        color: var(--text-secondary);
      }
    }

    img {
      width: 24px;
      height: 24px;
    }

    .token-symbol {
      font-weight: 600;
      color: var(--text-primary);
    }
  }

  .quick-amounts {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
`,d=s.button`
  padding: 0.5rem 1rem;
  border: 1px solid var(--slate-6);
  border-radius: 6px;
  background: var(--slate-1);
  color: var(--text-primary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #ffd700;
    background: rgba(255, 215, 0, 0.1);
  }
`,ie=s.div`
  margin-bottom: 2rem;

  label {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .receive-amount {
    font-size: 1.5rem;
    font-weight: 700;
    color: #ffd700;
    text-align: center;
    padding: 1rem;
    background: rgba(255, 215, 0, 0.1);
    border: 1px solid rgba(255, 215, 0, 0.3);
    border-radius: 8px;
  }
`,ae=s.div`
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  font-weight: 500;
  
  ${({type:m})=>{switch(m){case"success":return`
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #22c55e;
        `;case"error":return`
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
        `;case"info":default:return`
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #3b82f6;
        `}}}
`,ue=()=>{const m=X("DGHRT Presale","Participate in the DGHRT Token presale! Get early access to our native casino token with exclusive pricing and bonuses"),[le,w]=o.useState(!1),[n,h]=o.useState(""),[f,L]=o.useState(0),[S,y]=o.useState(0),[g,j]=o.useState({total:0,remaining:0,sold:0}),[G,W]=o.useState(null),[x,v]=o.useState(!0),[p,i]=o.useState(null),{connected:u,publicKey:Z,connect:ce}=_(),{setVisible:k}=F(),{currentColorScheme:r}=U(),{connection:C}=Q(),I=1e6,a=.1,l=10,T=1e3,H=0,D="DGHRTMintAddressWillBeSetWhenMinted",N=async()=>{try{D!=="DGHRTMintAddressWillBeSetWhenMinted"||(j({total:0,remaining:0,sold:0}),W(null))}catch(t){console.error("Failed to fetch token supply:",t),j({total:0,remaining:0,sold:0})}},O=async()=>{try{const b=await C.getBalance(te)/$,z=Math.max(0,b-H);y(z),v(!1)}catch(t){console.error("Failed to fetch presale progress:",t),y(0),v(!1)}},P=async()=>{await Promise.all([O(),N()])};o.useEffect(()=>{w(!0),P();const t=setInterval(P,3e4);return()=>clearInterval(t)},[]),o.useEffect(()=>{const t=parseFloat(n)||0;L(t*I)},[n]);const c=t=>{h(t.toString())},B=async()=>{if(!u){k(!0);return}const t=parseFloat(n);if(!t||t<a){i({type:"error",message:`Minimum purchase is ${a} SOL`});return}if(t>l){i({type:"error",message:`Maximum purchase is ${l} SOL`});return}i({type:"info",message:"Processing purchase..."});try{setTimeout(()=>{i({type:"success",message:`Ready to purchase ${f.toLocaleString()} DGHRT tokens for ${t} SOL! (Enable actual transfers when token is minted)`}),h("")},1500)}catch(b){console.error("Purchase failed:",b),i({type:"error",message:"Purchase failed. Please try again."})}},E=S/T*100;return e.jsxs(e.Fragment,{children:[m,e.jsxs(Y,{$colorScheme:r,children:[e.jsx(V,{$colorScheme:r,children:"💎 $DGHRT Presale 💎"}),e.jsx(J,{$colorScheme:r,children:"Get your Heart Tokens before public launch"}),e.jsxs(R,{$colorScheme:r,children:[e.jsx(re,{children:e.jsx("img",{src:"/png/images/$DGHRT.png",alt:"DGHRT Token",className:"logo",style:{width:"120px",height:"120px",borderRadius:"50%",border:"3px solid #ffd700",marginBottom:"2rem"},onError:t=>{t.currentTarget.src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDEyMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiByeD0iNjAiIGZpbGw9InVybCgjZ3JhZGllbnQwX2xpbmVhcl8xXzEpIi8+CjxkZWZzPgo8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50MF9saW5lYXJfMV8xIiB4MT0iMCIgeTE9IjAiIHgyPSIxMjAiIHkyPSIxMjAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agc3RvcC1jb2xvcj0iI2Q0YTU3NCIvPgo8c3RvcCBvZmZzZXQ9IjAuNSIgc3RvcC1jb2xvcj0iI2I4MzY2YSIvPgo8c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNkNGE1NzQiLz4KPC9saW5lYXJHcmFkaWVudD4KPC9kZWZzPgo8dGV4dCB4PSI2MCIgeT0iNzAiIGZpbGw9IndoaXRlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtd2VpZ2h0PSJib2xkIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7wn5KOPC90ZXh0Pgo8L3N2Zz4K"}})}),e.jsxs(oe,{children:[e.jsx("label",{children:"Select Wallet"}),u?e.jsxs("div",{style:{padding:"1rem",background:"rgba(34, 197, 94, 0.1)",borderRadius:"12px",border:"1px solid rgba(34, 197, 94, 0.3)",color:"#22c55e"},children:["✅ Wallet Connected: ",Z?.toBase58().slice(0,8),"..."]}):e.jsx(A,{$colorScheme:r,onClick:()=>k(!0),style:{width:"100%"},children:"Connect Wallet"})]}),e.jsxs(se,{children:[e.jsx("label",{children:"Select payment token"}),e.jsxs("div",{className:"token-info",children:[e.jsx("img",{src:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",alt:"Solana"}),e.jsx("span",{className:"token-name",children:"Solana"})]}),e.jsx("div",{className:"token-note",children:"At the moment, payments are only available with Solana (SOL)"})]}),e.jsxs(ne,{children:[e.jsx("label",{children:"Amount"}),e.jsxs("div",{className:"amount-input-container",children:[e.jsx("input",{type:"number",value:n,onChange:t=>h(t.target.value),placeholder:"0.0",min:a,max:l,step:"0.1"}),e.jsx("img",{src:"https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",alt:"SOL",style:{width:"24px",height:"24px"}}),e.jsx("span",{className:"token-symbol",children:"SOL"})]}),e.jsxs("div",{className:"quick-amounts",children:[e.jsx(d,{onClick:()=>c(.1),children:"+0.1 SOL"}),e.jsx(d,{onClick:()=>c(.5),children:"+0.5 SOL"}),e.jsx(d,{onClick:()=>c(1),children:"+1 SOL"}),e.jsx(d,{onClick:()=>c(10),children:"+10 SOL"})]})]}),e.jsxs(ie,{children:[e.jsx("label",{children:"You will receive"}),e.jsxs("div",{className:"receive-amount",children:[f.toLocaleString()," DGHRT"]})]}),e.jsx(A,{$colorScheme:r,onClick:B,disabled:!n||parseFloat(n)<a,style:{width:"100%",marginTop:"1rem"},children:u?"Purchase DGHRT":"Connect Wallet"}),p&&e.jsx(ae,{type:p.type,children:p.message})]}),e.jsxs(R,{$colorScheme:r,children:[e.jsx(K,{$colorScheme:r,children:"🚀 Presale Information"}),e.jsxs(q,{$colorScheme:r,children:[e.jsx(ee,{$colorScheme:r,children:e.jsxs(M,{children:[e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("h4",{style:{color:"#ffd700",marginBottom:"0.5rem"},children:"Total Supply"}),e.jsxs("div",{style:{fontSize:"1.5rem",fontWeight:"bold"},children:[x?"Loading...":g.total>0?g.total.toLocaleString():"0"," DGHRT"]})]}),e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("h4",{style:{color:"#ffd700",marginBottom:"0.5rem"},children:"Tokens Sold"}),e.jsxs("div",{style:{fontSize:"1.5rem",fontWeight:"bold"},children:[x?"Loading...":g.sold.toLocaleString()," DGHRT"]})]}),e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("h4",{style:{color:"#ffd700",marginBottom:"0.5rem"},children:"SOL Raised"}),e.jsx("div",{style:{fontSize:"1.5rem",fontWeight:"bold"},children:x?"Loading...":`${S.toFixed(2)}/${T}`}),e.jsxs("div",{style:{fontSize:"0.9rem",opacity:.8},children:[E.toFixed(1),"% Complete"]})]})]})}),e.jsxs(M,{children:[e.jsxs("div",{children:[e.jsx("h4",{style:{color:"#ffd700",marginBottom:"0.5rem"},children:"Price per SOL"}),e.jsxs("p",{children:[I.toLocaleString()," DGHRT"]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{color:"#ffd700",marginBottom:"0.5rem"},children:"Min/Max Purchase"}),e.jsxs("p",{children:[a," - ",l," SOL"]})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{color:"#ffd700",marginBottom:"0.5rem"},children:"Token Status"}),e.jsx("p",{children:G?e.jsx("span",{style:{color:"#22c55e"},children:"✅ Minted"}):e.jsx("span",{style:{color:"#f59e0b"},children:"🔜 Not Yet Minted"})})]}),e.jsxs("div",{children:[e.jsx("h4",{style:{color:"#ffd700",marginBottom:"0.5rem"},children:"Network"}),e.jsx("p",{children:"Solana (SPL Token)"})]})]}),e.jsxs("div",{style:{marginTop:"2rem",textAlign:"center",fontSize:"0.9rem",opacity:.8,fontStyle:"italic"},children:["Remember: DYOR. NFA. This is not financial advice.",e.jsx("br",{}),"Presale will begin when $DGHRT token is officially minted."]})]})]})]})]})};export{ue as default};
