import{R as c,j as t}from"./three-D4AtYCWe.js";import{aL as j,d as l,m as H,G as r,av as X,aP as Q,aw as V,ax as Z,T as $}from"./index-Dyfdn2uN.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-DLMfKFaI.js";const q="/assets/card-BhFBcSJx.mp3",tt="/assets/finish-DCLnd53M.mp3",et="/assets/lose-Pg3x1oHK.mp3",st="/assets/play-lr1BXNxD.mp3",ot="/assets/win-BPbuAmTu.mp3",S={0:"2",1:"3",2:"4",3:"5",4:"6",5:"7",6:"8",7:"9",8:"10",9:"J",10:"Q",11:"K",12:"A"},i=Object.keys(S).length,T=H`
  0% { transform: scale(.0) translateY(100px) rotateY(90deg); }
  100% { transform: scale(1) translateY(0) rotateY(0deg) }
`,nt=l.div`
  user-select: none;
  background: #9967e300;
  transition: opacity .2s;
  ${({$disabled:e})=>e&&j`
    pointer-events: none;
    opacity: .7;
  `}
`,at=l.div`
  display: flex;
  flex-direction: column;
`,Y=l.button`
  background: none;
  border: none;
  margin: 0;
  padding: 0;
  transition: opacity .2s, background .2s ease;
  display: flex;
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
  font-size: 20px;
  color: white;
  & > div:first-child {
    font-size: 48px;
    filter: drop-shadow(-4px 4px 2px #00000066);
    margin-right: 10px;
  }

  --opacity: .5;

  &:hover {
    --opacity : 1;
  }

  ${e=>e.selected&&j`
    --opacity: 1;
  `}

  opacity: var(--opacity);
`,it=l.div`
  font-size: 18px;
  color: #005400;
  position: absolute;
  right: 0px;
  bottom: -100px;
  border-radius: 50px;
  background: #69ff6d;
  padding: 5px;
  animation: ${T} .25s cubic-bezier(0.18, 0.89, 0.32, 1.28);
`,rt=l.div`
  display: flex;
  border-radius: 5px;
  gap: 5px;
  padding: 5px;
  margin-top: 30px;
  justify-content: center;
  & > div {
    transition: opacity .2s;
  }
`,lt=l.div`
  transition: transform .2s ease;
  perspective: 500px;
  display: flex;
  position: relative;
  justify-content: flex-end;
  align-items: center;
`,ct=l.div`
  position: absolute;
  bottom: 0;
  transition: transform .25s cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity .25s ease;
  filter: drop-shadow(-10px 10px 0px #00000011);
  transform-origin: bottom;
  perspective: 500px;
  & > div {
    animation: ${T} .25s cubic-bezier(0.5, 0.9, 0.35, 1.05);
  }
`,F=l.div`
  ${e=>e.$small?j`
    height: 35px;
    font-size: 15px;
    padding: 5px;
    border-radius: 4px;
  `:j`
    height: 160px;
    font-size: 70px;
    padding: 10px;
    border-radius: 8px;
  `}
  box-shadow: -5px 5px 10px 1px #0000003d;
  background: white;
  aspect-ratio: 4/5.5;
  position: relative;
  color: #333;
  overflow: hidden;
  .rank {
    font-weight: bold;
    line-height: 1em;
  }
  .suit {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 50%;
    height: 50%;
    background-size: cover;
    background-repeat: none;
    transform: translate(0%, 0%);
    font-size: 128px;
    opacity: .9;
  }
`,dt=H`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;l.div`
  animation: ${dt} 2s ease-in-out infinite;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateX(100%) translateY(-50%);
  background-color: rgba(255, 204, 0, 0.8);
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  color: black;
  white-space: nowrap;
  pointer-events: none;
