import{r as l,j as n}from"./three-DV31HySq.js";import{aC as ae,G as O,aH as ne,aI as se,t as ie,aJ as oe,aX as le,B as re,T as ce,aM as ue,aN as de,aW as B,aO as me,d as S}from"./index-BarUt2o_.js";import{G as Ie}from"./GameStatsHeader-DfbFCrGS.js";import{G as xe}from"./GameControlsSection-BZ3LzTmM.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-Bm3pLP40.js";const e={CANVAS_WIDTH:1200,CANVAS_HEIGHT:800,MIN_MULTIPLIER:1.01,MAX_MULTIPLIER:100,DEFAULT_MULTIPLIER:2,MULTIPLIER_X:600,MULTIPLIER_Y:400,SLIDER_X:100,SLIDER_Y:700,SLIDER_WIDTH:1e3,SLIDER_HEIGHT:20,SLIDER_HANDLE_SIZE:30,COLORS:{background:"#0f0f23",multiplierBackground:"rgba(212, 165, 116, 0.1)",multiplierText:"#d4a574",multiplierGlow:"#b8336a",sliderTrack:"rgba(212, 165, 116, 0.3)",sliderFill:"#d4a574",sliderHandle:"#b8336a",sliderHandleHover:"#8b5a9e",text:"#ffffff",textSecondary:"#d4a574",accent:"#b8336a",successGreen:"#4ade80",dangerRed:"#ef4444"},ANIMATION_DURATION:2e3,PARTICLE_LIFE:60},r={IDLE:"idle",PLAYING:"playing",ANIMATING:"animating",COMPLETE:"complete"},f={tick:()=>{const a=new AudioContext,s=a.createOscillator(),o=a.createGain();s.connect(o),o.connect(a.destination),s.frequency.setValueAtTime(800,a.currentTime),o.gain.setValueAtTime(.1,a.currentTime),o.gain.exponentialRampToValueAtTime(.01,a.currentTime+.1),s.start(),s.stop(a.currentTime+.1)},climb:()=>{const a=new AudioContext,s=a.createOscillator(),o=a.createGain();s.connect(o),o.connect(a.destination),s.frequency.setValueAtTime(600,a.currentTime),s.frequency.exponentialRampToValueAtTime(1200,a.currentTime+.2),o.gain.setValueAtTime(.15,a.currentTime),o.gain.exponentialRampToValueAtTime(.01,a.currentTime+.2),s.start(),s.stop(a.currentTime+.2)},crash:()=>{const a=new AudioContext,s=a.createOscillator(),o=a.createGain();s.connect(o),o.connect(a.destination),s.frequency.setValueAtTime(800,a.currentTime),s.frequency.exponentialRampToValueAtTime(200,a.currentTime+.5),o.gain.setValueAtTime(.2,a.currentTime),o.gain.exponentialRampToValueAtTime(.01,a.currentTime+.5),s.start(),s.stop(a.currentTime+.5)},win:()=>{const a=new AudioContext;for(let s=0;s<4;s++)setTimeout(()=>{const o=a.createOscillator(),L=a.createGain();o.connect(L),L.connect(a.destination),o.frequency.setValueAtTime(800+s*200,a.currentTime),L.gain.setValueAtTime(.15,a.currentTime),L.gain.exponentialRampToValueAtTime(.01,a.currentTime+.3),o.start(),o.stop(a.currentTime+.3)},s*150)},sliderMove:()=>{const a=new AudioContext,s=a.createOscillator(),o=a.createGain();s.connect(o),o.connect(a.destination),s.frequency.setValueAtTime(1e3,a.currentTime),o.gain.setValueAtTime(.05,a.currentTime),o.gain.exponentialRampToValueAtTime(.01,a.currentTime+.05),s.start(),s.stop(a.currentTime+.05)}};S.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${e.COLORS.background};
  position: relative;
  overflow: hidden;
