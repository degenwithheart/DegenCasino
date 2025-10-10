import{R as y,j as e}from"./three-D4AtYCWe.js";import{aL as F,d as p,m as G,G as d,av as $,aP as J,aw as V,ax as E,T as Q}from"./index-Dyfdn2uN.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-DLMfKFaI.js";const X="/assets/lose-Pg3x1oHK.mp3",q="/assets/play-lr1BXNxD.mp3",Z="/assets/win-BPbuAmTu.mp3",ee="/assets/card-BhFBcSJx.mp3",te="/assets/win2-DY4NvdKc.mp3",j={0:"2",1:"3",2:"4",3:"5",4:"6",5:"7",6:"8",7:"9",8:"10",9:"J",10:"Q",11:"K",12:"A"},h={0:2,1:3,2:4,3:5,4:6,5:7,6:8,7:9,8:10,9:10,10:10,11:10,12:11},k={0:"♠",1:"♥",2:"♦",3:"♣"},D={0:"black",1:"red",2:"red",3:"black"},ne=Object.keys(j).length,ae=Object.keys(k).length,A=G`
  0% { transform: scale(.0) translateY(100px) rotateY(90deg); }
  100% { transform: scale(1) translateY(0) rotateY(0deg) }
`,se=p.div`
  user-select: none;
  transition: opacity .2s;
  ${({$disabled:l})=>l&&F`
    pointer-events: none;
    opacity: .7;
  `}
`,R=p.div`
  border: 2px solid white;
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
  width: 300px;
  min-height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
`,N=p.div`
  display: flex;
  justify-content: center;
  align-items: center;
`,O=p.div`
  margin: 0 5px;
  animation: ${A} .25s cubic-bezier(0.5, 0.9, 0.35, 1.05);
`,M=p.div`
  height: 120px;
  font-size: 50px;
  padding: 10px;
  border-radius: 8px;
  box-shadow: -5px 5px 10px 1px #0000003d;
  background: white;
  aspect-ratio: 4/5.5;
  position: relative;
  color: ${l=>l.color||"#333"};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  .rank {
    font-weight: bold;
    margin-left: 5px;
  }
  .suit {
    font-size: 40px;
    margin-right: 5px;
    align-self: flex-end;
  }
`,re=p.div`
  font-size: 18px;
  color: #005400;
  margin-top: 20px;
  border-radius: 50px;
  background: #69ff6d;
  padding: 5px 10px;
  animation: ${A} .25s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  cursor: pointer;
`,oe=()=>Math.floor(Math.random()*ne),C=()=>Math.floor(Math.random()*ae),r=(l=oe(),m=C())=>({key:Math.random(),rank:l,suit:m});function he(l){const m=d.useGame(),B=$();J();const[T,w]=y.useState([]),[U,b]=y.useState([]),[g,H]=V(),[u,S]=y.useState(null),[L,ie]=y.useState(!1),c=E({win:Z,lose:X,play:q,card:ee,jackpot:te}),Y=()=>{S(null),w([]),b([])},_=async()=>{Y(),c.play("play");const t=[2.5,2.5,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0];await m.play({bet:t,wager:g});const a=await m.result(),n=a.payout/g;let s=[],x=[];n===2.5?(s=I(),x=v(21)):n===2?(s=W(),x=P(s)):(s=P(),x=K(s)),await(async()=>{for(let o=0;o<2;o++)o<s.length&&(w(i=>[...i,s[o]]),c.play("card"),await new Promise(i=>setTimeout(i,500))),o===1&&n===2.5&&c.play("jackpot"),o<x.length&&(b(i=>[...i,x[o]]),c.play("card"),await new Promise(i=>setTimeout(i,500)))})(),S(a.payout),n===2.5||(n>0?c.play("win"):c.play("lose"))},f=t=>t.reduce((a,n)=>a+h[n.rank],0),I=()=>{const a=[8,9,10,11],n=a[Math.floor(Math.random()*a.length)];return[r(12,C()),r(n,C())]},v=t=>{let a=t;for(;a>=t;){const n=r(),s=r();if(a=h[n.rank]+h[s.rank],a<t)return[n,s]}return[]},W=()=>{const t=[17,18,19,20],a=t[Math.floor(Math.random()*t.length)];return z(a)},P=t=>{const a=t?f(t):20;let n=a;for(;n>=a;){const s=[r(),r()];if(n=f(s),n<a)return s}return[]},K=t=>{const a=f(t);let n=a;for(;n<=a||n>21;){const s=[r(),r()];if(n=f(s),n>a&&n<=21)return s}return[]},z=t=>{for(let a=0;a<100;a++){const n=r(),s=r();if(h[n.rank]+h[s.rank]===t)return[n,s]}return v(t)};return e.jsxs(e.Fragment,{children:[e.jsx(d.Portal,{target:"screen",children:e.jsx(d.Responsive,{children:e.jsx(se,{$disabled:L||B.isPlaying,children:e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center"},children:[e.jsx("h2",{children:"Dealer's Hand"}),e.jsx(R,{children:e.jsx(N,{children:U.map(t=>e.jsx(O,{children:e.jsxs(M,{color:D[t.suit],children:[e.jsx("div",{className:"rank",children:j[t.rank]}),e.jsx("div",{className:"suit",children:k[t.suit]})]})},t.key))})}),e.jsx("h2",{children:"Player's Hand"}),e.jsx(R,{children:e.jsx(N,{children:T.map(t=>e.jsx(O,{children:e.jsxs(M,{color:D[t.suit],children:[e.jsx("div",{className:"rank",children:j[t.rank]}),e.jsx("div",{className:"suit",children:k[t.suit]})]})},t.key))})}),u!==null&&e.jsx(re,{children:u>0?e.jsxs(e.Fragment,{children:[e.jsx(Q,{amount:u})," +",Math.round(u/g*100-100),"%"]}):e.jsx(e.Fragment,{children:"You Lost"})},u)]})})})}),e.jsx(d.Portal,{target:"controls",children:e.jsxs(e.Fragment,{children:[e.jsx(d.WagerInput,{value:g,onChange:H}),e.jsx(d.PlayButton,{onClick:_,children:"Deal Cards"})]})})]})}export{he as default};
