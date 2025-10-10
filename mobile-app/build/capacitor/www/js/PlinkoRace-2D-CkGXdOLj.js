var ht=Object.defineProperty;var mt=(t,o,s)=>o in t?ht(t,o,{enumerable:!0,configurable:!0,writable:!0,value:s}):t[o]=s;var ie=(t,o,s)=>mt(t,typeof o!="symbol"?o+"":o,s);import{r as a,j as n}from"./three-D4AtYCWe.js";import{aT as yt,aU as gt,aV as ot,aW as bt,aX as xt,aY as rt,aZ as Le,a_ as vt,j as _e,a$ as St,G as re,b0 as kt,d as D,$ as de,ac as Oe,b1 as wt,ax as Pe,m as Mt,b2 as Rt,b3 as He,b4 as jt,P as ze,b5 as Ke,aQ as Ye}from"./index-eL7pTMGs.js";import{n as Ce,K as at}from"./blockchain-C0nfa7Sw.js";import{M as ne,m as z}from"./matter-Csocjh7Y.js";import"./react-vendor-faCf7XlP.js";import"./physics-audio-DLMfKFaI.js";function Xe(t,o){if(typeof t=="function")return t(o);t!=null&&(t.current=o)}function Et(...t){return o=>{let s=!1;const c=t.map(r=>{const h=Xe(r,o);return!s&&typeof h=="function"&&(s=!0),h});if(s)return()=>{for(let r=0;r<c.length;r++){const h=c[r];typeof h=="function"?h():Xe(t[r],null)}}}}function Ct(...t){return a.useCallback(Et(...t),t)}class Bt extends a.Component{getSnapshotBeforeUpdate(o){const s=this.props.childRef.current;if(s&&o.isPresent&&!this.props.isPresent){const c=s.offsetParent,r=gt(c)&&c.offsetWidth||0,h=this.props.sizeRef.current;h.height=s.offsetHeight||0,h.width=s.offsetWidth||0,h.top=s.offsetTop,h.left=s.offsetLeft,h.right=r-h.width-h.left}return null}componentDidUpdate(){}render(){return this.props.children}}function It({children:t,isPresent:o,anchorX:s,root:c}){const r=a.useId(),h=a.useRef(null),f=a.useRef({width:0,height:0,top:0,left:0,right:0}),{nonce:u}=a.useContext(yt),p=Ct(h,t?.ref);return a.useInsertionEffect(()=>{const{width:y,height:E,top:b,left:w,right:M}=f.current;if(o||!h.current||!y||!E)return;const x=s==="left"?`left: ${w}`:`right: ${M}`;h.current.dataset.motionPopId=r;const d=document.createElement("style");u&&(d.nonce=u);const v=c??document.head;return v.appendChild(d),d.sheet&&d.sheet.insertRule(`
          [data-motion-pop-id="${r}"] {
            position: absolute !important;
            width: ${y}px !important;
            height: ${E}px !important;
            ${x}px !important;
            top: ${b}px !important;
          }
        `),()=>{v.contains(d)&&v.removeChild(d)}},[o]),n.jsx(Bt,{isPresent:o,childRef:h,sizeRef:f,children:a.cloneElement(t,{ref:p})})}const Pt=({children:t,initial:o,isPresent:s,onExitComplete:c,custom:r,presenceAffectsLayout:h,mode:f,anchorX:u,root:p})=>{const y=ot(Tt),E=a.useId();let b=!0,w=a.useMemo(()=>(b=!1,{id:E,initial:o,isPresent:s,custom:r,onExitComplete:M=>{y.set(M,!0);for(const x of y.values())if(!x)return;c&&c()},register:M=>(y.set(M,!1),()=>y.delete(M))}),[s,y,c]);return h&&b&&(w={...w}),a.useMemo(()=>{y.forEach((M,x)=>y.set(x,!1))},[s]),a.useEffect(()=>{!s&&!y.size&&c&&c()},[s]),f==="popLayout"&&(t=n.jsx(It,{isPresent:s,anchorX:u,root:p,children:t})),n.jsx(bt.Provider,{value:w,children:t})};function Tt(){return new Map}const we=t=>t.key||"";function Ve(t){const o=[];return a.Children.forEach(t,s=>{a.isValidElement(s)&&o.push(s)}),o}const it=({children:t,custom:o,initial:s=!0,onExitComplete:c,presenceAffectsLayout:r=!0,mode:h="sync",propagate:f=!1,anchorX:u="left",root:p})=>{const[y,E]=xt(f),b=a.useMemo(()=>Ve(t),[t]),w=f&&!y?[]:b.map(we),M=a.useRef(!0),x=a.useRef(b),d=ot(()=>new Map),[v,T]=a.useState(b),[R,k]=a.useState(b);rt(()=>{M.current=!1,x.current=b;for(let l=0;l<R.length;l++){const i=we(R[l]);w.includes(i)?d.delete(i):d.get(i)!==!0&&d.set(i,!1)}},[R,w.length,w.join("-")]);const e=[];if(b!==v){let l=[...b];for(let i=0;i<R.length;i++){const j=R[i],_=we(j);w.includes(_)||(l.splice(i,0,j),e.push(j))}return h==="wait"&&e.length&&(l=e),k(Ve(l)),T(b),null}const{forceRender:m}=a.useContext(Le);return n.jsx(n.Fragment,{children:R.map(l=>{const i=we(l),j=f&&!y?!1:b===R||w.includes(i),_=()=>{if(d.has(i))d.set(i,!0);else return;let N=!0;d.forEach(Q=>{Q||(N=!1)}),N&&(m?.(),k(x.current),f&&E?.(),c&&c())};return n.jsx(Pt,{isPresent:j,initial:!M.current||s?void 0:!1,custom:o,presenceAffectsLayout:r,mode:h,root:p,onExitComplete:j?void 0:_,anchorX:u,children:l},i)})})},At=a.createContext(null);function Wt(){const t=a.useRef(!1);return rt(()=>(t.current=!0,()=>{t.current=!1}),[]),t}function $t(){const t=Wt(),[o,s]=a.useState(0),c=a.useCallback(()=>{t.current&&s(o+1)},[o]);return[a.useCallback(()=>vt.postRender(c),[c]),o]}const Dt=t=>!t.isLayoutDirty&&t.willUpdate(!1);function qe(){const t=new Set,o=new WeakMap,s=()=>t.forEach(Dt);return{add:c=>{t.add(c),o.set(c,c.addEventListener("willUpdate",s))},remove:c=>{t.delete(c);const r=o.get(c);r&&(r(),o.delete(c)),s()},dirty:s}}const lt=t=>t===!0,Ft=t=>lt(t===!0)||t==="id",Lt=({children:t,id:o,inherit:s=!0})=>{const c=a.useContext(Le),r=a.useContext(At),[h,f]=$t(),u=a.useRef(null),p=c.id||r;u.current===null&&(Ft(s)&&p&&(o=o?p+"-"+o:p),u.current={id:o,group:lt(s)&&c.group||qe()});const y=a.useMemo(()=>({...u.current,forceRender:h}),[f]);return n.jsx(Le.Provider,{value:y,children:t})},Ot=D(de.div)`
  position: absolute;  /* inside canvas */
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`,_t=D(de.div)`
  background: #1c1c1c;
  padding: 24px;
  border-radius: 8px;
  width: 92%;
  max-width: 420px;
  color: #fff;
  border: 1px solid #333;
  box-shadow: 0 12px 36px rgba(0,0,0,0.5);
`,Gt=D.h2`
  margin: 0 0 16px;
  font-size: 1.4rem;
  font-weight: 700;
`,Be=D.div`
  margin-bottom: 16px;
`,ye=D.label`
  display: block;
  font-size: 0.9rem;
  margin-bottom: 6px;
  color: #a9a9b8;
`,Nt=D.div`
  display: flex;
  gap: 8px;
`,Ae=D.button`
  flex: 1;
  padding: 10px;
  border: 1px solid ${({active:t})=>t?"#fff":"#333"};
  border-radius: 6px;
  background: ${({active:t})=>t?"#fff":"#222"};
  color: ${({active:t})=>t?"#111":"#fff"};
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease;
  &:hover:not(:disabled) {
    background: ${({active:t})=>t?"#eee":"#333"};
  }
`,Me=D.input`
  box-sizing: border-box;
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #333;
  border-radius: 6px;
  background: #222;
  color: #fff;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  &:focus {
    outline: none;
    border-color: #555;
  }
`,Ut=D.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`,Ht=D.button`
  flex: 1;
  padding: 8px;
  border: 1px solid #333;
  border-radius: 6px;
  background: #222;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;
  &:hover {
    background: #333;
  }
