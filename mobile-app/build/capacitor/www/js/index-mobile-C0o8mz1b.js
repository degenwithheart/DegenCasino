import{r as c,R as V,j as e}from"./three-D4AtYCWe.js";import{av as X,aw as Y,aP as Q,az as q,ay as J,ax as K,aQ as O,G as g,T as Z,aR as ee,aB as te,aD as oe,d}from"./index-Dyfdn2uN.js";import{S as ne,a as se,b as ae,D as h}from"./win-CAN8NMrR.js";import{G as re}from"./GameStatsHeader-BAMe0qyx.js";import{u as w}from"./useGameMeta-5-HRcCSO.js";import{G as ie}from"./GameRecentPlaysHorizontal-Ddh_VF4k.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-DLMfKFaI.js";const le=o=>{const s=(l,a)=>a?s(a,l%a):l;return 100/s(100,o)},ce=o=>{const s=le(o),l=(100/o).toFixed(4);let a=Array.from({length:s}).map((r,n)=>n<s*(o/100)?parseFloat(l):0);const p=a.reduce((r,n)=>r+n,0);if(p>s){for(let r=a.length-1;r>=0;r--)if(a[r]>0){a[r]-=p-s,a[r]=parseFloat(a[r].toFixed(4));break}}return a},de=d.div`
    width: 100%;
    height: 60px;
    background: linear-gradient(90deg, #1a202c 0%, #2d3748 50%, #1a202c 100%);
    border-radius: 30px;
    position: relative;
    border: 2px solid ${h.colors.tileBorder};
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.3);
    touch-action: pan-x;
`,pe=d.div`
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${o=>o.$position}%;
    background: linear-gradient(90deg, ${h.colors.tileAccent} 0%, #48bb78 100%);
    border-radius: 28px;
    transition: width 0.2s ease;
`,ue=d.div`
    position: absolute;
    top: 50%;
    left: ${o=>o.$position}%;
    width: 50px;
    height: 50px;
    background: #fff;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    border: 3px solid ${h.colors.tileAccent};
    cursor: grab;
    touch-action: none;
    
    &:active {
        cursor: grabbing;
        transform: translate(-50%, -50%) scale(1.1);
    }
`,xe=d.div`
    position: absolute;
    top: 50%;
    left: ${o=>o.$position}%;
    transform: translate(-50%, -50%);
    color: ${o=>o.$position>50?"#1a202c":"#fff"};
    font-weight: bold;
    font-size: 16px;
    pointer-events: none;
    z-index: 2;
`,T=d.div`
    background: ${h.colors.tileBg};
    border-radius: 16px;
    padding: 16px;
    text-align: center;
    flex: 1;
    border: 2px solid ${h.colors.tileBorder};
    box-shadow: 0 4px 16px rgba(26,32,44,0.4);
`,A=d.div`
    font-size: 12px;
    color: ${h.colors.labelColor};
    margin-bottom: 8px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
`,C=d.div`
    font-size: 18px;
    font-weight: bold;
    color: #fff;
`;function Ee(){console.log("📱 MOBILE DICE COMPONENT LOADED!");const o=X(),[s,l]=Y(),a=Q(),[p,r]=c.useState(-1),[n,k]=c.useState(50),[u,b]=c.useState(!1),[R,v]=c.useState(null),[f,y]=c.useState(!1),S=q("dice"),{settings:W}=J(),I=W.enableEffects,m=c.useRef(null),j=K({win:ae,play:se,lose:ne}),E=Math.max(1,Math.min(99,n)),P=Number(BigInt(100*O)/BigInt(E))/O,N=V.useMemo(()=>ce(E),[E]),L=P*s,F=L>(a?.maxPayout||0),D=g.useGame(),$=t=>{o.isPlaying||(y(!0),B(t))},G=t=>{!f||o.isPlaying||B(t)},z=()=>{y(!1)},B=t=>{const i=t.currentTarget.getBoundingClientRect(),M=("touches"in t?t.touches[0].clientX:t.clientX)-i.left,H=Math.max(1,Math.min(99,M/i.width*100));k(Math.round(H))};c.useEffect(()=>{const t=x=>{f&&x.preventDefault()},i=()=>{y(!1)};return f&&(document.addEventListener("touchmove",t,{passive:!1}),document.addEventListener("mousemove",t),document.addEventListener("touchend",i),document.addEventListener("mouseup",i)),()=>{document.removeEventListener("touchmove",t),document.removeEventListener("mousemove",t),document.removeEventListener("touchend",i),document.removeEventListener("mouseup",i)}},[f]);const U=()=>{b(!1),r(-1),v(null)},_=async()=>{try{j.play("play"),await D.play({wager:s,bet:N});const t=await D.result(),i=t.payout>0;let x=0;i?x=Math.floor(Math.random()*n):x=n+Math.floor(Math.random()*(100-n)),r(x),b(!0),v(i?"win":"lose");const M=t.payout-s;S.updateStats(M),i?(j.play("win"),I&&(m.current?.winFlash("#00ff00",1.5),m.current?.screenShake(1,600))):(j.play("lose"),I&&(m.current?.loseFlash("#ff4444",.8),m.current?.screenShake(.5,400)))}catch(t){console.error("🎲 MOBILE DICE PLAY ERROR:",t),b(!1),v(null),r(-1)}};return e.jsxs(e.Fragment,{children:[e.jsx(g.Portal,{target:"recentplays",children:e.jsx(ie,{gameId:"dice"})}),e.jsx(g.Portal,{target:"stats",children:e.jsx(re,{gameName:"Dice",gameMode:"Mobile",stats:S.stats,onReset:S.resetStats,isMobile:!0})}),e.jsx(g.Portal,{target:"screen",children:e.jsxs("div",{style:{width:"100%",height:"100%",position:"relative",background:"linear-gradient(135deg, #1a202c 0%, #2d3748 25%, #4a5568 50%, #2d3748 75%, #1a202c 100%)",display:"flex",flexDirection:"column",padding:"20px 16px",boxSizing:"border-box",gap:"20px"},children:[e.jsx("div",{style:{background:"linear-gradient(90deg, #48bb78, #38a169)",padding:"8px 16px",borderRadius:"20px",textAlign:"center",fontWeight:"bold",color:"white",fontSize:"14px",marginBottom:"8px",boxShadow:"0 2px 10px rgba(72, 187, 120, 0.3)"},children:"📱 MOBILE VERSION ACTIVE"}),e.jsxs("div",{style:{textAlign:"center",padding:"20px",backgroundColor:"rgba(0,0,0,0.3)",borderRadius:"16px",border:"1px solid rgba(255,255,255,0.1)"},children:[e.jsx("div",{style:{fontSize:"16px",color:u&&p>=0?R==="win"?"#48bb78":"#e53e3e":"#a0aec0",marginBottom:"8px",fontWeight:u?"bold":"normal"},children:u&&p>=0?`Roll Result: ${p} - ${R==="win"?"WIN!":"LOSE"}`:"Roll the dice to see your result"}),e.jsx("div",{style:{fontSize:"28px",fontWeight:"bold",color:"#48bb78",marginBottom:"4px"},children:e.jsx(Z,{exact:!0,amount:L})}),e.jsx("div",{style:{fontSize:"14px",color:"#a0aec0"},children:"Possible Winning"})]}),e.jsxs("div",{style:{padding:"20px 0"},children:[e.jsxs("div",{style:{fontSize:"14px",color:"#a0aec0",textAlign:"center",marginBottom:"16px"},children:["Roll Under ",n]}),e.jsxs(de,{onTouchStart:$,onMouseDown:$,onTouchMove:G,onMouseMove:G,onTouchEnd:z,onMouseUp:z,children:[e.jsx(pe,{$position:n}),e.jsx(ue,{$position:n}),e.jsx(xe,{$position:n,children:n})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",marginTop:"8px",fontSize:"12px",color:"#718096"},children:[e.jsx("span",{children:"1"}),e.jsx("span",{children:"25"}),e.jsx("span",{children:"50"}),e.jsx("span",{children:"75"}),e.jsx("span",{children:"99"})]})]}),e.jsxs("div",{style:{display:"flex",gap:"12px"},children:[e.jsxs(T,{children:[e.jsx(A,{children:"Multiplier"}),e.jsxs(C,{children:[P.toFixed(2),"x"]})]}),e.jsxs(T,{children:[e.jsx(A,{children:"Win Chance"}),e.jsxs(C,{children:[n,"%"]})]})]}),e.jsx(ee,{ref:m,style:{position:"absolute",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:1e3},...w("dice")&&{title:w("dice").name,description:w("dice").description}})]})}),e.jsx(g.Portal,{target:"controls",children:e.jsx(te,{wager:s,setWager:l,onPlay:u?U:_,playDisabled:o.isPlaying||!u&&F,playText:u?"Roll Again":"Roll Dice",children:e.jsx(oe,{value:s,onChange:l})})})]})}export{Ee as default,ce as outcomes};
