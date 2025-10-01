import{r as g,j as t}from"./three-DV31HySq.js";import{aH as Q,aJ as Z,aI as ee,t as te,aU as ne,G as ae,bf as re,aL as se,T as P,aM as ie,b1 as oe,d as n}from"./index-BarUt2o_.js";import{u as L}from"./useGameMeta-C4Hfe5lB.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-Bm3pLP40.js";const le="/assets/win-BPbuAmTu.mp3",ce="/assets/lose-Pg3x1oHK.mp3",de="/assets/play-lr1BXNxD.mp3",ue="/assets/card-BhFBcSJx.mp3",pe=["A","2","3","4","5","6","7","8","9","T","J","Q","K"],xe=["♠","♥","♦","♣"],K=["#000000","#ff0000","#ff0000","#000000"],fe={HIGH_CARD:1,PAIR:2,TWO_PAIR:3,THREE_KIND:4,STRAIGHT:5,FLUSH:6,FULL_HOUSE:7,FOUR_KIND:8,STRAIGHT_FLUSH:9,ROYAL_FLUSH:10},c={HIGH_CARD:0,PAIR:1,TWO_PAIR:2,THREE_KIND:3,STRAIGHT:4,FLUSH:5,FULL_HOUSE:8,FOUR_KIND:15,STRAIGHT_FLUSH:25,ROYAL_FLUSH:100},ge=n.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #0f1419 0%, #1a2332 25%, #2d3748 50%, #1a2332 75%, #0f1419 100%);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`,me=n.div`
  padding: 16px 20px 8px 20px;
  background: rgba(15, 20, 25, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 215, 0, 0.3);
  z-index: 10;
`,he=n.h1`
  color: #ffd700;
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 4px 0;
  text-align: center;
`,be=n.p`
  color: #a0aec0;
  font-size: 14px;
  margin: 0;
  text-align: center;
`,ke=n.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
  min-height: 0;
`,Se=n.div`
  text-align: center;
  padding: 16px;
  margin-bottom: 20px;
  background: ${e=>e.$hasResult?e.$isWin?"rgba(255, 215, 0, 0.2)":"rgba(160, 174, 192, 0.2)":"rgba(160, 174, 192, 0.1)"};
  border: 2px solid ${e=>e.$hasResult?e.$isWin?"rgba(255, 215, 0, 0.5)":"rgba(160, 174, 192, 0.5)":"rgba(160, 174, 192, 0.3)"};
  border-radius: 16px;
  transition: all 0.3s ease;
`,Re=n.div`
  font-size: 16px;
  font-weight: ${e=>e.$hasResult?"700":"400"};
  color: ${e=>e.$hasResult&&e.$isWin?"#ffd700":"#a0aec0"};
  margin-bottom: 8px;
`,we=n.div`
  text-align: center;
  margin-bottom: 24px;
`,Ae=n.div`
  font-size: 28px;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 4px;
`,$e=n.div`
  font-size: 14px;
  color: #a0aec0;
`,ye=n.div`
  background: linear-gradient(135deg, #1a5d1a 0%, #0d2818 70%);
  border: 3px solid #ffd700;
  border-radius: 16px;
  padding: 20px;
  margin: 20px 0;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`,He=n.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`,je=n.div`
  color: #ffd700;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
`,ve=n.div`
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
`,Te=n.div`
  width: 50px;
  height: 70px;
  background: ${e=>e.$revealed?"#fff":"linear-gradient(135deg, #4a5568, #2d3748)"};
  border: 2px solid ${e=>e.$selected?"#ffd700":"#666"};
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  cursor: ${e=>e.$revealed?"pointer":"default"};
  transition: all 0.3s ease;
  position: relative;
  
  ${e=>e.$selected&&`
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
  `}
  
  &:active {
    transform: ${e=>e.$revealed?"scale(0.98)":"none"};
  }
`,Ie=n.div`
  color: ${e=>K[e.$suit]};
  font-size: 14px;
  font-weight: 700;
`,_e=n.div`
  color: ${e=>K[e.$suit]};
  font-size: 16px;
  margin-top: 2px;
`,Ce=n.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
`,M=n.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`,D=n.button`
  flex: 1;
  max-width: 120px;
  padding: 12px 8px;
  background: ${e=>e.$variant==="primary"?"linear-gradient(135deg, #ffd700, #daa520)":"rgba(15, 20, 25, 0.8)"};
  border: 2px solid ${e=>e.$variant==="primary"?"#ffd700":"rgba(255, 215, 0, 0.3)"};
  border-radius: 8px;
  color: ${e=>e.$variant==="primary"?"#1a2332":"#ffd700"};
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`,Le=n.div`
  margin-bottom: 20px;