`,zt=D.div`
  display: flex;
  gap: 12px;
`,Qe=D(Be)`
  flex: 1;
  margin-bottom: 0;
`,Kt=D.p`
  font-size: 0.85rem;
  color: #bbb;
  margin: 12px 0 0;
  line-height: 1.3;
`,Yt=D.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
`,Ze=D.button`
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: background 0.2s ease;
  background: ${({variant:t})=>t==="primary"?"#fff":"#333"};
  color: ${({variant:t})=>t==="primary"?"#111":"#fff"};
  &:hover:not(:disabled) {
    background: ${({variant:t})=>t==="primary"?"#eee":"#444"};
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,Xt=D.p`
  color: #e74c3c;
  margin: 10px 0 0;
  text-align: center;
  font-size: 0.9rem;
`;function Vt({isOpen:t,onClose:o}){const{publicKey:s}=_e(),{createGame:c}=St(),[r,h]=a.useState(10),[f,u]=a.useState("sameWager"),[p,y]=a.useState(1),[E,b]=a.useState(.1),[w,M]=a.useState(5),[x,d]=a.useState(!1),[v,T]=a.useState(null),R=async()=>{if(!s)return T("Connect wallet first");d(!0),T(null);const k=60,e=Math.min(r,5),l={mint:kt,creatorAddress:s,maxPlayers:r,softDuration:k,preAllocPlayers:e,winnersTarget:1,wagerType:["sameWager","customWager","betRange"].indexOf(f),payoutType:0};if(f==="sameWager"){const i=Math.floor(p*Ce);l.wager=i,l.minBet=i,l.maxBet=i}else if(f==="customWager")l.wager=0,l.minBet=0,l.maxBet=0;else{const i=Math.floor(E*Ce),j=Math.floor(w*Ce);l.wager=i,l.minBet=i,l.maxBet=j}try{await c(l),o()}catch(i){console.error(i),T(i.message||"Failed to create game")}finally{d(!1)}};return n.jsx(re.Portal,{target:"screen",children:n.jsx(it,{children:t&&n.jsx(Ot,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},transition:{duration:.2},children:n.jsxs(_t,{initial:{opacity:0,scale:.96},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.98},transition:{duration:.2},children:[n.jsx(Gt,{children:"Create Plinko Race"}),n.jsxs(Be,{children:[n.jsx(ye,{children:"Max Players"}),n.jsx(Me,{type:"number",min:2,max:1e3,value:r,onChange:k=>h(Number(k.target.value))})]}),n.jsxs(Be,{children:[n.jsx(ye,{children:"Wager Type"}),n.jsxs(Nt,{children:[n.jsx(Ae,{active:f==="sameWager",onClick:()=>u("sameWager"),children:"Same"}),n.jsx(Ae,{active:f==="betRange",onClick:()=>u("betRange"),children:"Range"}),n.jsx(Ae,{active:f==="customWager",onClick:()=>u("customWager"),children:"Unlimited"})]})]}),f==="sameWager"&&n.jsxs(Be,{children:[n.jsx(ye,{children:"Wager (SOL)"}),n.jsx(Me,{type:"number",lang:"en-US",inputMode:"decimal",min:.05,step:.01,value:p,onChange:k=>y(Number(k.target.value))}),n.jsx(Ut,{children:[.1,.5,1].map(k=>n.jsxs(Ht,{onClick:()=>y(k),children:[k," SOL"]},k))})]}),f==="betRange"&&n.jsxs(zt,{children:[n.jsxs(Qe,{children:[n.jsx(ye,{children:"Min Bet (SOL)"}),n.jsx(Me,{type:"number",min:.01,step:.01,value:E,onChange:k=>b(Number(k.target.value))})]}),n.jsxs(Qe,{children:[n.jsx(ye,{children:"Max Bet (SOL)"}),n.jsx(Me,{type:"number",min:E,step:.01,value:w,onChange:k=>M(Number(k.target.value))})]})]}),n.jsx(Kt,{children:"⚠️Creating a game requires paying refundable “rent” to cover on-chain storage. You’ll get it back automatically once the game ends."}),v&&n.jsx(Xt,{children:v}),n.jsxs(Yt,{children:[n.jsx(Ze,{onClick:o,disabled:x,children:"Cancel"}),n.jsx(Ze,{variant:"primary",onClick:R,disabled:x,children:x?"Creating…":"Create"})]})]})})})})}const ct="/assets/lobby-BXw65rDG.mp3",X=700,q=700,xe=5,K=13,qt=.9,Je=.6,et=14,Qt=4,Zt=4;var I=(t=>(t.Blank="blank",t.Score="score",t.Multiplier="mult",t.ExtraBall="extraBall",t.Kill="kill",t.Deduct="deduct",t.Dynamic="dynamic",t))(I||{});const U=[{type:"dynamic"},{type:"score",value:10},{type:"mult",value:2.5},{type:"score",value:6},{type:"mult",value:1.5},{type:"score",value:3},{type:"dynamic"},{type:"score",value:3},{type:"mult",value:1.5},{type:"score",value:6},{type:"mult",value:2.5},{type:"score",value:10},{type:"dynamic"}],se=["blank","extraBall","mult","deduct"],Ge=5,Ne=5,Y=60;U.findIndex(t=>t.type==="dynamic");const ut=180;class Ie{constructor(){ie(this,"engine");ie(this,"world");ie(this,"runner");this.engine=ne.Engine.create({gravity:{y:qt},timing:{timeScale:Qt}}),this.runner=ne.Runner.create({isFixed:!0}),this.world=this.engine.world,z.Composite.add(this.world,[...this.buildPegs(),...this.buildBarriers()])}tick(o=16){ne.Runner.tick(this.runner,this.engine,o)}getBodies(){return z.Composite.allBodies(this.world)}cleanup(){ne.Runner.stop(this.runner),ne.World.clear(this.world,!1),ne.Engine.clear(this.engine)}buildPegs(){const o=q/(et+2);let s=0;return Array.from({length:et}).flatMap((c,r,h)=>{const f=r+1,u=X*r/(h.length-1),p=f===1?0:u/(f-1);return Array.from({length:f}).map((y,E)=>ne.Bodies.circle(X/2-u/2+p*E,o*r+o/2,xe,{isStatic:!0,restitution:Je,label:"Peg",plugin:{pegIndex:s++}}))}).slice(3)}buildBarriers(){const o=X/U.length;return[0,...U.map((s,c)=>o*(c+1))].map(s=>ne.Bodies.rectangle(s,q-Y/2,4,Y*1.2,{isStatic:!0,restitution:Je,label:"Barrier"}))}}const Jt=300,tt=["#ff9aa2","#ffb7b2","#ffdac1","#e2f0cb","#b5ead7","#c7ceea"];function en(){const t=a.useRef(),o=a.useRef([]),s=a.useRef(0),c=a.useRef({});return a.useEffect(()=>{const r=new Ie;return t.current=r,()=>r.cleanup()},[]),a.useEffect(()=>{let r;const h=f=>{const u=t.current;if(f-s.current>Jt){s.current=f;const p=X/2+(Math.random()*200-100),y=tt[Math.floor(Math.random()*tt.length)],E=z.Bodies.circle(p,-K,K,{restitution:.4,label:"Ball",plugin:{color:y}});o.current.push(E),z.Composite.add(u.world,E)}u.tick(16),o.current=o.current.filter(p=>p.position.y>q+80?(z.Composite.remove(u.world,p),!1):!0),r=requestAnimationFrame(h)};return r=requestAnimationFrame(h),()=>cancelAnimationFrame(r)},[]),n.jsx(re.Canvas,{style:{position:"absolute",inset:0,zIndex:0,pointerEvents:"none",background:"transparent"},render:({ctx:r,size:h})=>{const f=t.current;if(!f)return;const u=Math.min(h.width/X,h.height/q);r.clearRect(0,0,h.width,h.height),r.save(),r.translate((h.width-X*u)/2,(h.height-q*u)/2),r.scale(u,u);const p=f.getBodies(),y=p.filter(d=>d.label==="Peg");r.fillStyle="#555",y.forEach(d=>{r.beginPath(),r.arc(d.position.x,d.position.y,xe,0,2*Math.PI),r.fill()});const E=p.filter(d=>d.label==="Barrier");r.fillStyle="#333",E.forEach(d=>{r.beginPath(),d.vertices.forEach((v,T)=>T?r.lineTo(v.x,v.y):r.moveTo(v.x,v.y)),r.closePath(),r.fill()});const b=performance.now(),w=p.filter(d=>d.label==="Ball"),M=U.length,x=X/M;w.forEach(d=>{const v=d.position.x;if(d.position.y+K>=q-Y){const R=Math.floor(v/x);R>=0&&R<M&&(c.current[R]=b)}});for(let d=0;d<M;d++){const v=d*x,T=q-Y,R=c.current[d]||0,k=b-R,e=Math.max(0,1-k/250),m=d/M*360;if(r.fillStyle=`hsla(${m}, 70%, 50%, 0.5)`,r.fillRect(v,T,x,Y),e>0){const l=r.createLinearGradient(0,T,0,T-Y*3);l.addColorStop(0,`hsla(${m}, 80%, 70%, ${.4*e})`),l.addColorStop(1,"rgba(0,0,0,0)"),r.fillStyle=l,r.fillRect(v,T-Y*3,x,Y*3)}}w.forEach(d=>{const v=d.plugin.color||"#ffb74d";r.fillStyle=v,r.beginPath(),r.arc(d.position.x,d.position.y,K,0,2*Math.PI),r.fill()}),r.restore()}})}const P={sound:null,count:0,timer:0,sub:null,muted:!1};try{const t=localStorage.getItem("plinkorace_music_muted");t!=null&&(P.muted=t==="1")}catch{}function Te(t){P.sound=t;const o=Oe.getState().volume;t.gain.set({gain:P.muted?0:o}),P.sub||(P.sub=Oe.subscribe(s=>{P.sound&&P.sound.gain.set({gain:P.muted?0:s.volume})}))}function Ue(){try{P.sound?.player.stop()}catch{}P.sound=null,P.sub?.(),P.sub=null}function tn(t){P.muted=t;try{localStorage.setItem("plinkorace_music_muted",t?"1":"0")}catch{}const o=Oe.getState().volume;try{P.sound?.gain.set({gain:t?0:o})}catch{}}function dt(){tn(!P.muted)}const We=t=>t/Ce,nn=t=>t.toBase58().slice(0,4)+"...",sn=t=>{const o=Math.ceil(t/1e3),s=Math.floor(o/60),c=o%60;return`${s}:${c.toString().padStart(2,"0")}`},on=D.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  border: 1px solid #202533;
  border-radius: 12px;
  padding: 16px;
`,rn=D.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`,nt=D.button`
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
`,an=D.table`
  width: 100%;
  border-collapse: collapse;
