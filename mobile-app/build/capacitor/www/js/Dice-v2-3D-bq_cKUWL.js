import{r,j as e,C as ie,P as le,O as ce,T as ue}from"./three-DV31HySq.js";import{aH as de,aJ as me,aI as ge,bf as fe,aK as pe,aL as he,B as C,aG as W,G as E,aN as xe,aO as ye,aV as Se,d as y}from"./index-BarUt2o_.js";import{m as be}from"./deterministicRng-BQgZTO1k.js";import{S as Ce,a as Pe,c as Ie,b as Me}from"./win-BKYOjMDH.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-Bm3pLP40.js";const je=800,O=2500,Ae=50,De=()=>{const P=de(),[c,A]=me(),I=ge(),[D,v]=r.useState(-1),[d,L]=r.useState(7),[z,V]=r.useState(!1),[H,R]=r.useState(!1),[Y,T]=r.useState(null),k=fe("dice-v2"),[$,q]=r.useState(0),[K,G]=r.useState(0),[Z,U]=r.useState(0),[N,g]=r.useState({currentNumber:0,targetNumber:0,isAnimating:!1,animationProgress:0,particles:[],randomSequence:[],currentSequenceIndex:0}),u=r.useRef(),p=r.useRef(0),{settings:J}=pe(),{enableMotion:h=!0,enableEffects:f=!0,quality:S="high"}=J,b=f?Math.floor(Ae*.6):0,M=f&&b>0,Q=f&&(S==="high"||S==="ultra"),X=f&&(S==="medium"||S==="high"||S==="ultra"),j=he({play:Me,win:Ie,lose:Pe,tick:Ce}),B=Number(BigInt(C["dice-v2"].OUTCOMES*W)/BigInt(d))/W,ee=c*B>(I?.maxPayout??0),te=r.useCallback((t,n)=>{const a=je-100,s=a-100;if(t>=100&&t<=a){const i=(t-100)/s,x=Math.max(1,Math.min(C["dice-v2"].OUTCOMES-1,Math.round(i*(C["dice-v2"].OUTCOMES-2))+1));L(x)}},[]),w=r.useCallback(t=>{p.current===0&&(p.current=t);const n=t-p.current,o=Math.min(n/O,1),a=N.randomSequence.length,s=Math.floor(o*a);g(i=>{const x=f?i.particles.map(l=>({...l,x:l.x+l.vx,y:l.y+l.vy,life:l.life-1,vy:l.vy+.1})).filter(l=>l.life>0):[];return o>=1||s>=a-1?{...i,isAnimating:!1,animationProgress:1,particles:x,currentSequenceIndex:a-1}:(u.current=requestAnimationFrame(w),{...i,animationProgress:o,particles:x,currentSequenceIndex:s})})},[O,h,f,M]),ne=r.useCallback(t=>{if(!h){g(a=>({...a,targetNumber:t,isAnimating:!1,animationProgress:1,particles:[],randomSequence:[t],currentSequenceIndex:0}));return}const n=[],o=20;for(let a=0;a<o-1;a++){let s;do s=Math.floor(Math.random()*100);while(s===t);n.push(s)}n.push(t),g({currentNumber:0,targetNumber:t,isAnimating:!0,animationProgress:0,particles:[],randomSequence:n,currentSequenceIndex:0}),p.current=0,u.current=requestAnimationFrame(w)},[h,w]),ae=r.useCallback((t,n,o)=>{if(!M||b===0)return;const a=[];for(let s=0;s<b;s++)a.push({x:t,y:n,vx:(Math.random()-.5)*10,vy:(Math.random()-.5)*10-5,life:60+Math.random()*60,maxLife:120,color:o,size:2+Math.random()*4});g(s=>({...s,particles:[...s.particles,...a]}))},[M,b]),_=E.useGame(),se=async()=>{if(c<=0){console.error("❌ BLOCKED: Cannot play with zero wager");return}R(!1),v(-1),T(null),g(m=>({...m,currentNumber:0,targetNumber:0,isAnimating:!1,animationProgress:0,particles:[],randomSequence:[],currentSequenceIndex:0})),p.current=0,u.current&&(cancelAnimationFrame(u.current),u.current=void 0),j.play("play");const t=C["dice-v2"].calculateBetArray(d);console.log("🎲 BET ARRAY DEBUG:",{rollUnderIndex:d,betArray:t.slice(0,10),nonZeroCount:t.filter(m=>m>0).length,maxBet:Math.max(...t),wager:c}),await _.play({wager:c,bet:t});const n=await _.result(),o=n.payout>0;T(o?"win":"lose");const a=`${n.resultIndex}:${n.payout}:${n.multiplier}:${d}`,s=be(a);let i;o?i=Math.floor(s()*d):i=d+Math.floor(s()*(C["dice-v2"].OUTCOMES-d)),console.log("🎲 DICE RESULT:",{resultIndex:n.resultIndex,payout:n.payout,multiplier:n.multiplier,win:o,rollUnderIndex:d,luckyNumber:i,seed:a}),v(i);const x=n.payout-c;k.updateStats(x),setTimeout(()=>ne(i),h?50:0);const l=h?O+100:100;return setTimeout(()=>{R(!0),G(m=>m+1),q(m=>m+(n.payout-c)),o&&U(m=>m+1),console.log("🎲 ANIMATION COMPLETE - Final result:",i),o?j.play("win"):j.play("lose")},l),{win:o,luckyNumber:i,result:n}},F=()=>{R(!1),v(-1),T(null),g(t=>({...t,currentNumber:0,targetNumber:0,isAnimating:!1,animationProgress:0,particles:[],randomSequence:[],currentSequenceIndex:0})),p.current=0,u.current&&(cancelAnimationFrame(u.current),u.current=void 0)},re=()=>{q(0),G(0),U(0),F()};return r.useEffect(()=>()=>{u.current&&cancelAnimationFrame(u.current)},[]),{wager:c,setWager:A,resultIndex:D,rollUnderIndex:d,setRollUnderIndex:L,isDraggingSlider:z,setIsDraggingSlider:V,hasPlayed:H,lastGameResult:Y,gameStats:k,totalProfit:$,gameCount:K,winCount:Z,luckyNumberState:N,setLuckyNumberState:g,play:se,resetGame:F,resetSession:re,updateSliderValue:te,createParticleBurst:ae,multiplier:B,poolExceeded:ee,enableMotion:h,enableEffects:f,shouldRenderParticles:M,shouldRenderRunes:Q,shouldRenderMysticalCircles:X,particleCount:b,isPlaying:P.isPlaying,isAnimating:N.isAnimating,sounds:j,pool:I}},ve=y.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(135deg, #0a0511 0%, #1a1a2e 50%, #16213e 100%);
  border-radius: 12px;
  overflow: hidden;
`,Re=y.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: white;
  font-size: 18px;
  background: linear-gradient(135deg, #0a0511 0%, #1a1a2e 50%, #16213e 100%);
`,Te=y.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 40px;
  border-radius: 20px;
  border: 2px solid rgba(255, 215, 0, 0.5);
  text-align: center;
  z-index: 10;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`,Ne=y.h2`
  color: #ffd700;
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`,we=y.p`
  color: #d4a574;
  font-size: 16px;
  margin: 0 0 24px 0;
  line-height: 1.4;
`,Oe=y.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0;
  font-style: italic;
`,Ee=()=>e.jsxs(e.Fragment,{children:[e.jsx("ambientLight",{intensity:.4}),e.jsx("pointLight",{position:[10,10,10],intensity:.8,color:"#ffd700"}),e.jsx("pointLight",{position:[-10,-10,-10],intensity:.5,color:"#d4a574"}),e.jsx(le,{makeDefault:!0,position:[0,0,8],fov:50}),e.jsx(ce,{enablePan:!1,enableZoom:!1,autoRotate:!0,autoRotateSpeed:1,maxPolarAngle:Math.PI/2,minPolarAngle:Math.PI/2}),e.jsxs("mesh",{position:[0,0,0],rotation:[.5,.5,0],children:[e.jsx("boxGeometry",{args:[2,2,2]}),e.jsx("meshStandardMaterial",{color:"#ffffff",metalness:.3,roughness:.4,emissive:"#d4a574",emissiveIntensity:.1})]}),e.jsxs("mesh",{rotation:[Math.PI/2,0,0],position:[0,0,0],children:[e.jsx("torusGeometry",{args:[4,.1,16,100]}),e.jsx("meshStandardMaterial",{color:"#d4a574",emissive:"#d4a574",emissiveIntensity:.3,transparent:!0,opacity:.6})]}),e.jsx(ue,{position:[0,-3,0],fontSize:.8,color:"#ffd700",anchorX:"center",anchorY:"middle",font:"/fonts/Inter-Bold.woff",children:"3D Mode Coming Soon"})]});function We(){const{wager:P,setWager:c,hasPlayed:A,play:I,resetGame:D}=De();return e.jsxs(e.Fragment,{children:[e.jsx(E.Portal,{target:"screen",children:e.jsxs(ve,{children:[e.jsx(r.Suspense,{fallback:e.jsx(Re,{children:"Loading 3D Scene..."}),children:e.jsx(ie,{children:e.jsx(Ee,{})})}),e.jsxs(Te,{children:[e.jsx(Ne,{children:"🎲 3D Dice Coming Soon!"}),e.jsxs(we,{children:["Experience the magic 8-ball in stunning 3D with realistic physics,",e.jsx("br",{}),"interactive sphere rotation, and immersive visual effects."]}),e.jsx(Oe,{children:"Toggle back to 2D mode to play the current version"})]})]})}),e.jsxs(E.Portal,{target:"controls",children:[e.jsx(xe,{wager:P,setWager:c,onPlay:A?D:I,playDisabled:!0,playText:"3D Mode Coming Soon"}),e.jsx(ye,{onPlay:()=>{},playDisabled:!0,playText:"3D Mode Coming Soon",children:e.jsx(Se,{value:P,onChange:c,disabled:!0})})]})]})}export{We as default};