`,De=n.div`
  background: rgba(15, 20, 25, 0.8);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
`,Ue=n.div`
  font-size: 14px;
  color: #a0aec0;
  margin-bottom: 12px;
`,We=n.div`
  font-size: 24px;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 16px;
`,Ee=n.div`
  display: flex;
  gap: 8px;
  justify-content: center;
`,y=n.button`
  background: rgba(26, 35, 50, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  padding: 8px 12px;
  color: #ffd700;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.95);
    background: rgba(26, 35, 50, 1);
  }
`,Oe=n.button`
  width: 100%;
  background: ${e=>e.$disabled?"rgba(160, 174, 192, 0.4)":"linear-gradient(135deg, #ffd700, #daa520)"};
  border: none;
  border-radius: 16px;
  padding: 18px;
  color: ${e=>e.$disabled?"#a0aec0":"#1a2332"};
  font-size: 18px;
  font-weight: 700;
  cursor: ${e=>e.$disabled?"not-allowed":"pointer"};
  transition: all 0.3s ease;
  box-shadow: ${e=>e.$disabled?"none":"0 4px 16px rgba(255, 215, 0, 0.4)"};
  
  ${e=>!e.$disabled&&`
    &:active {
      transform: scale(0.98);
      box-shadow: 0 2px 8px rgba(255, 215, 0, 0.6);
    }
  `}