`,ge=D.th`
  text-align: left;
  padding: 8px 12px;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  border-bottom: 1px solid #333;
`,$e=D.tr`
  &:hover {
    background: ${({$clickable:t})=>t?"#a2a2a26c":"inherit"};
  }
  cursor: ${({$clickable:t})=>t?"pointer":"default"};
`,ue=D.td`
  padding: 10px 12px;
  font-size: 0.95rem;
  border-bottom: 3px solid #222;
`;function ln({onSelect:t,onDebug:o}){const{games:s,loading:c,refresh:r}=wt({winnersTarget:1},0),{play:h,sounds:f}=Pe({lobby:ct},{disposeOnUnmount:!1});a.useEffect(()=>{const b=f.lobby;if(clearTimeout(P.timer),P.count+=1,!P.sound){b.player.loop=!0;const w=()=>{b.ready?(h("lobby"),Te(b)):setTimeout(w,100)};w()}return()=>{P.count-=1,P.count===0&&(P.timer=setTimeout(Ue,200))}},[h,f]);const[u,p]=a.useState(!1),[y,E]=a.useState(Date.now());return a.useEffect(()=>{const b=setInterval(()=>E(Date.now()),1e3);return()=>clearInterval(b)},[]),n.jsxs("div",{style:{position:"relative",width:"100%",height:"100%"},children:[n.jsx(en,{}),n.jsxs(on,{style:{position:"relative",zIndex:1},children:[n.jsxs(rn,{children:[n.jsx(nt,{onClick:()=>p(!0),children:"＋ Create Game"}),n.jsx(nt,{onClick:r,children:c?"Loading…":"Refresh"})]}),n.jsxs(an,{children:[n.jsx("thead",{children:n.jsxs("tr",{children:[n.jsx(ge,{children:"ID"}),n.jsx(ge,{children:"Maker"}),n.jsx(ge,{children:"Players"}),n.jsx(ge,{children:"Bet"}),n.jsx(ge,{children:"Starts In"})]})}),n.jsxs("tbody",{children:[s.map(b=>{const{gameId:w,gameMaker:M,players:x,maxPlayers:d,wagerType:v,wager:T,minBet:R,maxBet:k,softExpirationTimestamp:e,state:m}=b.account;let l;"sameWager"in v?l=`${We(T.toNumber()).toFixed(2)} SOL`:"customWager"in v?l="Unlimited":l=`${We(R.toNumber()).toFixed(2)} – ${We(k.toNumber()).toFixed(2)} SOL`;const j=Number(e)*1e3-y,_=m.waiting?j>0?n.jsx("span",{style:{color:"#FFD700",fontWeight:"bold"},children:sn(j)}):n.jsx("span",{style:{color:"#00FF99",fontWeight:"bold"},children:"Ready to start"}):n.jsx("span",{style:{color:"#FF5555",fontWeight:"bold"},children:"Started"});return n.jsxs($e,{$clickable:!0,onClick:()=>t(b.publicKey),children:[n.jsxs(ue,{children:["#",w.toString()]}),n.jsx(ue,{children:nn(M)}),n.jsxs(ue,{children:[x.length," / ",d]}),n.jsx(ue,{children:l}),n.jsx(ue,{children:_})]},b.publicKey.toBase58())}),n.jsx($e,{$clickable:!0,onClick:o,children:n.jsx(ue,{colSpan:5,style:{textAlign:"center",fontStyle:"italic"},children:"🐞 Debug Simulator"})}),!c&&s.length===0&&n.jsx($e,{children:n.jsx(ue,{colSpan:5,style:{textAlign:"center",opacity:.8},children:"No live games – create one!"})})]})]}),n.jsx(Vt,{isOpen:u,onClose:()=>p(!1)})]}),n.jsx("button",{onClick:dt,style:{position:"absolute",right:12,bottom:12,zIndex:999,padding:"8px 12px",fontWeight:600,background:P.muted?"#444":"#222",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",opacity:.9},title:P.muted?"Unmute music":"Mute music",children:P.muted?"Unmute Music":"Mute Music"})]})}function cn(t){return new TextEncoder().encode(t).reduce((c,r)=>(c<<5)-c+r>>>0,0)}function un(t){let o=t>>>0;return()=>{o+=1831565813;let s=Math.imul(o^o>>>15,1|o);return s=s+Math.imul(s^s>>>7,61|s)^s,((s^s>>>14)>>>0)/4294967296}}function dn(t){const o=cn(t);return un(o)}const pn=2e5,De=150,fn=100,be=4,hn=q*.5;class mn{constructor(o,s){ie(this,"players");ie(this,"rng");ie(this,"staticWorld",new Ie);ie(this,"replayWorld");this.players=o,this.rng=s?dn(s):Math.random}recordRace(o,s=fn){if(this.players.length===0)return{winnerIndex:-1,paths:[],offsets:[],pathOwners:[],events:[],totalFrames:0};for(let c=1;c<=De;c++){const r=this.runSingleAttempt(o,s);if(r){try{console.log(`[PlinkoRace] recordRace: success on attempt ${c}/${De} (players=${this.players.length}, winnerIdx=${o}, frames=${r.totalFrames})`)}catch{}return r}}try{console.warn(`[PlinkoRace] recordRace: failed to find a valid run after ${De} attempts (players=${this.players.length}, winnerIdx=${o})`)}catch{}throw new Error("No valid run found")}runSingleAttempt(o,s){const c=new Ie,r=z.Composite.create();z.Composite.add(c.world,r);const h=()=>X/2+(this.rng()*16-8),f=[],u=[],p=[],y=[],E=new Float32Array(this.players.length),b=new Float32Array(this.players.length).fill(1),w=[];this.players.forEach((m,l)=>{f[l]=h(),u[l]=l,p[l]=[];const i=z.Bodies.circle(f[l],-10,K,{restitution:.4,collisionFilter:{group:-1},label:"Ball",plugin:{playerIndex:l}});y[l]=i,z.Composite.add(r,i)});const M=U.map((m,l)=>m.type===I.Dynamic?l:-1).filter(m=>m>=0),x=se.findIndex(m=>m===I.Blank),d=se.map((m,l)=>l).filter(m=>m!==x),v=M.map(()=>Math.floor(this.rng()*d.length));M.forEach((m,l)=>{w.push({frame:0,player:-1,kind:"bucketPattern",value:v[l],bucket:m})});const T=new Array(U.length).fill(x);let R=0;const k=(m,l)=>{ne.Body.setPosition(m,{x:f[l],y:-10}),ne.Body.setVelocity(m,{x:0,y:0})};let e=0;e:for(let m=0;m<pn;m++){if(M.length&&m>0&&m%ut===0){R++;for(let l=0;l<M.length;l++){const i=M[l],j=R===0?x:d[(R-1+v[l])%d.length];T[i]=j,w.push({frame:m,player:-1,kind:"bucketMode",value:j,bucket:i})}}c.tick();for(let l=0;l<y.length;l++){const i=y[l],j=u[l];if(p[l].push(i.position.x,i.position.y),i.position.x<0||i.position.x>X||i.position.y>q){k(i,l);continue}if(i.position.y>=q-Y){const _=X/U.length,N=Math.floor(i.position.x/_);this.handleBucketHit({bucket:U[N],bucketIndex:N,dynModeIdx:T[N]??x,ballBody:i,ballPathIx:l,playerIx:j,frame:m,events:w,balls:y,paths:p,offsets:f,pathOwners:u,mults:b,scores:E,layer:r}),k(i,l)}if(j!==o&&E[j]>=s)return c.cleanup(),null;if(j===o&&E[j]>=s&&Array.from(E).every((_,N)=>N===o||_<s)){e=m+1;break e}}}return c.cleanup(),e?(p.forEach(m=>{m.length=e*2}),w.forEach(m=>m.frame*=be),{winnerIndex:o,paths:p.map(m=>new Float32Array(m)),offsets:f,pathOwners:u,events:w,totalFrames:e*be}):null}handleBucketHit(o){const{bucket:s,bucketIndex:c,dynModeIdx:r,ballBody:h,ballPathIx:f,playerIx:u,frame:p,events:y,balls:E,paths:b,offsets:w,pathOwners:M,mults:x,scores:d,layer:v}=o,T=se[r],R=s.type===I.Dynamic?{type:T,value:T===I.Multiplier?Ge:T===I.Deduct?Ne:s.value}:s;switch(R.type){case I.Blank:break;case I.Score:{const k=(R.value??0)*x[u];d[u]+=k,y.push({frame:p,player:u,kind:"score",value:k,bucket:c}),x[u]=1}break;case I.Multiplier:{const k=R.value??1,e=x[u],m=Math.min((e===1?0:e)+k,64);x[u]=m,y.push({frame:p,player:u,kind:"mult",value:k,bucket:c})}break;case I.Deduct:{const e=(R.value??0)*x[u];d[u]=Math.max(0,d[u]-e),y.push({frame:p,player:u,kind:"deduct",value:e,bucket:c}),x[u]=1}break;case I.ExtraBall:{y.push({frame:p,player:u,kind:"extraBall",bucket:c});const k=Math.min(Math.max(w[f]+(this.rng()*30-15),K),X-K),e=z.Bodies.circle(k,-10,K,{restitution:.4,collisionFilter:{group:-1},label:"Ball",plugin:{playerIndex:u}});E.push(e),z.Composite.add(v,e),w.push(k),M.push(u);const m=p+1,l=[];for(let i=0;i<m;i++)l.push(k,-10);b.push(l)}break;case I.Kill:y.push({frame:p,player:u,kind:"ballKill",bucket:c}),z.Composite.remove(v,h),E[f]=z.Bodies.circle(-999,-999,1,{isStatic:!0});break}}replayRace(o,s){this.replayWorld?.cleanup();const c=new Ie;this.replayWorld=c;const r=[],h=x=>{const d=o.pathOwners[x],v=z.Bodies.circle(o.offsets[x],-10,K,{isStatic:!0,label:"Ball",plugin:{playerIndex:d}});r[x]=v,z.Composite.add(c.world,v)};this.players.forEach((x,d)=>h(d));let f=0;const u=o.totalFrames,y=1e3/60;let E=performance.now(),b=0;const w=()=>{o.events.forEach(v=>{v.kind==="extraBall"&&v.frame===f&&h(r.length)});const x=Math.floor(f/be),d=f%be/be;r.forEach((v,T)=>{const R=o.paths[T];if(R.length<2)return;const k=R.length/2-1,e=Math.min(x,k),m=Math.min(e+1,k),l=R[e*2],i=R[e*2+1],j=R[m*2],_=R[m*2+1],[N,Q]=i-_>hn?d===0?[l,i]:[j,_]:[l*(1-d)+j*d,i*(1-d)+_*d];ne.Body.setPosition(v,{x:N,y:Q})}),s?.(f),f++},M=x=>{for(b+=x-E,E=x;b>=y&&f<u;)w(),b-=y;f<u&&requestAnimationFrame(M)};requestAnimationFrame(M)}getBodies(){return[...this.staticWorld.getBodies(),...this.replayWorld?this.replayWorld.getBodies():[]]}cleanup(){this.staticWorld.cleanup(),this.replayWorld?.cleanup()}}function yn(t,o){const[s,c]=a.useState(null);a.useEffect(()=>{const f=new mn(t,o);return c(f),()=>f.cleanup()},[t.map(f=>f.id).join(","),o]);const r=a.useCallback((f,u)=>{if(!s)throw new Error("Engine not ready");return s.recordRace(f,u)},[s]),h=a.useCallback((f,u)=>{if(!s)throw new Error("Engine not ready");s.replayRace(f,u)},[s]);return{engine:s,recordRace:r,replayRace:h}}const gn=Mt`
  0%   { transform: translate(-50%, -50%) scale(0); opacity: 0; }
  12%  { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
  80%  { transform: translate(-50%, -50%) scale(1);   opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(0);   opacity: 0; }
`,bn=D.div`
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Impact', sans-serif;
  font-size: 64px;
  letter-spacing: 2px;
  color: #fff;
  text-shadow: 0 0 10px #000;
  pointer-events: none;
  animation: ${gn} 1.5s cubic-bezier(.2,1.2,.6,1) forwards;
`;function xn({message:t}){const[o,s]=a.useState(null);return a.useEffect(()=>{if(!t)return;s(t);const c=setTimeout(()=>s(null),1500);return()=>clearTimeout(c)},[t]),o?n.jsx(bn,{children:o.text}):null}const st=12,Fe=10,vn=(K+xe)**2;function Sn(t,o){const s=t.type===I.Dynamic?{type:se[o],value:se[o]===I.Multiplier?Ge:se[o]===I.Deduct?Ne:t.value}:t;switch(s.type){case I.Score:return{hue:220,label:`${s.value} ▲`};case I.Multiplier:return{hue:120,label:`${s.value}×`};case I.Deduct:return{hue:10,label:`-${s.value} ▼`};case I.ExtraBall:return{hue:60,label:"+1"};case I.Kill:return{hue:0,label:"☠"};case I.Blank:return{hue:30,label:"–"};default:return{hue:30,label:"–"}}}function kn(t,o,s){if(t.type!==I.Dynamic)return null;const c=se.findIndex(p=>p===I.Blank),r=se.map((p,y)=>y).filter(p=>p!==c),h=o===c?r[s%r.length]:r[(r.indexOf(o)+1)%r.length],f=se[h],u={type:f,value:f===I.Multiplier?Ge:f===I.Deduct?Ne:t.value};switch(u.type){case I.Score:return{hue:220,label:`${u.value} ▼`};case I.Multiplier:return{hue:120,label:`${u.value}×`};case I.Deduct:return{hue:10,label:`-${u.value}`};case I.ExtraBall:return{hue:60,label:"+1"};case I.Kill:return{hue:0,label:"☠"};case I.Blank:return{hue:30,label:"–"};default:return{hue:30,label:"–"}}}function wn(t){const{engine:o,dynModes:s,patternOffsets:c,started:r,bucketAnim:h,pegAnim:f,particles:u,arrowPos:p,labelPos:y,mults:E,roster:b,metadata:w,youIdx:M,popups:x}=t,d=a.useRef({}),v=a.useRef(s);v.current!==s&&(U.forEach((e,m)=>{if(e.type!==I.Dynamic)return;const l=v.current[m]??0,i=s[m]??0;l!==i&&(d.current[m]=performance.now())}),v.current=s),r&&U.forEach((e,m)=>{e.type===I.Dynamic&&d.current[m]==null&&(d.current[m]=performance.now())});const T=ut*Zt/60*1e3,R=a.useRef(null),k=a.useRef({x:0,y:0,w:0,h:0});return a.useEffect(()=>{const e=m=>{const l=R.current;if(!l)return;const i=l.getBoundingClientRect(),j=m.clientX-i.left,_=m.clientY-i.top,{x:N,y:Q,w:fe,h:oe}=k.current;j>=N&&j<=N+fe&&_>=Q&&_<=Q+oe&&(dt(),m.stopPropagation(),m.preventDefault())};return window.addEventListener("click",e),()=>window.removeEventListener("click",e)},[]),n.jsx(re.Canvas,{render:({ctx:e,size:m,canvas:l})=>{if(!o)return;R.current=l,e.clearRect(0,0,m.width,m.height),e.fillStyle="#0b0b13",e.fillRect(0,0,m.width,m.height);const i=Math.min(m.width/X,m.height/q),j=(m.width-X*i)/2,_=(m.height-q*i)/2;e.save(),e.translate(j,_),e.scale(i,i);const N=o.getBodies(),Q=N.filter(B=>B.label==="Ball"),fe=N.filter(B=>B.label==="Peg"),oe=(B,g,L)=>B+(g-B)*L,J=.15;Q.forEach(B=>{const{x:g,y:L}=B.position;fe.forEach(W=>{const{x:O,y:S}=W.position,A=g-O,C=L-S;if(A*A+C*C<vn){const $=W.plugin?.pegIndex??-1;$>=0&&(f[$]=1)}})});for(let B=u.length-1;B>=0;B--){const g=u[B];if(--g.life<=0){u.splice(B,1);continue}g.x+=g.vx,g.y+=g.vy,g.opacity*=.96,g.size*=.98,e.fillStyle=`rgba(255,180,0,${g.opacity})`,e.beginPath(),e.arc(g.x,g.y,g.size,0,2*Math.PI),e.fill()}const Z=X/U.length;U.forEach((B,g)=>{let L=h[g]||0;L>0&&(h[g]=L*.85);const W=g*Z,O=q-Y,S=W+Z/2,A=O+Y/2,C=s[g]??0,{hue:$,label:F}=Sn(B,C),G=U.slice(0,g+1).filter(H=>H.type===I.Dynamic).length-1,ae=kn(B,C,c[G]??0);if(L>.02){const H=Y*3*L,V=e.createLinearGradient(0,O,0,O-H);V.addColorStop(0,`hsla(${$},80%,70%,${.4*L})`),V.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=V,e.fillRect(W,O-H,Z,H)}e.fillStyle=`hsla(${$},70%,50%,0.3)`,e.fillRect(W,O,Z,Y),e.font="bold 18px sans-serif",e.textAlign="center",e.textBaseline="middle",e.lineWidth=3,e.strokeStyle=`hsla(${$},60%,20%,1)`,e.strokeText(F,S,A),e.fillStyle=`hsla(${$},80%,75%,1)`,e.fillText(F,S,A);for(let H=0;H<x.length;H++){const V=x[H];if(V.bucketIndex!==g)continue;V.life-=1,V.y+=.8;const ve=Math.max(0,Math.min(1,V.life/30)),Se=V.value>=0,ke=`${Se?"+":""}${Math.abs(V.value).toFixed(1).replace(/\.0$/,"")}`,me=O-8-V.y;e.font="bold 16px sans-serif",e.textAlign="center",e.textBaseline="middle",e.lineWidth=4,e.strokeStyle=`rgba(0,0,0,${.5*ve})`,e.strokeText(ke,S,me),e.fillStyle=Se?`rgba(34,197,94,${ve})`:`rgba(239,68,68,${ve})`,e.fillText(ke,S,me)}if(ae){e.font="12px sans-serif",e.textAlign="center",e.textBaseline="top",e.fillStyle=`hsla(${ae.hue},80%,75%,0.9)`,e.fillText(ae.label,S,O+4);const H=d.current[g]??performance.now(),V=performance.now()-H,Se=1-Math.min(Math.max(V/T,0),1),ke=Math.min(Z,Y)*.45;e.save(),e.translate(S,A),e.beginPath(),e.lineWidth=3,e.strokeStyle=`hsla(${$},80%,70%,0.9)`;const me=-Math.PI/2;e.arc(0,0,ke,me,me+Math.PI*2*Se),e.stroke(),e.restore()}}),N.forEach(B=>{if(B.label==="Barrier"){e.beginPath(),B.vertices.forEach((g,L)=>L?e.lineTo(g.x,g.y):e.moveTo(g.x,g.y)),e.closePath(),e.fillStyle="#444",e.fill();return}if(B.label==="Peg"){const g=B.plugin?.pegIndex??-1;let L=f[g]||0;L>0&&(f[g]=L*.9),e.save(),e.translate(B.position.x,B.position.y),e.scale(1+L*.4,1+L*.4);const W=(B.position.x+B.position.y+Date.now()*.05)%360;e.fillStyle=`hsla(${W},75%,60%,${(1+L*2)*.2})`,e.beginPath(),e.arc(0,0,xe+4,0,2*Math.PI),e.fill(),e.fillStyle=`hsla(${W},85%,${75+L*25}%,1)`,e.beginPath(),e.arc(0,0,xe,0,2*Math.PI),e.fill(),e.restore();return}}),Q.forEach(B=>{const g=B.plugin?.playerIndex,L=E[g]??1,{x:W,y:O}=B.position;if(!Number.isFinite(W)||!Number.isFinite(O))return;const S=b[g].id,A=w[S];if(L>1){e.globalCompositeOperation="lighter";const C=K*2,$=e.createRadialGradient(W,O,0,W,O,C);$.addColorStop(0,"rgba(255,255,200,0.5)"),$.addColorStop(1,"rgba(255,255,200,0)"),e.fillStyle=$,e.beginPath(),e.arc(W,O,C,0,2*Math.PI),e.fill(),e.globalCompositeOperation="source-over"}if(L>=5&&u.length<200){e.globalCompositeOperation="lighter";const C=K*1.2,$=.8+Math.random()*.4,F=C*2.3*$,G=e.createRadialGradient(W,O,0,W,O,F);G.addColorStop(0,`rgba(255,180,0,${.6*$})`),G.addColorStop(1,"rgba(255,0,0,0)"),e.fillStyle=G,e.beginPath(),e.arc(W,O,F,0,2*Math.PI),e.fill();const ae=C*.8*$,H=e.createRadialGradient(W,O,0,W,O,ae);H.addColorStop(0,"rgba(255,255,220,1)"),H.addColorStop(1,"rgba(255,200,0,0)"),e.fillStyle=H,e.beginPath(),e.arc(W,O,ae,0,2*Math.PI),e.fill(),e.globalCompositeOperation="source-over",u.push({x:W+(Math.random()-.5)*5,y:O+(Math.random()-.5)*5,size:2+Math.random()*2,opacity:.5+Math.random()*.5,life:20+Math.random()*10,vx:(Math.random()-.5)*.5,vy:(Math.random()-.5)*.5-.5})}if(e.fillStyle=b[g%b.length].color,e.beginPath(),e.arc(W,O,K,0,2*Math.PI),e.fill(),g===M){const C=W,$=O-K-2,F=p.get(B.id)??{px:C,py:$};F.px=oe(F.px,C,J),F.py=oe(F.py,$,J),p.set(B.id,F),e.fillStyle="#fff",e.beginPath(),e.moveTo(F.px,F.py),e.lineTo(F.px-st/2,F.py-Fe),e.lineTo(F.px+st/2,F.py-Fe),e.closePath(),e.fill()}if(A){const C=K+6+(g===M?Fe:0),$=W,F=O-C,G=y.get(B.id)??{px:$,py:F};G.px=oe(G.px,$,J),G.py=oe(G.py,F,J),y.set(B.id,G),e.font="12px sans-serif",e.textAlign="center",e.textBaseline="bottom",e.lineWidth=3,e.strokeStyle="rgba(0,0,0,0.7)",e.strokeText(A,G.px,G.py),e.fillStyle="#ffffff",e.fillText(A,G.px,G.py)}});const pe=new Set(Q.map(B=>B.id));p.forEach((B,g)=>{pe.has(g)||p.delete(g)}),y.forEach((B,g)=>{pe.has(g)||y.delete(g)}),e.restore();const he=8,le=130,ce=34,ee=m.width-le-he,te=m.height-ce-he;k.current={x:ee,y:te,w:le,h:ce},e.fillStyle="rgba(0,0,0,0.6)",e.strokeStyle="rgba(255,255,255,0.2)",e.lineWidth=1,e.beginPath(),e.roundRect(ee,te,le,ce,8),e.fill(),e.stroke(),e.font="600 13px system-ui, sans-serif",e.fillStyle="#fff",e.textAlign="center",e.textBaseline="middle",e.fillText(P.muted?"Unmute Music":"Mute Music",ee+le/2,te+ce/2)}})}const Mn=1e9;function Rn({roster:t,scores:o,mults:s,targetPoints:c,final:r=!1,payouts:h=[],metadata:f={}}){const u=t.map((p,y)=>({p,s:o[y]??0,m:s[y]??1,w:h[y]??0,name:f[p.id]??""})).sort((p,y)=>y.s-p.s);return n.jsx(Lt,{children:n.jsxs(de.div,{layoutId:"scoreboard-container",layout:!0,transition:{type:"spring",stiffness:260,damping:28},style:{position:"absolute",top:r?void 0:10,left:r?void 0:10,inset:r?0:void 0,margin:r?"auto":void 0,width:r?360:"auto",maxWidth:r?"90%":void 0,maxHeight:r?"80%":void 0,overflowY:r?"auto":void 0,background:"rgba(0,0,0,0.75)",padding:r?"16px 24px":"8px 12px",borderRadius:12,color:"#fff",fontSize:r?18:14,boxShadow:"0 4px 10px rgba(0,0,0,0.5)",zIndex:400},children:[n.jsxs("div",{style:{marginBottom:r?12:8,textAlign:"center"},children:[n.jsxs("div",{style:{fontWeight:700,letterSpacing:.3},children:["Race to ",c]}),(()=>{const p=u[0]?.s??0,y=Math.max(0,Math.min(1,p/c))*100;return n.jsx("div",{style:{marginTop:6,marginLeft:"auto",marginRight:"auto",maxWidth:r?280:220,height:r?8:6,borderRadius:10,background:"rgba(255,255,255,0.05)",overflow:"hidden"},children:n.jsx("div",{style:{width:`${y}%`,height:"100%",background:"#22c55e",boxShadow:"0 0 8px rgba(34,197,94,0.35)"}})})})()]}),r&&n.jsxs(de.div,{layout:"position",style:{display:"grid",gridTemplateColumns:"40px 1fr 60px 100px",gap:12,fontSize:16,fontWeight:600,marginBottom:12,textTransform:"uppercase",opacity:.8},children:[n.jsx("div",{children:"#"}),n.jsx("div",{children:"Player"}),n.jsx("div",{style:{textAlign:"right"},children:"Score"}),n.jsx("div",{style:{textAlign:"right"},children:"Payout"})]}),n.jsx(it,{children:u.map(({p,name:y,s:E,m:b,w},M)=>n.jsxs(de.div,{layout:!0,initial:{opacity:0,y:-6},animate:{opacity:1,y:0},exit:{opacity:0,y:6},transition:{type:"spring",stiffness:260,damping:28},style:{display:"flex",alignItems:"center",marginBottom:r?8:6,fontSize:r?18:14},children:[n.jsx("div",{style:{width:r?14:12,height:r?14:12,background:p.color,borderRadius:4}}),r&&n.jsx("div",{style:{width:26,textAlign:"center",marginLeft:8},children:M+1}),n.jsx("div",{style:{marginLeft:8,marginRight:8,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:y||`${p.id.slice(0,4)}…`}),!r&&b>1&&n.jsxs(de.div,{layout:!0,initial:{scale:.8,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.8,opacity:0},style:{marginRight:8,marginLeft:10,padding:"2px 6px",background:"#222",borderRadius:4,fontFamily:"monospace",color:p.color,fontSize:12},children:["×",b]}),n.jsx("div",{style:{width:r?60:15,textAlign:"right",fontFamily:"monospace"},children:Number.isInteger(E)?E.toString().padStart(c.toString().length," "):E.toFixed(1)}),r&&n.jsxs(de.div,{layout:!0,initial:{width:0,opacity:0},animate:{width:100,opacity:1},exit:{width:0,opacity:0},style:{marginLeft:24,textAlign:"right",fontFamily:"monospace",color:w?"#ffd700":"#888",overflow:"hidden"},children:[(w/Mn).toFixed(2)," SOL"]})]},p.id))})]})})}const jn="/assets/extraball-DdWHhTNO.mp3",En="/assets/readygo-CgyenfA7.mp3",Cn="/assets/fall-B80AaX79.mp3",Bn="/assets/bigcombo-fvuoFgIw.mp3",In="/assets/finsh-DiltAugL.mp3",Pn="/assets/ouch-1Nk5r8E8.mp3";function pt({players:t,winnerIdx:o,metadata:s={},youIndexOverride:c,gamePk:r,targetPoints:h=100,payouts:f,onFinished:u}){const p=a.useMemo(()=>{const g=["#e6194B","#3cb44b","#ffe119","#4363d8","#f58231","#911eb4","#46f0f0","#f032e6","#bcf60c","#fabebe","#008080","#e6beff","#9a6324","#fffac8","#800000","#aaffc3","#808000","#ffd8b1","#000075","#a9a9a9"];return t.map((L,W)=>({id:L.toBase58(),color:g[W%g.length]}))},[t]),{publicKey:y}=_e(),E=a.useMemo(()=>c??p.findIndex(g=>g.id===y?.toBase58()),[p,y,c]),{engine:b,recordRace:w,replayRace:M}=yn(p,r),[x,d]=a.useState([]),[v,T]=a.useState([]),[R,k]=a.useState([]),[e,m]=a.useState(!1),[l,i]=a.useState([]),[j,_]=a.useState(!1),[N,Q]=a.useState(null),[fe,oe]=a.useState([]),J=g=>{Q({text:g,key:Date.now()})},Z=a.useRef({}).current,pe=a.useRef({}).current,he=a.useRef([]).current,le=a.useRef(new Map).current,ce=a.useRef(new Map).current,{play:ee,sounds:te}=re.useSound({ready:En,extra:jn,fall:Cn,finish:In,bigcombo:Bn,ouch:Pn}),B=a.useRef(0);return a.useEffect(()=>{d(Array(p.length).fill(0)),T(Array(p.length).fill(1)),k([]),m(!1),_(!1),Object.keys(Z).forEach(g=>Z[+g]=0),Object.keys(pe).forEach(g=>pe[+g]=0),he.length=0,le.clear(),ce.clear()},[p]),a.useEffect(()=>{j&&u?.()},[j,u]),a.useEffect(()=>{if(!b||o==null)return;J("GO"),te.ready?.ready&&ee("ready"),m(!0);const g=w(o,h),L=[...g.events],W=Array(p.length).fill(1);M(g,O=>{for(;L.length&&L[0].frame===O;){const S=L.shift();if(S.kind==="bucketMode"){k(A=>{const C=[...A.length?A:Array(U.length).fill(0)];return S.bucket!==void 0?C[S.bucket]=S.value??0:U.forEach(($,F)=>{$.type===I.Dynamic&&(C[F]=S.value??0)}),C}),S.bucket!==void 0?Z[S.bucket]=1:U.forEach((A,C)=>{A.type===I.Dynamic&&(Z[C]=1)});continue}if(S.kind==="bucketPattern"&&S.bucket!==void 0){i(A=>{const C=U.map((G,ae)=>G.type===I.Dynamic?ae:-1).filter(G=>G>=0),$=C.indexOf(S.bucket),F=[...A.length?A:Array(C.length).fill(0)];return $>=0&&(F[$]=S.value??0),F});continue}if(S.bucket!==void 0){const A=S.bucket;Z[A]=1;const C=performance.now();te.fall?.ready&&C-B.current>60&&(B.current=C,ee("fall")),S.kind==="extraBall"&&(J("EXTRA BALL"),te.extra?.ready&&ee("extra"));const $=U[A],F=R[A]??0;($.type===I.Dynamic?se[F]:$.type)===I.ExtraBall&&S.kind!=="extraBall"&&(J("EXTRA BALL"),te.extra?.ready&&ee("extra"))}if(S.kind==="mult"){const A=S.value||1,C=W[S.player];W[S.player]=Math.min((C===1?0:C)+A,64),T($=>{const F=[...$];return F[S.player]=W[S.player],F}),W[S.player]>=5&&(J("BIG COMBO"),te.bigcombo?.ready&&ee("bigcombo"))}S.kind==="deduct"&&(J("DEDUCTION"),te.ouch?.ready&&ee("ouch"),d(A=>{const C=[...A];return C[S.player]=Math.max(0,(C[S.player]??0)-(S.value||0)),C}),S.bucket!==void 0&&oe(A=>[{bucketIndex:S.bucket,value:-(S.value||0),life:30,y:0},...A])),S.kind==="score"&&(d(A=>{const C=[...A];return C[S.player]+=S.value||0,C}),W[S.player]=1,T(A=>{const C=[...A];return C[S.player]=1,C}),S.bucket!==void 0&&oe(A=>[{bucketIndex:S.bucket,value:S.value||0,life:30,y:0},...A])),S.kind==="ballKill"&&J("PLAYER OUT")}O===g.totalFrames-1&&(te.finish?.ready&&ee("finish"),_(!0))})},[b,o,w,M,h,p.length]),p.length===0&&o!==null?n.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",color:"#fff",background:"#0b0b13"},children:"Game settled with 0 players"}):n.jsxs("div",{style:{position:"relative",width:"100%",height:"100%"},children:[n.jsx(wn,{engine:b,dynModes:R,patternOffsets:l,started:e,bucketAnim:Z,pegAnim:pe,particles:he,arrowPos:le,labelPos:ce,mults:v,roster:p,metadata:s,youIdx:E,popups:fe}),n.jsx(Rn,{roster:p,scores:x,mults:v,targetPoints:h,final:j,payouts:f,metadata:s}),n.jsx(xn,{message:N})]})}const ft="/assets/action-Do835deA.mp3";function Tn({pk:t,onBack:o}){const{game:s,metadata:c}=Rt(t,{fetchMetadata:!0}),{publicKey:r}=_e(),[h,f]=a.useState(null),[u,p]=a.useState(null),[y,E]=a.useState(null),[b,w]=a.useState(!1);a.useEffect(()=>{if(!s?.state.settled||h)return;const l=Number(s.winnerIndexes[0]);f(s.players.map(i=>i.user)),p(l),E(s.players.map(i=>Number(i.pendingPayout??i.pending_payout??0)))},[s,h]),a.useEffect(()=>{h&&h.length===0&&w(!0)},[h]);const[M,x]=a.useState(0);a.useEffect(()=>{if(!s?.softExpirationTimestamp)return;const l=Number(s.softExpirationTimestamp)*1e3,i=()=>x(Math.max(l-Date.now(),0));i();const j=setInterval(i,1e3);return()=>clearInterval(j)},[s?.softExpirationTimestamp]);const d=h===null,v=d?s?.players.map(l=>l.user)||[]:h,T=d?null:u,R=d?void 0:y,k=l=>{const i=Math.ceil(l/1e3),j=Math.floor(i/60),_=i%60;return`${j}:${_.toString().padStart(2,"0")}`};a.useEffect(()=>(clearTimeout(P.timer),P.count+=1,()=>{P.count-=1,P.count===0&&(P.timer=setTimeout(Ue,200))}),[]);const{play:e,sounds:m}=Pe({action:ft},{disposeOnUnmount:!1});return a.useEffect(()=>{if(!d){try{P.sound?.player.stop()}catch{}const l=m.action;if(l){l.player.loop=!0;const i=()=>{if(l.ready){e("action"),Te(l);try{l.gain.set({gain:P.muted?0:l.gain.get().gain})}catch{}}else setTimeout(i,100)};i()}}},[d,e,m]),n.jsxs(n.Fragment,{children:[n.jsx(pt,{players:v,winnerIdx:T,gamePk:t.toBase58(),payouts:R,metadata:c,onFinished:d?void 0:()=>w(!0)}),n.jsxs("div",{style:{position:"absolute",top:12,right:12,zIndex:200,textAlign:"right"},children:[n.jsx("div",{style:{display:"inline-block",background:"rgba(0,0,0,0.6)",color:"#fff",padding:"4px 8px",borderRadius:4,fontSize:12,textTransform:"uppercase"},children:d?"Waiting":b?"Settled":"Playing"}),d&&M>0&&n.jsxs("div",{style:{marginTop:4,color:"#fff",fontSize:12},children:["Starts in ",k(M)]})]}),n.jsxs(re.Portal,{target:"controls",children:[n.jsx("button",{onClick:o,style:{padding:"8px 16px",marginRight:12,fontWeight:600,background:"#222",color:"#fff",border:"none",borderRadius:6,cursor:"pointer"},children:"← Lobby"}),d&&s?.state.waiting?r&&!s.players.some(l=>l.user.equals(r))?n.jsx(He.JoinGame,{pubkey:t,account:s,creatorAddress:ze,creatorFeeBps:Math.round(Ke*Ye),referralFee:jt,enableMetadata:!0,onTx:()=>{}}):n.jsx(He.EditBet,{pubkey:t,account:s,creatorAddress:ze,creatorFeeBps:Math.round(Ke*Ye),onComplete:()=>{}}):null]})]})}function An(){return at.generate().publicKey}const Wn=D.div`
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;
  box-sizing: border-box;
`,$n=D.div`
  background: #11151f;
  border: 1px solid #202533;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 6px 24px rgba(0,0,0,0.25);
`,Dn=D.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
  h2 { margin: 0; font-size: 18px; }
`,Fn=D.div`
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`,Re=D.label`
  display: grid;
  gap: 8px;
  font-size: 14px;
`,je=D.input`
  appearance: none;
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #2a3142;
  background: #0d1118;
  color: #e8eefc;
  outline: none;
  font-size: 14px;
  &:focus {
    border-color: #5e47ff;
    box-shadow: 0 0 0 3px rgba(94,71,255,0.2);
  }
`,Ln=D.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
  margin-top: 8px;
`,Ee=D.div`
  color: #9aa7bd;
  font-size: 12px;
`;function On({onBack:t}){const[o,s]=a.useState(5),[c,r]=a.useState(0),[h,f]=a.useState(0),[u,p]=a.useState([]),[y,E]=a.useState(null),[b,w]=a.useState(""),[M,x]=a.useState(null),[d,v]=a.useState(!1),T=u.length===0;a.useEffect(()=>(clearTimeout(P.timer),P.count+=1,()=>{P.count-=1,P.count===0&&(P.timer=setTimeout(Ue,200))}),[]);const{play:R,sounds:k}=Pe({lobby:ct},{disposeOnUnmount:!1});a.useEffect(()=>{if(!P.sound){const i=k.lobby;if(i){i.player.loop=!0;const j=()=>{i.ready?(R("lobby"),Te(i)):setTimeout(j,100)};j()}}},[k,R]);const{play:e,sounds:m}=Pe({action:ft},{disposeOnUnmount:!1});a.useEffect(()=>{if(!T){try{P.sound?.player.stop()}catch{}const i=m.action;if(i){i.player.loop=!0;const j=()=>{i.ready?(e("action"),Te(i)):setTimeout(j,100)};j()}}},[T,m,e]);const l=a.useCallback(()=>{const i=Math.max(1,Math.min(20,o)),j=Math.max(0,Math.min(i-1,h));f(j),p(Array.from({length:i},An)),E(Math.max(0,Math.min(i-1,c)));const _=b.trim()||at.generate().publicKey.toBase58();x(_),v(!1)},[o,c,h,b]);return n.jsxs(n.Fragment,{children:[u.length===0&&n.jsx(Wn,{children:n.jsxs($n,{children:[n.jsx(Dn,{children:n.jsx("h2",{children:"🐞 Debug Simulator"})}),n.jsxs(Fn,{children:[n.jsxs(Re,{children:[n.jsx("span",{children:"Balls"}),n.jsx(je,{type:"number",min:1,max:20,step:1,inputMode:"numeric",value:o,onChange:i=>s(+i.target.value)}),n.jsx(Ee,{children:"How many players (1–20)"})]}),n.jsxs(Re,{children:[n.jsx("span",{children:"Winner index"}),n.jsx(je,{type:"number",min:0,step:1,inputMode:"numeric",value:c,onChange:i=>r(+i.target.value)}),n.jsx(Ee,{children:"Zero‑based index of the winner"})]}),n.jsxs(Re,{children:[n.jsx("span",{children:"Your index"}),n.jsx(je,{type:"number",min:0,max:Math.max(0,o-1),step:1,inputMode:"numeric",value:h,onChange:i=>f(+i.target.value)}),n.jsxs(Ee,{children:["Which ball is “you” (0…",Math.max(0,o-1),")"]})]}),n.jsxs(Re,{children:[n.jsx("span",{children:"Seed (optional)"}),n.jsx(je,{type:"text",placeholder:"Base58 seed or leave empty",value:b,onChange:i=>w(i.target.value)}),n.jsx(Ee,{children:"Leave empty to use a random seed"})]})]}),n.jsx(Ln,{children:n.jsx(re.Button,{main:!0,onClick:l,children:"Run race"})})]})}),u.length>0&&M&&n.jsx(pt,{players:u,winnerIdx:y,youIndexOverride:h,gamePk:M,onFinished:()=>v(!0)}),n.jsx(re.Portal,{target:"controls",children:u.length>0&&d&&n.jsx(re.Button,{onClick:t,children:"← Back to lobby"})})]})}function Yn(){const[t,o]=a.useState(null),[s,c]=a.useState(!1),r=a.useCallback(()=>{o(null),c(!1)},[]);return n.jsx(re.Portal,{target:"screen",children:s?n.jsx(On,{onBack:()=>c(!1)}):t?n.jsx(Tn,{pk:t,onBack:r}):n.jsx(ln,{onSelect:o,onDebug:()=>c(!0)})})}export{Yn as default};
