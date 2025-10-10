import{r as m,j as e,R as se}from"./three-D4AtYCWe.js";import{d as w,aL as L,m as Ae,av as de,aw as ce,aP as pe,W as xe,az as he,ay as ue,ax as ge,aQ as re,G as D,T as fe,aR as me,aB as be,aC as je,aD as we}from"./index-Dyfdn2uN.js";import{D as y,S as ve,a as ye,b as Me}from"./win-CAN8NMrR.js";import{G as $e}from"./GameStatsHeader-BAMe0qyx.js";import{u as W}from"./useGameMeta-5-HRcCSO.js";import{G as Re}from"./GameRecentPlaysHorizontal-Ddh_VF4k.js";import{G as Ce}from"./GameControlsSection-vCoWFXil.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-DLMfKFaI.js";const M=y.colors,Be=w.div`
  position: relative;
  width: 100%;
  user-select: none;
`,Ee=w.div`
  position: relative;
  height: 18px;
  border-radius: 12px;
  background: ${M.trackBg};
  overflow: visible;
`,P=w.div`
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, ${M.greenStart}, ${M.greenEnd});
  border-radius: 12px;
`,T=w.div`
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, ${M.redStart}, ${M.redEnd});
  border-radius: 12px;
`,Q=w.div`
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(180deg, ${M.thumbLightStart}, ${M.thumbLightEnd});
  border: 2px solid ${M.thumbBorder};
  box-shadow: 0 4px 10px rgba(0,0,0,0.25);
  transition: box-shadow .12s ease, transform .08s ease;
  cursor: pointer;
  left: ${o=>o.$left}%;

  ${o=>o.$active&&L`
    transform: translate(-50%, -50%) scale(1.06);
    box-shadow: 0 8px 28px rgba(0,0,0,0.36);
  `}
`,ke=w.div`
  position: absolute;
  top: -28px;
  transform: translateX(-50%);
  left: ${o=>o.$left}%;
  background: ${M.labelBg};
  padding: 4px 8px;
  border-radius: 8px;
  color: ${M.labelColor};
  font-size: 12px;
  min-width: 28px;
  text-align: center;
  ${o=>o.$active&&L` color: ${M.activeLabelColor}; `}
`,Se=Ae`
  from { opacity: 0; transform: translate(-50%, -6px) scale(0.96); }
  to   { opacity: 1; transform: translate(-50%, 0) scale(1); }
`,Z=w.div`
  position: absolute;
  top: -48px;
  transform: translateX(-50%);
  left: ${o=>o.$left}%;
  background: rgba(20,20,30,0.95);
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
  pointer-events: none;
  white-space: nowrap;
  box-shadow: 0 6px 18px rgba(0,0,0,0.4);
  animation: ${Se} 120ms ease-out;

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgba(20,20,30,0.95);
  }
`;function De({min:o,max:i,value:q,onChange:A,disabled:$,mode:h,containerRef:R}){const N=m.useRef(null),F=R??N,[l,v]=m.useState(null),C=Array.isArray(q),[d,u]=C?q:[o,q],U=a=>{const c=F.current?.getBoundingClientRect();if(!c)return 0;let r=(a-c.left)/c.width*100;return r=Math.max(0,Math.min(100,r)),r};m.useEffect(()=>{if($)return;let a=null,c=null;return a=r=>{if(!l)return;const B=U(r.clientX),x=i-o,k=Math.round(o+B/100*x);if(C){if(l==="min"){const j=Math.min(k,u-1);A([Math.max(o,j),u])}else if(l==="max"){const j=Math.max(k,d+1);A([d,Math.min(i,j)])}}else{const j=Math.max(o,Math.min(i,k));A(j)}},c=()=>{v(null),a&&window.removeEventListener("pointermove",a),c&&window.removeEventListener("pointerup",c)},l&&(window.addEventListener("pointermove",a),window.addEventListener("pointerup",c)),()=>{a&&window.removeEventListener("pointermove",a),c&&window.removeEventListener("pointerup",c)}},[l,d,u,o,i,A,$,C]);const f=a=>{if($)return;const c=U(a.clientX),r=i-o,B=Math.round(o+c/100*r);if(!C){A(B),v("single");return}const x=Math.abs(B-d),k=Math.abs(B-u),j=Math.max(2,r*.06);x<=j&&x<=k?v("min"):k<=j&&v("max")},s=a=>(a-o)/(i-o)*100;return e.jsxs(Be,{children:[e.jsx("div",{ref:F,onPointerDown:f,children:e.jsx(Ee,{children:C?e.jsxs(e.Fragment,{children:[h==="outside"?e.jsxs(e.Fragment,{children:[e.jsx(P,{style:{left:0,width:`${s(d)}%`}}),e.jsx(P,{style:{left:`${s(u)}%`,width:`${100-s(u)}%`}}),e.jsx(T,{style:{left:`${s(d)}%`,width:`${s(u)-s(d)}%`}})]}):e.jsxs(e.Fragment,{children:[e.jsx(P,{style:{left:`${s(d)}%`,width:`${s(u)-s(d)}%`}}),e.jsx(T,{style:{left:0,width:`${s(d)}%`}}),e.jsx(T,{style:{left:`${s(u)}%`,width:`${100-s(u)}%`}})]}),e.jsx(Q,{role:"slider","aria-valuemin":o,"aria-valuemax":i,"aria-valuenow":d,$left:s(d),$active:l==="min",onPointerDown:a=>{a.stopPropagation(),v("min")}}),l==="min"&&e.jsx(Z,{$left:s(d),children:d}),e.jsx(Q,{role:"slider","aria-valuemin":o,"aria-valuemax":i,"aria-valuenow":u,$left:s(u),$active:l==="max",onPointerDown:a=>{a.stopPropagation(),v("max")}}),l==="max"&&e.jsx(Z,{$left:s(u),children:u})]}):e.jsxs(e.Fragment,{children:[h==="over"?e.jsxs(e.Fragment,{children:[e.jsx(P,{style:{left:`${s(q)}%`,width:`${100-s(q)}%`}}),e.jsx(T,{style:{left:0,width:`${s(q)}%`}})]}):e.jsxs(e.Fragment,{children:[e.jsx(P,{style:{left:0,width:`${s(q)}%`}}),e.jsx(T,{style:{left:`${s(q)}%`,width:`${100-s(q)}%`}})]}),e.jsx(Q,{role:"slider","aria-valuemin":o,"aria-valuemax":i,"aria-valuenow":q,$left:s(q),$active:l==="single",onPointerDown:a=>{a.stopPropagation(),v("single")}}),l==="single"&&e.jsx(Z,{$left:s(q),children:q})]})})}),Array.from({length:5}).map((a,c)=>{const r=Math.round(o+c/4*(i-o)),B=s(r);return e.jsx(ke,{$left:B,$active:C?d<=r&&r<=u:q>=r,children:r},c)})]})}const Pe="data:audio/mpeg;base64,//uUZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAFoACioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi//////////////////////////////////////////////////////////////////8AAAA8TEFNRTMuMTAwBK8AAAAAAAAAADUgJALCjQABzAAABaBVoENUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//vEZAAAAZYTUh094AgAAA/woAABFNCvQ7ndgEAAAD/DAAAAA/wAA3ilMsavdn4LmXOMrHBTk7MtcCbjjVcB5VjZ7K9n3Aiahx8P35/cUDBc+H5zxBBAgAAAAAUCgPFi4MgAAAQhGYXhIYHB2YZAkqiYCDCZREgdBTgZFo6bLrSaVKKZTE+aaDOYZjARPYYVgIZpDiYNAUcXTHTBhg0qCvQxUvMukwaHGblgCUTHUQwpTMkC0RX/AgGgsw5ZBh5oQBKlpkAGnnPIUOUmI2kkSOdF2EJVZl8ovX8YEl7iUMPyB0mHTT/S6t////DcvgOL4Re/Psppq8ZPdAYKRZWLABAEDMaj6hQAgAAAAuyKhwCgEwYBjDAFAQ3HRoABAY/KBsiKmHC2YtJQCFBhURBiABAZMNgMwMEgMhC0AYPgYvZgFhkBhwggY2CIBSQDJwMJhYAgSgYRBYGERoA8JCPQsiAw6IQbDCZgY1AQAQcCyEOGRMLnRyzi1QDg2BgkDhloGxANkBCMgJAkDDogAiJQDgV+TpExzysThFAMCA0BwOBuaACCAFwODbL+eTMz6CjQRyISCgRSQrcUELT/uib0jSw5gyo+iDjLEqRAZX/059Bjybm5gRhJjLE2Sw5JMEkQIn//7Ghm5uYMaJpm6CBVICVCeIcVydIaWiLE0ViZ/////5otM3Uh////yiVSaMieJkSWWJsfh/CVyunN0L0TVCkSQUuJ0uMJPIcElEiVVVV6pJsFNBTcgrgV4KbFNyCuBTwUXFFZBTAU+KLxFExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uUZNEACJqCz25yoJAAAA/wwAAAB3Q/J3zzACgAAD/DgAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",Te=o=>{const i=(q,A)=>A?i(A,q%A):q;return 100/i(100,o)},Fe=o=>{const i=Te(o),q=(100/o).toFixed(4);let A=Array.from({length:i}).map((h,R)=>R<i*(o/100)?parseFloat(q):0);const $=A.reduce((h,R)=>h+R,0);if($>i){for(let h=A.length-1;h>=0;h--)if(A[h]>0){A[h]-=$-i,A[h]=parseFloat(A[h].toFixed(4));break}}return A};function Qe(){const o=de(),[i,q]=ce(),A=pe(),{mobile:$}=xe(),[h,R]=m.useState(-1),[N,F]=m.useState(Math.floor(100/2)),[l,v]=m.useState(!1),[C,d]=m.useState(null),[u,U]=m.useState(!0),[f,s]=m.useState(50),[a,c]=m.useState("under"),[r,B]=m.useState(25),[x,k]=m.useState(75),j=he("dice"),{settings:ne}=ue(),J=ne.enableEffects,S=m.useRef(null),G=ge({win:Me,play:ye,lose:ve,tick:Pe});m.useEffect(()=>{if(U(a==="under"),a==="under"||a==="over"){const t=Math.max(1,Math.min(99,Math.floor(f)));F(t)}},[a,f]);const H=se.useMemo(()=>{switch(a){case"under":return f/100;case"over":return(100-f)/100;case"between":return Math.max(0,(x-r)/100);case"outside":return Math.max(0,1-(x-r)/100);default:return .5}},[a,f,r,x]),K=Math.max(1,Math.min(99,Math.floor(H*100))),X=Number(BigInt(100*re)/BigInt(K))/re,ie=se.useMemo(()=>Fe(K),[K]),_=X*i,ee=D.useGame(),te=_>(A?.maxPayout||0),Y=w.div`
    background: ${y.colors.tileBg};
    border-radius: 12px;
    padding: ${y.sizes.tilePadding};
    text-align: center;
  width: clamp(180px, 32%, 300px);
    height: 88px;
    flex: 0 1 auto;
    border: 2px solid ${y.colors.tileBorder};
    box-shadow: 0 4px 16px rgba(26,32,44,0.4), inset 0 1px 0 rgba(255,255,255,0.03);
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: box-shadow 160ms ease, background 160ms ease, border-color 160ms ease;

    ${t=>t.$featured&&L`
      border-color: ${y.colors.tileAccent};
      background: linear-gradient(180deg, rgba(10,12,16,0.6), ${y.colors.tileBg});
      box-shadow: 0 14px 40px rgba(10,12,20,0.6), inset 0 1px 0 rgba(255,255,255,0.03);
    `}
  `,V=w.div`
    font-size: 12px;
    margin-bottom: 6px;
    color: ${y.colors.labelColor};
    letter-spacing: 0.2px;
    ${t=>t.$featured&&L` color: ${y.colors.activeLabelColor}; `}
  `,O=w.div`
    font-size: 20px;
    font-weight: bold;
    color: #fff;
    line-height: 1.05;
    white-space: nowrap;
  `,I=w.div`
    width: clamp(60px, 12vw, 80px);
    height: clamp(60px, 12vw, 80px);
    background: linear-gradient(135deg, ${y.colors.tileBorder} 0%, #2d3748 50%, ${y.colors.tileBg} 100%);
    border-radius: clamp(8px, 2vw, 12px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.08);
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    padding: clamp(8px, 2vw, 12px);
    opacity: ${t=>t.$opacity??.75};
    pointer-events: none;
    transform-style: preserve-3d;
  `,p=w.div`
    width: clamp(4px, 1.2vw, 8px);
    height: clamp(4px, 1.2vw, 8px);
    background-color: ${y.colors.tileAccent};
    border-radius: 50%;
    justify-self: ${t=>t.$justify||"center"};
    align-self: ${t=>t.$align||"center"};
    box-shadow: 0 2px 6px rgba(0,0,0,0.45);
  `,ae=()=>{v(!1),R(-1),d(null)},oe=async()=>{try{G.play("play"),await ee.play({wager:i,bet:ie});const t=await ee.result(),z=t.payout>0;let g=0;if(z)switch(a){case"under":{const n=Math.max(1,Math.floor(f));g=Math.floor(Math.random()*n);break}case"over":{const n=Math.max(1,Math.floor(f)),b=100-n;g=Math.floor(Math.random()*b)+n;break}case"between":{const n=Math.max(0,Math.floor(r)),b=Math.max(n+1,Math.floor(x)),E=Math.max(1,b-n);g=Math.floor(Math.random()*E)+n;break}case"outside":{const n=Math.max(0,Math.floor(r)),b=Math.max(0,100-Math.floor(x)),E=n+b;E<=0?g=Math.floor(Math.random()*100):Math.floor(Math.random()*E)<n?g=Math.floor(Math.random()*n):g=Math.floor(Math.random()*b)+Math.floor(x);break}default:g=Math.floor(Math.random()*100)}else switch(a){case"under":{const n=Math.max(1,Math.floor(f)),b=100-n;g=Math.floor(Math.random()*b)+n;break}case"over":{const n=Math.max(1,Math.floor(f));g=Math.floor(Math.random()*n);break}case"between":{const n=Math.max(0,Math.floor(r)),b=Math.max(0,100-Math.floor(x)),E=n+b;E<=0?g=Math.floor(Math.random()*100):Math.floor(Math.random()*E)<n?g=Math.floor(Math.random()*n):g=Math.floor(Math.random()*b)+Math.floor(x);break}case"outside":{const n=Math.max(0,Math.floor(r)),b=Math.max(n+1,Math.floor(x)),E=Math.max(1,b-n);g=Math.floor(Math.random()*E)+n;break}default:g=Math.floor(Math.random()*100)}R(g),v(!0),d(z?"win":"lose");const qe=t.payout-i;j.updateStats(qe),z?(G.play("win"),J&&(S.current?.winFlash("#00ff00",1.5),S.current?.screenShake(1,600))):(G.play("lose"),J&&(S.current?.loseFlash("#ff4444",.8),S.current?.screenShake(.5,400)))}catch(t){console.error("🎲 PLAY ERROR:",t),v(!1),d(null),R(-1)}};return e.jsxs(e.Fragment,{children:[e.jsx(D.Portal,{target:"recentplays",children:e.jsx(Re,{gameId:"dice"})}),e.jsx(D.Portal,{target:"stats",children:e.jsx($e,{gameName:"Dice",gameMode:"2D",stats:j.stats,onReset:j.resetStats,isMobile:$})}),e.jsx(D.Portal,{target:"screen",children:e.jsxs("div",{style:{width:"100%",height:"100%",position:"relative",background:"linear-gradient(135deg, #1a202c 0%, #2d3748 25%, #4a5568 50%, #2d3748 75%, #1a202c 100%)",perspective:"100px"},children:[!$&&e.jsx("div",{style:{position:"absolute",top:"10px",right:"10px",background:"linear-gradient(90deg, #4299e1, #3182ce)",padding:"6px 12px",borderRadius:"12px",fontSize:"12px",fontWeight:"bold",color:"white",zIndex:1e3,boxShadow:"0 2px 8px rgba(66, 153, 225, 0.3)"},children:"🖥️ 2D VERSION"}),e.jsxs("div",{style:{position:"absolute",top:"clamp(10px, 3vw, 20px)",left:"clamp(10px, 3vw, 20px)",right:"clamp(10px, 3vw, 20px)",bottom:"clamp(100px, 20vw, 120px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"clamp(20px, 5vw, 30px)",padding:"10px"},children:[e.jsx("div",{style:{fontSize:"clamp(14px, 4vw, 18px)",color:l&&h>=0?C==="win"?"#48bb78":"#e53e3e":"#a0aec0",textAlign:"center",lineHeight:"1.4",fontWeight:l?"bold":"normal"},children:l&&h>=0?`Roll Result: ${h} - ${C==="win"?"WIN!":"LOSE"}`:"Games Results Will Be Displayed Here"}),e.jsxs("div",{style:{textAlign:"center"},children:[e.jsx("div",{style:{fontSize:"clamp(32px, 8vw, 48px)",fontWeight:"bold",marginBottom:"8px",lineHeight:"1.2"},children:e.jsx("span",{style:{color:"#48bb78"},children:e.jsx(fe,{exact:!0,amount:_})})}),e.jsx("div",{style:{fontSize:"clamp(14px, 3.5vw, 16px)",color:"#a0aec0"},children:"Possible Winning"})]}),e.jsx("div",{style:{width:"clamp(280px, 80vw, 600px)",maxWidth:"95%",position:"relative"},children:e.jsx("div",{style:{position:"relative",height:"clamp(36px, 8vw, 40px)",padding:"4px"},children:e.jsx(De,{min:0,max:100,value:a==="between"||a==="outside"?[r,x]:f,onChange:t=>{Array.isArray(t)?(B(t[0]),k(t[1])):s(t)},mode:a})})}),e.jsxs(I,{style:{position:"absolute",top:"clamp(20px, 5vw, 40px)",left:"clamp(20px, 8vw, 60px)",transform:"rotate(-15deg) perspective(100px) rotateX(15deg) rotateY(-15deg)"},$opacity:.7,children:[e.jsx(p,{$justify:"start",$align:"start"}),e.jsx("div",{}),e.jsx(p,{$justify:"end",$align:"start"}),e.jsx("div",{}),e.jsx("div",{}),e.jsx("div",{}),e.jsx(p,{$justify:"start",$align:"end"}),e.jsx("div",{}),e.jsx(p,{$justify:"end",$align:"end"})]}),e.jsxs(I,{style:{position:"absolute",top:"clamp(20px, 5vw, 40px)",right:"clamp(20px, 8vw, 60px)",transform:"rotate(15deg) perspective(100px) rotateX(15deg) rotateY(15deg)"},$opacity:.7,children:[e.jsx(p,{$justify:"start",$align:"start"}),e.jsx("div",{}),e.jsx(p,{$justify:"end",$align:"start"}),e.jsx("div",{}),e.jsx(p,{$justify:"center",$align:"center"}),e.jsx("div",{}),e.jsx(p,{$justify:"start",$align:"end"}),e.jsx("div",{}),e.jsx(p,{$justify:"end",$align:"end"})]}),e.jsxs(I,{style:{position:"absolute",bottom:"clamp(80px, 15vw, 120px)",left:"clamp(20px, 8vw, 60px)",transform:"rotate(25deg) perspective(100px) rotateX(-15deg) rotateY(-25deg)"},$opacity:.7,children:[e.jsx(p,{$justify:"start",$align:"start"}),e.jsx("div",{}),e.jsx("div",{}),e.jsx("div",{}),e.jsx(p,{$justify:"center",$align:"center"}),e.jsx("div",{}),e.jsx("div",{}),e.jsx("div",{}),e.jsx(p,{$justify:"end",$align:"end"})]}),e.jsxs(I,{style:{position:"absolute",bottom:"clamp(80px, 15vw, 120px)",right:"clamp(20px, 8vw, 60px)",transform:"rotate(-25deg) perspective(100px) rotateX(-15deg) rotateY(25deg)"},$opacity:.7,children:[e.jsx(p,{$justify:"start",$align:"start"}),e.jsx("div",{}),e.jsx(p,{$justify:"end",$align:"start"}),e.jsx(p,{$justify:"start",$align:"center"}),e.jsx("div",{}),e.jsx(p,{$justify:"end",$align:"center"}),e.jsx(p,{$justify:"start",$align:"end"}),e.jsx("div",{}),e.jsx(p,{$justify:"end",$align:"end"})]})]}),e.jsx(Ce,{children:e.jsxs("div",{style:{display:"flex",gap:"clamp(12px, 3vw, 0px)",alignItems:"center",width:"100%",justifyContent:"center",flexWrap:"wrap",padding:"6px 10px",maxWidth:"720px",margin:"0 auto"},children:[e.jsxs(Y,{$featured:!0,children:[e.jsx(V,{children:"Multiplier"}),e.jsxs(O,{children:[X.toFixed(2),"x"]})]}),!$&&e.jsxs(Y,{$featured:!0,children:[e.jsx(V,{$featured:!0,children:"Game Mode"}),e.jsx(O,{$featured:!0,children:a==="under"?`Roll Under ${f}`:a==="over"?`Roll Over ${f}`:a==="between"?`Roll Between ${r} – ${x}`:`Roll Outside ${r} – ${x}`})]}),e.jsxs(Y,{$featured:!0,children:[e.jsx(V,{children:"Win Chance"}),e.jsxs(O,{children:[(H*100).toFixed(0),"%"]})]})]})}),e.jsx(me,{ref:S,style:{position:"absolute",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:1e3},...W("dice")&&{title:W("dice").name,description:W("dice").description}})]})}),e.jsxs(D.Portal,{target:"controls",children:[e.jsx(be,{wager:i,setWager:q,onPlay:l?ae:oe,playDisabled:o.isPlaying||!l&&te,playText:l?"Roll Again":"Roll Dice",children:e.jsx("div",{style:{display:"flex",gap:"8px",justifyContent:"center",padding:"8px 12px"},children:["under","over","between","outside"].map(t=>e.jsxs("button",{onClick:()=>c(t),disabled:o.isPlaying,style:{padding:"8px 12px",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.06)",background:a===t?"linear-gradient(90deg, #2d3748, #1f2a36)":"rgba(0,0,0,0.3)",color:a===t?"#48bb78":"#e2e8f0",fontWeight:a===t?"bold":"normal",cursor:o.isPlaying?"not-allowed":"pointer"},children:[t==="under"&&"Roll Under",t==="over"&&"Roll Over",t==="between"&&"Roll Between",t==="outside"&&"Roll Outside"]},t))})}),e.jsxs(je,{onPlay:l?ae:oe,playDisabled:o.isPlaying||!l&&te,playText:l?"Roll Again":"Roll Dice",children:[e.jsx(we,{value:i,onChange:q}),e.jsx("div",{style:{display:"flex",gap:"8px",justifyContent:"center",padding:"8px 12px"},children:["under","over","between","outside"].map(t=>e.jsxs("button",{onClick:()=>c(t),disabled:o.isPlaying,style:{padding:"8px 12px",borderRadius:"10px",border:"1px solid rgba(255,255,255,0.06)",background:a===t?"linear-gradient(90deg, #2d3748, #1f2a36)":"rgba(0,0,0,0.3)",color:a===t?"#48bb78":"#e2e8f0",fontWeight:a===t?"bold":"normal",cursor:o.isPlaying?"not-allowed":"pointer"},children:[t==="under"&&"Roll Under",t==="over"&&"Roll Over",t==="between"&&"Roll Between",t==="outside"&&"Roll Outside"]},t))})]})]})]})}export{Qe as default,Fe as outcomes};