`,N=()=>{const e=[];for(let a=0;a<4;a++)for(let i=0;i<13;i++)e.push({rank:i,suit:a});return e},z=e=>{const a=[...e];for(let i=a.length-1;i>0;i--){const u=Math.floor(Math.random()*(i+1));[a[i],a[u]]=[a[u],a[i]]}return a},Ge=e=>{const a=e.map(o=>o.rank).sort((o,s)=>o-s),i=e.map(o=>o.suit),u=a.reduce((o,s)=>(o[s]=(o[s]||0)+1,o),{}),d=Object.values(u).sort((o,s)=>s-o),m=i.every(o=>o===i[0]);let x=!1;return a.length===5&&(x=a[4]-a[0]===4,!x&&a.join(",")==="0,1,2,3,12"&&(x=!0)),m&&x?a.join(",")==="0,9,10,11,12"?{rank:"ROYAL_FLUSH",multiplier:c.ROYAL_FLUSH}:{rank:"STRAIGHT_FLUSH",multiplier:c.STRAIGHT_FLUSH}:d[0]===4?{rank:"FOUR_KIND",multiplier:c.FOUR_KIND}:d[0]===3&&d[1]===2?{rank:"FULL_HOUSE",multiplier:c.FULL_HOUSE}:m?{rank:"FLUSH",multiplier:c.FLUSH}:x?{rank:"STRAIGHT",multiplier:c.STRAIGHT}:d[0]===3?{rank:"THREE_KIND",multiplier:c.THREE_KIND}:d[0]===2&&d[1]===2?{rank:"TWO_PAIR",multiplier:c.TWO_PAIR}:d[0]===2?{rank:"PAIR",multiplier:c.PAIR}:{rank:"HIGH_CARD",multiplier:c.HIGH_CARD}},Je=()=>{const e=Q(),[a,i]=Z(),u=ee(),d=te(),m=ne(d?.mint),x=ae.useGame(),o=re("poker-showdown"),[s,k]=g.useState("betting"),[H,j]=g.useState([]),[U,S]=g.useState([]),[w,v]=g.useState(null),[T,I]=g.useState(!1),[R,_]=g.useState(null),h=g.useRef(null),b=se({win:le,lose:ce,play:de,card:ue}),W=(()=>{const r=Array(11).fill(0);return Object.entries(fe).forEach(([l,f])=>{const p=c[l];p>0&&(r[f]=p+1)}),r})(),A=Math.max(...W),E=a*A,B=E>u.maxPayout,O=(()=>{if(d?.mint?.equals?.(oe))return m?.baseWager??.01;const r=m?.usdPrice??0;return r>0?1/r:m?.baseWager??.01})(),Y=A>0?Math.min(u.maxPayout/A,u.balance):u.balance,G=r=>{const l=Math.max(O,a*r);i(l)},J=async()=>{if(!(a<=0))try{k("dealt"),b.play("play"),b.play("card");const l=z(N()).slice(0,5);j(l),S([!1,!1,!1,!1,!1]),I(!1),_(null),v(null)}catch(r){console.error("🃏 DEAL CARDS ERROR:",r)}},V=r=>{s==="dealt"&&(b.play("card"),S(l=>{const f=[...l];return f[r]=!f[r],f}))},X=async()=>{if(s==="dealt")try{k("draw"),b.play("card");const r=z(N());let l=5;const f=H.map(($,C)=>U[C]?r[l++]:$);j(f);const p=Ge(f);v(p),await x.play({bet:W,wager:a,metadata:[p.rank,p.multiplier]});const F=await x.result();setTimeout(()=>{k("result");const $=F.payout>0;_($?"win":"lose");const C=F.payout-a;o.updateStats(C),$?(b.play("win"),h.current?.winFlash("#ffd700",1.5),p.multiplier>=50?h.current?.screenShake(2,1e3):p.multiplier>=20?h.current?.screenShake(1.5,700):p.multiplier>=10&&h.current?.screenShake(1,500)):(b.play("lose"),h.current?.loseFlash("#a0aec0",.8)),I(!0)},1e3)}catch(r){console.error("🃏 DRAW CARDS ERROR:",r),k("betting")}},q=()=>{k("betting"),j([]),S([]),v(null),I(!1),_(null)};return t.jsxs(ge,{children:[t.jsxs(me,{children:[t.jsx(he,{children:"🃏 Poker Showdown"}),t.jsx(be,{children:"Mobile Edition • 5-Card Draw"})]}),t.jsxs(ke,{children:[t.jsx(Se,{$hasResult:T&&R!==null,$isWin:R==="win",children:t.jsx(Re,{$hasResult:T&&R!==null,$isWin:R==="win",children:T&&w?`${R==="win"?"WIN!":"BETTER LUCK NEXT TIME!"} - ${w.rank.replace("_"," ")}`:"Deal cards and make the best poker hand!"})}),t.jsxs(we,{children:[t.jsx(Ae,{children:t.jsx(P,{exact:!0,amount:E})}),t.jsxs($e,{children:["Max Win (Royal Flush: ",A,"x)"]})]}),t.jsx(ye,{children:t.jsxs(He,{children:[t.jsx(je,{children:s==="betting"?"Place Your Bet":s==="dealt"?"Select Cards to Discard":s==="draw"?"Drawing New Cards...":w?w.rank.replace("_"," "):"Your Hand"}),H.length>0&&t.jsx(ve,{children:H.map((r,l)=>t.jsxs(Te,{$revealed:!0,$selected:U[l],onClick:()=>V(l),children:[t.jsx(Ie,{$suit:r.suit,children:pe[r.rank]}),t.jsx(_e,{$suit:r.suit,children:xe[r.suit]})]},l))})]})}),s==="dealt"&&t.jsxs(Ce,{children:[t.jsxs(M,{children:[t.jsx(D,{onClick:()=>S([!1,!1,!1,!1,!1]),children:"Keep All"}),t.jsx(D,{onClick:()=>S([!0,!0,!0,!0,!0]),children:"Discard All"})]}),t.jsx(M,{children:t.jsx(D,{$variant:"primary",onClick:X,children:"Draw Cards"})})]}),s==="betting"&&t.jsx(Le,{children:t.jsxs(De,{children:[t.jsx(Ue,{children:"Wager Amount"}),t.jsx(We,{children:t.jsx(P,{exact:!0,amount:a})}),t.jsxs(Ee,{children:[t.jsx(y,{onClick:()=>G(.5),children:"1/2"}),t.jsx(y,{onClick:()=>G(2),children:"2x"}),t.jsx(y,{onClick:()=>i(O),children:"Min"}),t.jsx(y,{onClick:()=>i(Y),children:"Max"})]})]})}),t.jsx(Oe,{$disabled:e.isPlaying||s==="draw"||s==="betting"&&(a<=0||B),onClick:s==="result"?q:J,children:s==="betting"?"Deal Cards":s==="dealt"?"Select cards to discard, then draw":s==="draw"?"Drawing...":"Play Again"})]}),t.jsx(ie,{ref:h,style:{position:"absolute",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:1e3},...L("poker-showdown")&&{title:L("poker-showdown").name,description:L("poker-showdown").description}})]})};export{Je as default};