`;S.div`
  position: relative;
  background: linear-gradient(135deg, ${e.COLORS.background} 0%, rgba(212, 165, 116, 0.05) 100%);
  border-radius: 20px;
  border: 2px solid rgba(212, 165, 116, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
`;S.canvas`
  display: block;
  border-radius: 18px;
  cursor: pointer;
  
  &:hover {
    box-shadow: 0 0 30px rgba(212, 165, 116, 0.3);
  }
`;S.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: ${e.COLORS.text};
  
  h3 {
    margin: 0 0 10px 0;
    color: ${e.COLORS.textSecondary};
    font-size: 24px;
  }
  
  .info-row {
    display: flex;
    justify-content: space-between;
    margin: 5px 0;
    font-size: 16px;
    
    .label {
      color: ${e.COLORS.textSecondary};
      margin-right: 20px;
    }
    
    .value {
      color: ${e.COLORS.text};
      font-weight: bold;
    }
  }
`;S.div`
  position: absolute;
  top: 20px;
  right: 20px;
  color: ${e.COLORS.text};
  font-size: 14px;
  background: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid rgba(212, 165, 116, 0.3);
  min-width: 200px;
  
  h4 {
    margin: 0 0 10px 0;
    color: ${e.COLORS.textSecondary};
    text-align: center;
  }
  
  .stat-row {
    display: flex;
    justify-content: space-between;
    margin: 5px 0;
    padding: 2px 5px;
    border-radius: 3px;
  }
`;function Se({}){const a=ae({gameName:"Limbo",description:"How high can you go? Set your target multiplier and see if luck is on your side in this high-risk limbo game",rtp:99,maxWin:"1000x"}),s=O.useGame();ne();const o=se(),L=ie(),[p,q]=oe(),G=le(),[d,T]=l.useState(r.IDLE),[x,_]=l.useState(e.DEFAULT_MULTIPLIER),[D,g]=l.useState(1),[v,h]=l.useState(0),[R,A]=l.useState(null),[z,w]=l.useState(0),[E,H]=l.useState(!1),Z=window.innerWidth<=768,M=l.useRef(null),y=l.useRef(),j=l.useRef(0),[k,C]=l.useState([]),J=l.useMemo(()=>Math.max(.01,1/x*100),[x]),K=l.useMemo(()=>x*p,[x,p]),b=l.useCallback(i=>{const t=e.SLIDER_X,m=e.SLIDER_X+e.SLIDER_WIDTH,c=Math.max(0,Math.min(1,(i-t)/(m-t))),I=Math.log(e.MIN_MULTIPLIER),u=Math.log(e.MAX_MULTIPLIER),P=I+c*(u-I);return Math.round(Math.exp(P)*100)/100},[]),V=l.useCallback(i=>{const t=Math.log(e.MIN_MULTIPLIER),m=Math.log(e.MAX_MULTIPLIER),I=(Math.log(i)-t)/(m-t);return e.SLIDER_X+I*e.SLIDER_WIDTH},[]),Q=l.useCallback(i=>{if(d!==r.IDLE)return;const t=M.current;if(!t)return;const m=t.getBoundingClientRect(),c=i.clientX-m.left,I=i.clientY-m.top;if(I>=e.SLIDER_Y-20&&I<=e.SLIDER_Y+e.SLIDER_HEIGHT+20&&c>=e.SLIDER_X&&c<=e.SLIDER_X+e.SLIDER_WIDTH){H(!0);const u=b(c);_(u),f.sliderMove()}},[d,b]),ee=l.useCallback(i=>{if(!E||d!==r.IDLE)return;const t=M.current;if(!t)return;const m=t.getBoundingClientRect(),c=i.clientX-m.left,I=b(c);_(I),f.sliderMove()},[E,d,b]),U=l.useCallback(()=>{H(!1)},[]),N=l.useCallback((i,t,m,c=10)=>{const I=[];for(let u=0;u<c;u++)I.push({x:i,y:t,vx:(Math.random()-.5)*15,vy:(Math.random()-.5)*15,life:e.PARTICLE_LIFE,maxLife:e.PARTICLE_LIFE,color:m});C(u=>[...u,...I])},[]),X=l.useCallback(()=>{C(i=>i.map(t=>({...t,x:t.x+t.vx,y:t.y+t.vy,vx:t.vx*.98,vy:t.vy*.98,life:t.life-1})).filter(t=>t.life>0))},[]),F=l.useCallback(()=>{const i=M.current;if(!i)return;const t=i.getContext("2d");if(!t)return;t.fillStyle=e.COLORS.background,t.fillRect(0,0,e.CANVAS_WIDTH,e.CANVAS_HEIGHT);const m=d===r.IDLE?x:d===r.ANIMATING?D:v;if(d===r.ANIMATING||d===r.COMPLETE){const u=d===r.ANIMATING?Math.sin(Date.now()*.01)*.3+.7:1;t.save(),t.shadowColor=R?e.COLORS.successGreen:e.COLORS.multiplierGlow,t.shadowBlur=40*u,t.fillStyle=e.COLORS.multiplierBackground,t.fillRect(e.MULTIPLIER_X-200,e.MULTIPLIER_Y-100,400,200),t.restore()}t.fillStyle=d===r.COMPLETE?R?e.COLORS.successGreen:e.COLORS.dangerRed:e.COLORS.multiplierText,t.font="bold 80px Arial",t.textAlign="center",t.textBaseline="middle",t.fillText(`${m.toFixed(2)}x`,e.MULTIPLIER_X,e.MULTIPLIER_Y),t.fillStyle=e.COLORS.sliderTrack,t.fillRect(e.SLIDER_X,e.SLIDER_Y,e.SLIDER_WIDTH,e.SLIDER_HEIGHT);const c=V(x),I=c-e.SLIDER_X;t.fillStyle=e.COLORS.sliderFill,t.fillRect(e.SLIDER_X,e.SLIDER_Y,I,e.SLIDER_HEIGHT),t.fillStyle=E?e.COLORS.sliderHandleHover:e.COLORS.sliderHandle,t.beginPath(),t.arc(c,e.SLIDER_Y+e.SLIDER_HEIGHT/2,e.SLIDER_HANDLE_SIZE/2,0,Math.PI*2),t.fill(),t.fillStyle=e.COLORS.text,t.font="14px Arial",t.textAlign="left",t.fillText(`${e.MIN_MULTIPLIER}x`,e.SLIDER_X,e.SLIDER_Y-10),t.textAlign="right",t.fillText(`${e.MAX_MULTIPLIER}x`,e.SLIDER_X+e.SLIDER_WIDTH,e.SLIDER_Y-10),t.textAlign="center",t.fillText(`Target: ${x.toFixed(2)}x`,c,e.SLIDER_Y+e.SLIDER_HEIGHT+25),k.forEach(u=>{const P=u.life/u.maxLife;t.globalAlpha=P,t.fillStyle=u.color,t.beginPath(),t.arc(u.x,u.y,3,0,Math.PI*2),t.fill()}),t.globalAlpha=1},[d,x,D,v,R,E,k,V]);l.useEffect(()=>{const i=()=>{X(),F(),y.current=requestAnimationFrame(i)};return i(),()=>{y.current&&cancelAnimationFrame(y.current)}},[X,F]);const Y=l.useCallback((i,t)=>{T(r.ANIMATING),g(1),j.current=Date.now();const m=()=>{const c=Date.now()-j.current,I=Math.min(c/e.ANIMATION_DURATION,1);if(i){const u=x+(t-x)*I;g(u)}else{const u=1+(t-1)*I;g(u)}c%100<20&&f.climb(),I<1?requestAnimationFrame(m):(h(t),T(r.COMPLETE),i?(f.win(),N(e.MULTIPLIER_X,e.MULTIPLIER_Y,e.COLORS.successGreen,20)):(f.crash(),N(e.MULTIPLIER_X,e.MULTIPLIER_Y,e.COLORS.dangerRed,15)))};requestAnimationFrame(m)},[x,N]),W=l.useCallback(i=>re["limbo-v2"].calculateBetArray(i),[]),te=l.useCallback(async()=>{try{T(r.PLAYING),A(null),h(0),g(1);const i=W(x);await s.play({wager:p,bet:i});const t=await s.result(),m=t.payout>0;A(m),w(t.payout);let c;m?c=x+Math.random()*x*.2:c=1.01+Math.random()*(x-1.01),setTimeout(()=>{Y(m,c)},500)}catch(i){G({title:"Game Error",description:`Game error: ${i.message}`}),T(r.IDLE)}},[x,p,s,W,Y,G]),$=l.useCallback(()=>{T(r.IDLE),A(null),h(0),g(1),C([])},[]);return n.jsxs(n.Fragment,{children:[a,n.jsx(O.Portal,{target:"stats",children:n.jsx(Ie,{gameName:"Limbo",gameMode:"V2",rtp:"95",stats:{gamesPlayed:0,wins:0,losses:0},onReset:()=>{T(r.IDLE),_(e.DEFAULT_MULTIPLIER),g(1),h(0),A(null),w(0),C([])}})}),n.jsx(O.Portal,{target:"screen",children:n.jsxs("div",{style:{position:"relative",width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center"},children:[n.jsx("canvas",{ref:M,width:e.CANVAS_WIDTH,height:e.CANVAS_HEIGHT,onMouseDown:Q,onMouseMove:ee,onMouseUp:U,onMouseLeave:U,style:{border:`2px solid ${e.COLORS.accent}`,borderRadius:"8px",background:e.COLORS.background,cursor:E?"grabbing":"grab"}}),n.jsx(xe,{children:n.jsxs("div",{className:"game-info-section",children:[n.jsxs("div",{className:"info-item",children:[n.jsx("span",{className:"label",children:"Target:"}),n.jsxs("span",{className:"value",children:[x.toFixed(2),"x"]})]}),n.jsxs("div",{className:"info-item",children:[n.jsx("span",{className:"label",children:"Current:"}),n.jsxs("span",{className:"value",children:[D.toFixed(2),"x"]})]}),n.jsxs("div",{className:"info-item",children:[n.jsx("span",{className:"label",children:"Win Chance:"}),n.jsxs("span",{className:"value",children:[J.toFixed(2),"%"]})]}),n.jsxs("div",{className:"info-item",children:[n.jsx("span",{className:"label",children:"Potential:"}),n.jsx("span",{className:"value",children:n.jsx(ce,{mint:o.token,suffix:L?.symbol,amount:K})})]}),d===r.COMPLETE&&n.jsxs("div",{className:"info-item",children:[n.jsx("span",{className:"label",children:"Result:"}),n.jsx("span",{className:"value",style:{color:R?e.COLORS.successGreen:e.COLORS.dangerRed},children:R?`Won ${z.toFixed(2)}`:"Lost"})]})]})}),n.jsx(ue,{children:n.jsx("div",{style:{textAlign:"center",color:e.COLORS.accent,fontSize:"14px",marginTop:"10px"},children:"Drag the handle on the chart to set your target multiplier"})})]})}),n.jsx(O.Portal,{target:"controls",children:Z?n.jsx(de,{wager:p,setWager:q,onPlay:te,playDisabled:d!==r.IDLE,playText:d===r.PLAYING?"Playing...":d===r.ANIMATING?"Animating...":"Play",children:n.jsx(B,{onClick:$,disabled:d===r.PLAYING||d===r.ANIMATING,children:"Reset"})}):n.jsx(me,{children:n.jsx(B,{onClick:$,disabled:d===r.PLAYING||d===r.ANIMATING,children:"Reset"})})})]})}export{Se as default};