`;const f=1e4,U=()=>1+Math.floor(Math.random()*(i-1)),W=(e=U())=>({key:Math.random(),rank:e}),E=(e,d)=>Array.from({length:i}).map((p,s)=>{const o=d?e===0?s>e?BigInt(i*f)/BigInt(i-1-e):BigInt(0):s>=e?BigInt(i*f)/BigInt(i-e):BigInt(0):e===i-1?s<e?BigInt(i*f)/BigInt(e):BigInt(0):s<=e?BigInt(i*f)/BigInt(e+1):BigInt(0);return Number(o)/f}),pt=e=>{const d=e.length,p=e.reduce((s,o)=>s+o,0);if(p>d){const s=e.findIndex(o=>o===Math.max(...e));e[s]-=p-d,e[s]<0&&(e[s]=0)}return e};function ft(e){const d=r.useGame(),p=X(),s=Q(),[o,G]=c.useState([W()]),[k,M]=c.useState(!1),[h,P]=V(),[x,O]=c.useState(0),g=o[o.length-1].rank,[u,N]=c.useState(g>i/2?"lo":"hi"),[L,y]=c.useState(),B=n=>G(a=>[...a,W(n)].slice(-5)),m=Z({card:q,win:ot,lose:et,play:st,finish:tt}),C=c.useMemo(()=>E(g,!0),[g]),w=c.useMemo(()=>E(g,!1),[g]),K=c.useMemo(()=>{const n=L??u;return n==="hi"?C:n==="lo"?w:[0]},[C,w,L,u]),_=async()=>{try{if(k)return;m.play("finish",{playbackRate:.8}),setTimeout(()=>{O(0),m.play("card"),B(U()),M(!1)},300)}catch{M(!1)}},I=pt(K),A=Math.max(...I),b=s.maxPayout/A,z=Math.min(b,x||h),D=async()=>{m.play("play"),await d.play({bet:I,wager:z});const n=await d.result();B(n.resultIndex),m.play("card",{playbackRate:.8});const a=n.payout>0;setTimeout(()=>{O(n.payout),a?m.play("win"):m.play("lose")},300)};return t.jsxs(t.Fragment,{children:[t.jsx(r.Portal,{target:"screen",children:t.jsx(r.Responsive,{children:t.jsxs(nt,{$disabled:k||p.isPlaying,children:[t.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr"},children:[t.jsx(lt,{children:o.map((n,a)=>{const v=-(o.length-(a+1)),R=o.length>3?a/o.length:1,J=Math.min(1,R*3);return t.jsx(ct,{style:{transform:`translate(${v*30}px, ${-v*0}px) rotateZ(-5deg) rotateY(5deg)`,opacity:J},children:t.jsxs(F,{children:[t.jsx("div",{className:"rank",children:S[n.rank]}),t.jsx("div",{className:"suit",style:{backgroundImage:"url("+e.logo+")"}})]})},n.key)})}),t.jsxs(at,{children:[t.jsxs(Y,{selected:u==="hi",onClick:()=>N("hi"),onMouseEnter:()=>y("hi"),onMouseLeave:()=>y(void 0),children:[t.jsx("div",{children:"👆"}),t.jsxs("div",{children:["HI - (",Math.max(...C).toFixed(2),"x)"]})]}),t.jsxs(Y,{selected:u==="lo",onClick:()=>N("lo"),onMouseEnter:()=>y("lo"),onMouseLeave:()=>y(void 0),children:[t.jsx("div",{children:"👇"}),t.jsxs("div",{children:["LO - (",Math.max(...w).toFixed(2),"x)"]})]})]})]}),t.jsx(rt,{children:Array.from({length:i}).map((n,a)=>{const v=I[a]>0?.9:.5;return t.jsx(F,{$small:!0,style:{opacity:v},onClick:()=>B(a),children:t.jsx("div",{className:"rank",children:S[a]})},a)})}),x>0&&t.jsxs(it,{onClick:_,children:[t.jsx($,{amount:x})," +",Math.round(x/h*100-100).toLocaleString(),"%"]},x)]})})}),t.jsx(r.Portal,{target:"controls",children:x?t.jsxs(t.Fragment,{children:[t.jsx($,{amount:z}),t.jsx(r.Button,{disabled:p.isPlaying,onClick:_,children:"Finish"}),t.jsx(r.PlayButton,{disabled:!u,onClick:D,children:"Deal card"})]}):t.jsxs(t.Fragment,{children:[t.jsx(r.WagerInput,{value:h,onChange:P}),t.jsx(r.PlayButton,{disabled:!u||h>b,onClick:D,children:"Deal card"}),h>b&&t.jsx(r.Button,{onClick:()=>P(b),children:"Set max"})]})})]})}export{ft as default};
