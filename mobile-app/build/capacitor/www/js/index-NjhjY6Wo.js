var Se=Object.defineProperty;var Pe=(p,i,n)=>i in p?Se(p,i,{enumerable:!0,configurable:!0,writable:!0,value:n}):p[i]=n;var u=(p,i,n)=>Pe(p,typeof i!="symbol"?i+"":i,n);import{R as I,r as v,j as t}from"./three-D4AtYCWe.js";import{M as a}from"./matter-Csocjh7Y.js";import{d as D,G as Y,av as Ce,aw as je,ax as Be,ay as Ee,W as Ie,az as ce,aA as Me,aB as Re,aC as ze,aD as De}from"./index-eL7pTMGs.js";import{G as Te}from"./GameStatsHeader-BAMe0qyx.js";import{G as Fe}from"./GameRecentPlaysHorizontal-DwRhmHlC.js";import"./react-vendor-faCf7XlP.js";import"./physics-audio-DLMfKFaI.js";import"./blockchain-C0nfa7Sw.js";const Ye=700,He=700,Ne=50,qe=9,be=11,We=.4,Ge=1,Q=10,xe=60,M=xe,V=xe*1.2,$=4;let he=class{constructor(i){u(this,"width",Ye);u(this,"height",He);u(this,"engine",a.Engine.create({gravity:{y:Ge},timing:{timeScale:1}}));u(this,"runner",a.Runner.create({isFixed:!0}));u(this,"props");u(this,"ballComposite",a.Composite.create());u(this,"bucketComposite",a.Composite.create());u(this,"startPositions");u(this,"currentPath",null);u(this,"replayCollisions",[]);u(this,"currentFrame",0);u(this,"replayBall",null);u(this,"animationId",null);u(this,"visualizePath",!1);u(this,"makePlinko",(i,n)=>a.Bodies.circle(this.width/2+i,-10,qe,{restitution:We,collisionFilter:{group:-6969},label:"Plinko",plugin:{startPositionIndex:n}}));u(this,"collisionHandler",i=>{const n={};for(const l of i.pairs){const r=(o,d)=>{l.bodyA.label===d&&(n[o]=l.bodyA),l.bodyB.label===d&&(n[o]=l.bodyB)};r("peg","Peg"),r("barrier","Barrier"),r("bucket","Bucket"),r("plinko","Plinko")}this.props.onContact(n)});this.props=i,this.startPositions=Array.from({length:Ne}).map(()=>a.Common.random(-Q/2,Q/2));const n=this.height/(i.rows+2),l=Array.from({length:i.rows}).flatMap((r,o,d)=>{const b=o+1,k=this.width*o/(d.length-1),c=b===1?0:k/(b-1);return Array.from({length:b}).map((A,w)=>{const C=this.width/2-k/2+c*w,U=n*o+n/2;return a.Bodies.circle(C,U,be,{isStatic:!0,label:"Peg",plugin:{pegIndex:o*b+w}})})}).slice(1);a.Composite.add(this.bucketComposite,this.makeBuckets()),a.Composite.add(this.engine.world,[...l,this.ballComposite,this.bucketComposite])}setVisualizePath(i){this.visualizePath=i}makeBuckets(){const i=Array.from(new Set(this.props.multipliers)),n=i.slice(1),l=[...n].reverse(),r=[i[0],i[0],i[0]],o=[...l,...r,...n],d=this.width/o.length,b=Array.from({length:o.length+1}).map((c,A)=>a.Bodies.rectangle(A*d,this.height-V/2,$,V,{isStatic:!0,label:"Barrier",chamfer:{radius:2}}));return[...o.map((c,A)=>a.Bodies.rectangle(A*d+d/2,this.height-M/2,d-$,M,{isStatic:!0,isSensor:!0,label:"Bucket",plugin:{bucketIndex:A,bucketMultiplier:c}})),...b]}getBodies(){return a.Composite.allBodies(this.engine.world)}single(){a.Events.off(this.engine,"collisionStart",this.collisionHandler),a.Runner.stop(this.runner),a.Events.on(this.engine,"collisionStart",this.collisionHandler),a.Composite.add(this.ballComposite,this.makePlinko(a.Common.random(-Q,Q),0)),a.Runner.run(this.runner,this.engine)}cleanup(){a.World.clear(this.engine.world,!1),a.Engine.clear(this.engine),this.animationId!==null&&cancelAnimationFrame(this.animationId),this.animationId=null}reset(){a.Runner.stop(this.runner),a.Composite.clear(this.ballComposite,!1),a.Composite.add(this.ballComposite,this.startPositions.map(this.makePlinko))}simulate(i){this.reset();const n=this.startPositions.map(()=>[]),l=[];let r=null,o=0;const d=c=>{this.recordContactEvent(c,o,l);for(const A of c.pairs){const w=A.bodyA,C=A.bodyB;if(w.label==="Plinko"&&C.label==="Bucket"&&C.plugin.bucketIndex===i||C.label==="Plinko"&&w.label==="Bucket"&&w.plugin.bucketIndex===i){r=(w.label==="Plinko"?w:C).plugin.startPositionIndex;break}}};for(a.Events.on(this.engine,"collisionStart",d);o<1e3;o++){a.Runner.tick(this.runner,this.engine,1);for(const c of this.ballComposite.bodies)if(c.label==="Plinko"){const A=c.plugin.startPositionIndex;n[A].push(c.position.x,c.position.y)}if(r!==null&&this.ballComposite.bodies.find(A=>A.plugin.startPositionIndex===r).position.y>this.height){o++;break}}if(a.Events.off(this.engine,"collisionStart",d),a.Runner.stop(this.runner),a.Composite.clear(this.ballComposite,!1),r===null)return null;const b=new Float32Array(n[r]),k=l.filter(c=>c.event.plinko?.plugin.startPositionIndex===r);return{bucketIndex:i,plinkoIndex:r,path:b,collisions:k}}recordContactEvent(i,n,l,r){for(const o of i.pairs){const d={},b=(k,c)=>{o.bodyA.label===c&&(d[k]=o.bodyA),o.bodyB.label===c&&(d[k]=o.bodyB)};b("peg","Peg"),b("barrier","Barrier"),b("bucket","Bucket"),b("plinko","Plinko"),d.plinko&&(r===void 0||d.plinko.plugin.startPositionIndex===r)&&l.push({frame:n,event:d})}}run(i){const n=a.Common.choose(this.bucketComposite.bodies.filter(o=>o.plugin.bucketMultiplier===i)),l=this.simulate(n.plugin.bucketIndex);if(!l)throw new Error("Failed to simulate desired outcome");this.visualizePath&&console.log("Simulation frames:",l.path.length/2),this.currentPath=l.path,this.currentFrame=0,this.replayCollisions=l.collisions;const r=this.makePlinko(this.startPositions[l.plinkoIndex],l.plinkoIndex);a.Composite.add(this.ballComposite,r),this.replayBall=r,this.startReplayAnimation()}startReplayAnimation(){this.animationId!==null&&cancelAnimationFrame(this.animationId);const i=()=>{if(!this.currentPath||!this.replayBall)return;const n=this.currentPath.length/2;if(this.currentFrame>=n)return;const l=this.currentPath[this.currentFrame*2],r=this.currentPath[this.currentFrame*2+1];a.Body.setPosition(this.replayBall,{x:l,y:r}),this.replayCollisions.filter(o=>o.frame===this.currentFrame).forEach(({event:o})=>this.props.onContact(o)),this.currentFrame++,this.animationId=requestAnimationFrame(i)};this.animationId=requestAnimationFrame(i)}runAll(){a.Events.off(this.engine,"collisionStart",this.collisionHandler),a.Runner.stop(this.runner),a.Composite.clear(this.ballComposite,!1),a.Events.on(this.engine,"collisionStart",this.collisionHandler),a.Composite.add(this.ballComposite,this.startPositions.map(this.makePlinko)),a.Runner.run(this.runner,this.engine)}};const Ue=D.div`
  perspective: 100px;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg, 
    var(--deep-romantic-night) 0%, 
    var(--deep-crimson-rose) 15%, 
    var(--soft-purple-twilight) 30%, 
    var(--love-letter-gold) 45%, 
    var(--deep-crimson-rose) 60%, 
    var(--soft-purple-twilight) 75%, 
    var(--deep-romantic-night) 90%
  );
  border-radius: 24px;
  border: 3px solid var(--love-letter-gold);
  box-shadow: 
    0 25px 50px rgba(10, 5, 17, 0.8),
    inset 0 2px 4px rgba(212, 165, 116, 0.2),
    inset 0 -2px 4px rgba(10, 5, 17, 0.6),
    0 0 40px var(--deep-crimson-rose);
  overflow: hidden;
  animation: romanticPulse 4s ease-in-out infinite;
  
  /* Romantic Plinko elements */
  &::before {
    content: '💎';
    position: absolute;
    top: 8%;
    left: 6%;
    font-size: 140px;
    opacity: 0.1;
    transform: rotate(-15deg);
    pointer-events: none;
    color: var(--love-letter-gold);
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(10, 5, 17, 0.7);
    animation: loveLetterFloat 8s ease-in-out infinite;
  }

  &::after {
    content: '💖';
    position: absolute;
    bottom: 10%;
    right: 8%;
    font-size: 120px;
    opacity: 0.12;
    transform: rotate(25deg);
    pointer-events: none;
    color: var(--deep-crimson-rose);
    z-index: 0;
    text-shadow: 3px 3px 8px rgba(10, 5, 17, 0.7);
    animation: candlestickSparkle 6s ease-in-out infinite;
  }

  @keyframes romanticPulse {
    0%, 100% { 
      filter: brightness(1) saturate(1) hue-rotate(0deg);
      border-color: var(--love-letter-gold);
    }
    25% { 
      filter: brightness(1.05) saturate(1.1) hue-rotate(5deg);
      border-color: var(--deep-crimson-rose);
    }
    50% { 
      filter: brightness(1.1) saturate(1.2) hue-rotate(10deg);
      border-color: var(--soft-purple-twilight);
    }
    75% { 
      filter: brightness(1.05) saturate(1.1) hue-rotate(5deg);
      border-color: var(--deep-crimson-rose);
    }
  }

  @keyframes loveLetterFloat {
    0%, 100% { 
      transform: rotate(-15deg) translateY(0px);
      opacity: 0.1;
    }
    25% { 
      transform: rotate(-10deg) translateY(-8px);
      opacity: 0.15;
    }
    50% { 
      transform: rotate(-5deg) translateY(-15px);
      opacity: 0.2;
    }
    75% { 
      transform: rotate(-10deg) translateY(-8px);
      opacity: 0.15;
    }
  }

  @keyframes candlestickSparkle {
    0%, 100% { 
      transform: rotate(25deg) scale(1);
      opacity: 0.12;
    }
    20% { 
      transform: rotate(30deg) scale(1.05);
      opacity: 0.18;
    }
    40% { 
      transform: rotate(35deg) scale(1.1);
      opacity: 0.25;
    }
    60% { 
      transform: rotate(32deg) scale(1.08);
      opacity: 0.2;
    }
    80% { 
      transform: rotate(28deg) scale(1.03);
      opacity: 0.15;
    }
  }

  /* Use min-height so internal layout can expand without being constrained */
  & > * {
    position: relative;
    z-index: 1;
    width: 100%;
    min-height: 100%;
  }

  .plinko-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
    transform: rotateX(1deg) rotateY(0deg);
    position: relative;
    z-index: 2;
    padding: 30px 20px;
    max-width: 1200px;
    margin: 0 auto;
    min-height: 100%;
  }

  /* Additional gravity elements */
  .gravity-bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;

    &::before {
      content: '🔵';
      position: absolute;
      top: 30%;
      right: 15%;
      font-size: 100px;
      opacity: 0.05;
      transform: rotate(-20deg);
      color: #a5f3fc;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.4));
    }

    &::after {
      content: '💫';
      position: absolute;
      bottom: 35%;
      left: 12%;
      font-size: 90px;
      opacity: 0.07;
      transform: rotate(30deg);
      color: #22d3ee;
      filter: drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.4));
    }
  }

  /* Melody overlay for flowing movement */
  .melody-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 25% 25%, rgba(34, 211, 238, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(14, 116, 144, 0.12) 0%, transparent 60%),
      radial-gradient(circle at 50% 50%, rgba(8, 145, 178, 0.1) 0%, transparent 80%);
    pointer-events: none;
    z-index: 0;
  }

  /* Inevitability indicator for gravity's pull */
  .inevitability-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    height: 400px;
    border: 1px solid rgba(34, 211, 238, 0.2);
    border-radius: 50%;
    animation: gravity-pulse 6s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  @keyframes gravity-pulse {
    0%, 100% {
      opacity: 0.8;
      filter: brightness(1);
    }
    50% {
      opacity: 1;
      filter: brightness(1.15);
    }
  }

  @keyframes falling-motion {
    0%, 100% {
      transform: scale(1);
      opacity: 0.9;
    }
    50% {
      transform: scale(1.03);
      opacity: 1;
    }
  }

  /* Enhanced styling for plinko-specific elements */
  .gravity-board-area {
    background: 
      linear-gradient(135deg, 
        rgba(12, 74, 110, 0.9) 0%,
        rgba(14, 116, 144, 0.85) 50%,
        rgba(12, 74, 110, 0.9) 100%
      );
    border: 2px solid rgba(34, 211, 238, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.5),
      inset 0 1px 2px rgba(255, 255, 255, 0.1);
    padding: 20px;
    color: #a5f3fc;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }

  .falling-display {
    background: 
      linear-gradient(135deg, 
        rgba(8, 145, 178, 0.9) 0%,
        rgba(6, 182, 212, 0.85) 50%,
        rgba(8, 145, 178, 0.9) 100%
      );
    border: 3px solid rgba(34, 211, 238, 0.6);
    border-radius: 20px;
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.5),
      inset 0 2px 4px rgba(255, 255, 255, 0.15),
      0 0 25px rgba(34, 211, 238, 0.3);
    padding: 25px;
    color: #f0fdff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    animation: gravity-pulse 4s ease-in-out infinite;
  }

  .physics-container {
    background: 
      linear-gradient(135deg, 
        rgba(12, 74, 110, 0.8) 0%,
        rgba(14, 116, 144, 0.75) 50%,
        rgba(12, 74, 110, 0.8) 100%
      );
    border: 2px solid rgba(34, 211, 238, 0.3);
    border-radius: 12px;
    padding: 20px;
    backdrop-filter: blur(15px);
    box-shadow: 
      0 6px 24px rgba(0, 0, 0, 0.3),
      inset 0 1px 2px rgba(255, 255, 255, 0.05);
  }

  /* Result area for consistent layout */
  .gravity-result-area {
    background: 
      linear-gradient(135deg, 
        rgba(14, 116, 144, 0.9) 0%,
        rgba(8, 145, 178, 0.85) 50%,
        rgba(14, 116, 144, 0.9) 100%
      );
    border: 2px solid rgba(34, 211, 238, 0.4);
    border-radius: 16px;
    backdrop-filter: blur(20px);
    box-shadow: 
      0 10px 35px rgba(0, 0, 0, 0.4),
      inset 0 2px 4px rgba(255, 255, 255, 0.12),
      0 0 20px rgba(34, 211, 238, 0.3);
    padding: 25px;
    color: #f0fdff;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

  /* Enhanced Plinko Bucket Styling */
  .plinko-bucket {
    background: linear-gradient(135deg, 
      rgba(6, 182, 212, 0.95) 0%,
      rgba(34, 211, 238, 0.9) 50%,
      rgba(103, 232, 249, 0.95) 100%
    );
    border: 3px solid rgba(255, 255, 255, 0.4);
    border-radius: 8px 8px 16px 16px;
    box-shadow: 
      0 8px 25px rgba(0, 0, 0, 0.6),
      inset 0 2px 4px rgba(255, 255, 255, 0.3),
      0 0 15px rgba(34, 211, 238, 0.5),
      inset 0 -2px 8px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(15px);
    color: #ffffff;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.9);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    margin: 0 2px;
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .plinko-bucket::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      transparent 30%, 
      rgba(255, 255, 255, 0.2) 50%, 
      transparent 70%
    );
    animation: bucket-shimmer 3s ease-in-out infinite;
  }

  .plinko-bucket::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, 
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.1) 100%
    );
    pointer-events: none;
  }

  .plinko-bucket:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 35px rgba(0, 0, 0, 0.5),
      inset 0 2px 6px rgba(255, 255, 255, 0.25),
      0 0 25px rgba(34, 211, 238, 0.6);
  }

  .plinko-bucket.high-multiplier {
    background: linear-gradient(135deg, 
      rgba(34, 211, 238, 0.95) 0%,
      rgba(103, 232, 249, 0.9) 50%,
      rgba(165, 243, 252, 0.95) 100%
    );
    border-color: rgba(103, 232, 249, 0.8);
    box-shadow: 
      0 10px 30px rgba(0, 0, 0, 0.5),
      inset 0 3px 6px rgba(255, 255, 255, 0.3),
      0 0 30px rgba(103, 232, 249, 0.7);
    animation: gravity-pulse 2s ease-in-out infinite;
  }

  .plinko-bucket.medium-multiplier {
    background: linear-gradient(135deg, 
      rgba(14, 116, 144, 0.9) 0%,
      rgba(6, 182, 212, 0.85) 50%,
      rgba(34, 211, 238, 0.9) 100%
    );
  }

  .plinko-bucket.low-multiplier {
    background: linear-gradient(135deg, 
      rgba(12, 74, 110, 0.85) 0%,
      rgba(14, 116, 144, 0.8) 50%,
      rgba(8, 145, 178, 0.85) 100%
    );
    opacity: 0.8;
  }

  @keyframes bucket-shimmer {
    0%, 100% {
      transform: translateX(-100%);
    }
    50% {
      transform: translateX(100%);
    }
  }

  /* Responsive Design for Plinko */
  @media (max-width: 640px) {
    .plinko-content {
      padding: 20px 15px;
      gap: 15px;
    }

    .gravity-board-area {
      padding: 15px;
      border-radius: 12px;
    }

    .falling-display {
      padding: 18px;
      border-radius: 16px;
    }

    .physics-container {
      padding: 15px;
      border-radius: 10px;
    }

    .gravity-result-area {
      padding: 18px;
      border-radius: 12px;
      min-height: 50px;
    }

    .plinko-bucket {
      margin: 0 1px;
      min-height: 35px;
      font-size: 12px;
    }

    .inevitability-indicator {
      width: 300px;
      height: 300px;
    }
  }

  @media (min-width: 641px) and (max-width: 768px) {
    .plinko-content {
      padding: 25px 18px;
      gap: 18px;
    }

    .gravity-board-area {
      padding: 18px;
    }

    .falling-display {
      padding: 22px;
    }

    .physics-container {
      padding: 18px;
    }

    .gravity-result-area {
      padding: 22px;
      min-height: 55px;
    }

    .plinko-bucket {
      margin: 0 1.5px;
      min-height: 38px;
      font-size: 13px;
    }

    .inevitability-indicator {
      width: 350px;
      height: 350px;
    }
  }

  @media (min-width: 769px) and (max-width: 899px) {
    .plinko-content {
      padding: 28px 20px;
      gap: 20px;
    }

    .gravity-board-area {
      padding: 20px;
    }

    .falling-display {
      padding: 24px;
    }

    .physics-container {
      padding: 20px;
    }

    .gravity-result-area {
      padding: 24px;
      min-height: 58px;
    }

    .plinko-bucket {
      margin: 0 2px;
      min-height: 40px;
      font-size: 14px;
    }

    .inevitability-indicator {
      width: 380px;
      height: 380px;
    }
  }

  @media (min-width: 900px) {
    .plinko-content {
      padding: 30px 20px;
      gap: 20px;
    }

    .gravity-board-area {
      padding: 20px;
    }

    .falling-display {
      padding: 25px;
    }

    .physics-container {
      padding: 20px;
    }

    .gravity-result-area {
      padding: 25px;
      min-height: 60px;
    }

    .plinko-bucket {
      margin: 0 2px;
      min-height: 40px;
    }

    .inevitability-indicator {
      width: 400px;
      height: 400px;
    }
  }
`;function Ke(p){return p<=.99?{primary:"rgba(239, 68, 68, 0.9)",secondary:"rgba(220, 38, 38, 0.85)",tertiary:"rgba(185, 28, 28, 0.9)"}:p>=1&&p<=3.99?{primary:"rgba(245, 158, 11, 0.9)",secondary:"rgba(217, 119, 6, 0.85)",tertiary:"rgba(180, 83, 9, 0.9)"}:p>=4&&p<=6.99?{primary:"rgba(34, 197, 94, 0.9)",secondary:"rgba(22, 163, 74, 0.85)",tertiary:"rgba(21, 128, 61, 0.9)"}:{primary:"rgba(59, 130, 246, 0.9)",secondary:"rgba(37, 99, 235, 0.85)",tertiary:"rgba(29, 78, 216, 0.9)"}}D.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
  pointer-events: auto; /* allow hover interactions inside */
  max-height: 68vh; /* cap height and allow scrolling */
  width: 125px;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.06));
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.06);

  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    right: 8px;
    top: 16px;
    transform: none;
    max-height: 40vh;
    width: 64px;
    gap: 6px;
    padding: 8px;
  }

  /* Hide on very small screens */
  @media (max-width: 480px) {
    display: none;
  }
`;D.div`
  display: flex;
  flex-direction: column-reverse; /* newest at top visually */
  gap: 10px;
  width: 100%;
  overflow-y: hidden;
  padding-right: 4px; /* avoid touching scrollbar */

  @media (max-width: 768px) {
    gap: 6px;
  }
`;D.div`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.28s ease;
  transform: translateY(0);
  opacity: 1;

  ${({isTransitioning:p})=>p&&`
    z-index: 10;
    transform: translateY(-4px);
  `}
`;D.div`
  position: relative;
  width: 64px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    width: 52px;
    height: 36px;
    font-size: 12px;
    border-radius: 6px;
  }
  
  ${({multiplier:p,isPlaceholder:i})=>{if(i)return`
        /* Enhanced 3D placeholder styling */
        background: linear-gradient(135deg, 
          rgba(100, 100, 100, 0.3), 
          rgba(80, 80, 80, 0.3) 50%, 
          rgba(60, 60, 60, 0.3)
        );
        border: 2px dashed rgba(255, 255, 255, 0.2);
        
        /* Multiple shadow layers for 3D depth */
        box-shadow: 
          0 6px 12px rgba(5, 5, 15, 0.4),
          0 4px 8px rgba(8, 8, 20, 0.3),
          0 2px 4px rgba(15, 15, 30, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      `;const n=Ke(p);return`
      /* Enhanced 3D gradient backgrounds like Mines */
      background: linear-gradient(135deg, 
        ${n.primary}, 
        ${n.secondary} 50%, 
        ${n.tertiary}
      );
      
      /* Multiple shadow layers for 3D depth */
      box-shadow: 
        0 6px 12px rgba(5, 5, 15, 0.4),
        0 4px 8px rgba(8, 8, 20, 0.3),
        0 2px 4px rgba(15, 15, 30, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
        
      /* Enhanced 3D border effects */
      border: 3px solid ${n.primary.replace("0.9)","0.8)")};
    `}}
  
  /* Enhanced 3D highlight overlay */
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 10px;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  ${({isActive:p})=>p&&`
    &::before {
      opacity: 1;
    }
  `}
  
  /* Enhanced 3D animation with more dramatic effects */
  @keyframes bucketPulse {
    0% {
      transform: scale(1.15);
    }
    50% {
      transform: scale(1.25);
      box-shadow: 
        0 12px 30px rgba(255, 215, 0, 0.8),
        0 8px 20px rgba(5, 5, 15, 0.4),
        0 6px 12px rgba(8, 8, 20, 0.3),
        0 4px 8px rgba(15, 15, 30, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }
    100% {
      transform: scale(1.15);
    }
  }
  
  @media (max-width: 768px) {
    @keyframes bucketPulse {
      0% {
        transform: scale(1.1);
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1.1);
      }
    }
  }
`;D.div`
  position: absolute;
  top: -8px;
  left: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  /* Enhanced 3D styling for index badge */
  box-shadow: 
    0 3px 6px rgba(5, 5, 15, 0.6),
    0 2px 4px rgba(8, 8, 20, 0.4),
    0 1px 2px rgba(15, 15, 30, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
    
  /* 3D border effect */
  border: 2px solid rgba(255, 255, 255, 0.4);
  
  /* Text shadow for depth */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  
  @media (max-width: 768px) {
    width: 14px;
    height: 14px;
    font-size: 8px;
    top: -6px;
    left: -6px;
  }
`;D.div`
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  letter-spacing: 0.5px;
  
  /* Enhanced 3D text styling */
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.8),
    0 1px 2px rgba(0, 0, 0, 0.6),
    1px 1px 0 rgba(255, 255, 255, 0.3);
    
  /* Subtle background for depth */
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.4), 
    rgba(20, 20, 30, 0.3)
  );
  padding: 4px 8px;
  border-radius: 6px;
  
  /* 3D border effect */
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 2px 4px rgba(5, 5, 15, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
`;const Le="data:audio/mpeg;base64,//uUZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAAFoACioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi//////////////////////////////////////////////////////////////////8AAAA8TEFNRTMuMTAwBK8AAAAAAAAAADUgJALCjQABzAAABaBVoENUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//vEZAAAAZYTUh094AgAAA/woAABFNCvQ7ndgEAAAD/DAAAAA/wAA3ilMsavdn4LmXOMrHBTk7MtcCbjjVcB5VjZ7K9n3Aiahx8P35/cUDBc+H5zxBBAgAAAAAUCgPFi4MgAAAQhGYXhIYHB2YZAkqiYCDCZREgdBTgZFo6bLrSaVKKZTE+aaDOYZjARPYYVgIZpDiYNAUcXTHTBhg0qCvQxUvMukwaHGblgCUTHUQwpTMkC0RX/AgGgsw5ZBh5oQBKlpkAGnnPIUOUmI2kkSOdF2EJVZl8ovX8YEl7iUMPyB0mHTT/S6t////DcvgOL4Re/Psppq8ZPdAYKRZWLABAEDMaj6hQAgAAAAuyKhwCgEwYBjDAFAQ3HRoABAY/KBsiKmHC2YtJQCFBhURBiABAZMNgMwMEgMhC0AYPgYvZgFhkBhwggY2CIBSQDJwMJhYAgSgYRBYGERoA8JCPQsiAw6IQbDCZgY1AQAQcCyEOGRMLnRyzi1QDg2BgkDhloGxANkBCMgJAkDDogAiJQDgV+TpExzysThFAMCA0BwOBuaACCAFwODbL+eTMz6CjQRyISCgRSQrcUELT/uib0jSw5gyo+iDjLEqRAZX/059Bjybm5gRhJjLE2Sw5JMEkQIn//7Ghm5uYMaJpm6CBVICVCeIcVydIaWiLE0ViZ/////5otM3Uh////yiVSaMieJkSWWJsfh/CVyunN0L0TVCkSQUuJ0uMJPIcElEiVVVV6pJsFNBTcgrgV4KbFNyCuBTwUXFFZBTAU+KLxFExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//uUZNEACJqCz25yoJAAAA/wwAAAB3Q/J3zzACgAAD/DgAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq",Ze="/assets/fall-B80AaX79.mp3",Je="/assets/win-D69axww9.mp3";function Qe(p,i){const[n,l]=I.useState(null);return I.useEffect(()=>{const r=new he(p);return l(r),()=>r.cleanup()},i),n}const Ve=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,10,10,10,15],$e=[.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,1.5,3,3,3,3,3,3,3,6];function lt(){const p=Y.useGame(),i=Ce(),[n,l]=je(),[r,o]=I.useState(!1),d=Be({bump:Le,win:Je,fall:Ze}),b=I.useRef({}),k=I.useRef({}),c=r?Ve:$e,A=r?12:14,w=I.useMemo(()=>Array.from(new Set(c)),[c]),{settings:C}=Ee(),{mobile:U}=Ie(),[ue,O]=v.useState(!1),Ae=A,X=14,[T,K]=v.useState(!1),[j,ie]=v.useState(1),[Oe,re]=v.useState(new Set),[ae,ne]=v.useState([]),oe=!1,fe=!1,se=be,le=qe;I.useMemo(()=>{const e=new Map;for(const s of ae)e.set(s,(e.get(s)||0)+1);return e},[ae]);const me=T?X:w.length,_=I.useMemo(()=>{if(!T)return w;const e=[];for(let s=0;s<X;s++)e.push(w[s%w.length]);return e},[T,X,w]);function ye(e){return e<=.99?{primary:"rgba(239, 68, 68, 0.9)",secondary:"rgba(220, 38, 38, 0.85)",tertiary:"rgba(185, 28, 28, 0.9)"}:e>=1&&e<=3.99?{primary:"rgba(245, 158, 11, 0.9)",secondary:"rgba(217, 119, 6, 0.85)",tertiary:"rgba(180, 83, 9, 0.9)"}:e>=4&&e<=6.99?{primary:"rgba(34, 197, 94, 0.9)",secondary:"rgba(22, 163, 74, 0.85)",tertiary:"rgba(21, 128, 61, 0.9)"}:{primary:"rgba(59, 130, 246, 0.9)",secondary:"rgba(37, 99, 235, 0.85)",tertiary:"rgba(29, 78, 216, 0.9)"}}const ee=T?Ae:A,R=Qe({rows:ee,multipliers:_,onContact(e){if(e.peg&&e.plinko&&(b.current[e.peg.plugin.pegIndex]=1,d.play("bump",{playbackRate:1+Math.random()*.05})),e.barrier&&e.plinko&&d.play("bump",{playbackRate:.5+Math.random()*.05}),e.bucket&&e.plinko){const s=e.bucket.plugin.bucketIndex;k.current[s]=1,d.play(e.bucket.plugin.bucketMultiplier>=1?"win":"fall"),ne(g=>[...g.slice(-19),s]),re(g=>{const q=new Set(g);return q.add(s),q})}}},[ee,JSON.stringify(_)]),[H,pe]=v.useState([]),[N,de]=v.useState(!1),[ke,F]=v.useState(0),[we,W]=v.useState([]),[z,ve]=v.useState(0),[L,Z]=v.useState("idle");v.useEffect(()=>()=>{H.forEach(e=>{try{e.cleanup()}catch{}})},[H]),v.useEffect(()=>{N||(W(Array.from({length:j},()=>"pending")),F(0),Z("idle"))},[j,N]);const ge=async()=>{if(!R||N)return;de(!0),F(0),Z("loading");const e=[];W(Array.from({length:j},()=>"pending")),F(0);for(let g=0;g<j;g++){await p.play({wager:n,bet:c});const q=await p.result();e.push(q.multiplier)}const s=e.map(()=>new he({rows:ee,multipliers:_,onContact(g){if(g.peg&&g.plinko&&(b.current[g.peg.plugin.pegIndex]=1,d.play("bump",{playbackRate:1+Math.random()*.05})),g.barrier&&g.plinko&&d.play("bump",{playbackRate:.5+Math.random()*.05}),g.bucket&&g.plinko){const q=g.bucket.plugin.bucketIndex;k.current[q]=1,d.play(g.bucket.plugin.bucketMultiplier>=1?"win":"fall"),ne(f=>[...f.slice(-19),q]),re(f=>{const m=new Set(f);return m.add(q),m})}}}));pe(s),Z("launching"),await new Promise(g=>{let q=0;s.forEach((f,m)=>{f.reset();const y=()=>{W(B=>{const x=[...B];return x[m]="animating",x}),Z("playing"),f.run(e[m]);const E=()=>{const B=f&&f.currentPath,x=f&&f.currentFrame;if(!B){q+=1,W(h=>{const P=[...h];return P[m]="done",P}),F(h=>h+1);try{f.cleanup()}catch{}return q>=s.length?g():void 0}const S=B.length/2;if(x>=S){q+=1,W(h=>{const P=[...h];return P[m]="done",P}),F(h=>h+1);try{f.cleanup()}catch{}return q>=s.length?g():void 0}requestAnimationFrame(E)};requestAnimationFrame(E)};z>0?setTimeout(y,m*z):y()})}),pe([]),de(!1),F(0)};return t.jsxs(t.Fragment,{children:[t.jsx(Y.Portal,{target:"recentplays",children:t.jsx(Fe,{gameId:"plinko"})}),t.jsx(Y.Portal,{target:"stats",children:t.jsx(Te,{gameName:"Plinko",gameMode:r?"Degen":"Normal",stats:ce().stats,onReset:ce().resetStats,isMobile:U})}),t.jsx(Y.Portal,{target:"screen",children:t.jsxs(Ue,{children:[t.jsx("style",{children:`
            .plinko-ball-status { width: 18px; height: 18px; border-radius: 50%; display:flex; align-items:center; justify-content:center; color: #000; font-size: 10px; font-weight: 700; }
            .plinko-ball-pulse { animation: plinkoPulse 520ms ease-out; }
            @keyframes plinkoPulse {
              0% { transform: scale(1); box-shadow: 0 0 0 rgba(0,0,0,0); }
              40% { transform: scale(1.35); box-shadow: 0 6px 18px rgba(76,175,80,0.35); }
              100% { transform: scale(1); box-shadow: 0 0 0 rgba(0,0,0,0); }
            }
            .plinko-ball-spinner { width: 12px; height: 12px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.15); border-top-color: rgba(255,255,255,0.6); animation: spin 1s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
          `}),t.jsx("div",{style:{position:"fixed",left:18,top:"70%",transform:"translateY(-50%)",zIndex:800,pointerEvents:"none",maxHeight:"70vh",overflow:"hidden",width:75},children:t.jsxs("div",{style:{width:"100%",display:"flex",flexDirection:"column",gap:10,alignItems:"center",background:"linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.2))",padding:"8px",borderRadius:12,border:"1px solid rgba(255,255,255,0.06)",boxSizing:"border-box",pointerEvents:"auto",maxHeight:"70vh",overflowY:"auto"},children:[Array.from({length:10}).map((e,s)=>{const g=s<j,q=we[s],f=q==="done"?"#4caf50":q==="animating"?"#ffd54f":"#9e9e9e",m=g?1:.32,y=g,E=q==="done"?"plinko-ball-pulse":"";return t.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"center"},children:t.jsx("div",{className:"plinko-ball-status "+E,style:{background:f,opacity:m},title:`Ball ${s+1}: ${g?q||"pending":"placeholder"}`,children:y?q==="pending"?t.jsx("div",{style:{width:10,height:10,borderRadius:6,background:"rgba(255,255,255,0.15)"}}):q==="animating"?t.jsx("div",{className:"plinko-ball-spinner"}):t.jsx("div",{style:{fontSize:10},children:s+1}):null})},s)}),t.jsx("div",{style:{marginTop:6,fontSize:12,color:"rgba(255,255,255,0.8)",fontWeight:700},children:L==="idle"?"Idle":L==="loading"?"Loading...":L==="launching"?"Launching":L==="playing"?"Playing":"Done"})]})}),t.jsx("div",{className:"gravity-bg-elements"}),t.jsx("div",{className:"melody-overlay"}),t.jsx("div",{className:"inevitability-indicator"}),t.jsx(Me,{title:p.game.meta?.name,description:p.game.meta?.description,children:t.jsxs("div",{style:{position:"absolute",inset:0,display:"flex"},children:[t.jsx(Y.Canvas,{style:{flex:1,width:"100%",height:"100%"},render:({ctx:e,size:s})=>{if(!R)return;const g=R.getBodies(),q=s.width/R.width,f=s.height/R.height,m=Math.min(q,f);e.clearRect(0,0,s.width,s.height),e.save(),e.translate(s.width/2-R.width/2*m,s.height/2-R.height/2*m),e.scale(m,m),g.forEach((y,E)=>{const{label:B,position:x}=y;if(B==="Peg"){e.save(),e.translate(x.x,x.y);const S=b.current[y.plugin?.pegIndex]??0;b.current[y.plugin?.pegIndex]&&(b.current[y.plugin?.pegIndex]*=.9);const h=C.enableMotion?S:0;C.enableMotion&&e.scale(1+S*.4,1+S*.4);const P=(x.y+x.x+Date.now()*.05)%360;e.fillStyle="hsla("+P+", 75%, 60%, "+(1+h*2)*.2+")",e.beginPath(),e.arc(0,0,se+4,0,Math.PI*2),e.fill();const G=75+h*25;e.fillStyle="hsla("+P+", 85%, "+G+"%, 1)",e.beginPath(),e.arc(0,0,se,0,Math.PI*2),e.fill(),e.restore();return}if(B==="Plinko"){e.save(),e.translate(x.x,x.y),e.fillStyle="hsla("+E*420%360+", 75%, 90%, .08)",e.beginPath(),e.arc(0,0,le*1.5,0,Math.PI*2),e.fill(),e.restore();return}if(B==="Bucket"){const S=k.current[y.plugin.bucketIndex]??0;k.current[y.plugin.bucketIndex]&&(k.current[y.plugin.bucketIndex]*=.9),e.save(),e.translate(x.x,x.y);const h=y.plugin.bucketMultiplier,G=.8+(C.enableMotion?S:0)*.2,te=ye(h),J=e.createLinearGradient(-25,-M,25,0);J.addColorStop(0,te.primary.replace("0.9)",`${G})`)),J.addColorStop(.5,te.secondary.replace("0.85)",`${G*.9})`)),J.addColorStop(1,te.tertiary.replace("0.9)",`${G})`)),e.save(),e.translate(0,M/2),e.scale(1,1+S*2),e.fillStyle=J,e.fillRect(-25,-M,50,M),e.strokeStyle=`rgba(255, 255, 255, ${.6+S*.4})`,e.lineWidth=2,e.strokeRect(-25,-M,50,M),e.restore(),e.font="bold 18px Arial",e.textAlign="center",e.lineWidth=3,e.lineJoin="round",e.strokeStyle="rgba(0, 0, 0, 0.8)",e.strokeText("x"+h,0,0),e.fillStyle=`rgba(255, 255, 255, ${.95+S*.05})`,e.fillText("x"+h,0,0),e.restore()}B==="Barrier"&&(e.save(),e.translate(x.x,x.y),e.fillStyle="#cccccc22",e.fillRect(-$/2,-V/2,$,V),e.restore())}),H&&H.length&&H.forEach((y,E)=>{try{y.getBodies().forEach((x,S)=>{if(x.label!=="Plinko")return;const h=x.position;e.save(),e.translate(h.x,h.y);const P=(E*97+S*137)%360;e.fillStyle="hsla("+P+", 75%, 70%, 1)",e.beginPath(),e.arc(0,0,le,0,Math.PI*2),e.fill(),e.restore()})}catch{}}),e.restore()}}),fe]})}),ue&&t.jsx("div",{style:{position:"absolute",top:0,left:0,right:0,bottom:0,background:"rgba(0, 0, 0, 0.85)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1e3,padding:"20px"},children:t.jsxs("div",{style:{background:"linear-gradient(135deg, rgba(24, 24, 24, 0.98) 0%, rgba(32, 32, 40, 0.95) 100%)",borderRadius:"16px",border:"2px solid rgba(156, 39, 176, 0.4)",boxShadow:"0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)",padding:"24px",width:"95vw",maxWidth:"900px",position:"relative"},children:[t.jsx("style",{children:"@keyframes settingsEnter { from { transform: translateY(8px) scale(.995); opacity: 0 } to { transform: translateY(0) scale(1); opacity: 1 } }"}),t.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"12px",paddingBottom:"8px",borderBottom:"1px solid rgba(156, 39, 176, 0.08)"},children:[t.jsxs("div",{children:[t.jsx("h2",{style:{margin:0,fontSize:"24px",fontWeight:"bold",background:"linear-gradient(90deg, #9c27b0, #e91e63)",WebkitBackgroundClip:"text",backgroundClip:"text",color:"transparent"},children:"Plinko Settings"}),t.jsx("p",{style:{margin:"6px 0 0 0",color:"rgba(255,255,255,0.75)",fontSize:13},children:"Mode and Start Stagger live in Settings"})]}),t.jsx("button",{onClick:()=>O(!1),style:{background:"rgba(255, 255, 255, 0.1)",border:"1px solid rgba(255, 255, 255, 0.2)",borderRadius:"50%",width:"40px",height:"40px",color:"#fff",cursor:"pointer",fontSize:"18px",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s ease"},children:"✕"})]}),t.jsxs("div",{style:{display:"flex",gap:"18px",alignItems:"flex-start",animation:"settingsEnter 220ms cubic-bezier(.2,.9,.2,1)"},children:[t.jsxs("div",{style:{flex:1,minHeight:"140px",display:"flex",flexDirection:"column",justifyContent:"center",background:"rgba(156, 39, 176, 0.04)",borderRadius:"12px",padding:"16px",border:"1px solid rgba(156, 39, 176, 0.12)"},children:[t.jsx("div",{style:{fontSize:"16px",fontWeight:"bold",color:"#9c27b0",marginBottom:"12px"},children:"GAME MODE"}),t.jsx("p",{style:{fontSize:"12px",color:"rgba(255,255,255,0.75)",margin:"0 0 12px 0"},children:"Choose Normal or Degen mode for different bucket layouts."}),t.jsxs("div",{style:{display:"flex",gap:8},children:[t.jsx("button",{onClick:()=>{K(!1),o(!1)},disabled:i.isPlaying,style:{flex:1,padding:"8px 12px",borderRadius:10,border:"none",background:r?"rgba(255,255,255,0.03)":"linear-gradient(135deg, #4caf50, #45a049)",color:r?"rgba(255,255,255,0.8)":"#fff",fontWeight:700},children:"Normal"}),t.jsx("button",{onClick:()=>{K(!1),o(!0)},disabled:i.isPlaying,style:{flex:1,padding:"8px 12px",borderRadius:10,border:"none",background:r?"linear-gradient(135deg, #ff9800, #f57c00)":"rgba(255,255,255,0.03)",color:r?"#fff":"rgba(255,255,255,0.8)",fontWeight:700},children:"Degen"})]})]}),t.jsxs("div",{style:{flex:1,minHeight:"140px",display:"flex",flexDirection:"column",justifyContent:"center",background:"rgba(0, 188, 212, 0.04)",borderRadius:"12px",padding:"16px",border:"1px solid rgba(0, 188, 212, 0.08)"},children:[t.jsx("div",{style:{fontSize:"16px",fontWeight:"bold",color:"#00bcd4",marginBottom:"12px"},children:"START STAGGER (ms)"}),t.jsx("p",{style:{fontSize:"12px",color:"rgba(255,255,255,0.75)",margin:"0 0 12px 0"},children:"Time (in MS) between visual starts when playing multiple balls."}),t.jsx("div",{style:{display:"flex",gap:8,alignItems:"center"},children:[0,50,100,200,400].map(e=>t.jsx("button",{onClick:()=>ve(e),disabled:i.isPlaying||N,style:{flex:1,padding:"8px 10px",borderRadius:8,border:z===e?"2px solid rgba(0,0,0,0.6)":"1px solid rgba(255,255,255,0.04)",background:z===e?"rgba(255,255,255,0.06)":"transparent",color:z===e?"#fff":"rgba(255,255,255,0.8)",fontWeight:700},children:e===0?"0 (sim)":`${e} ms`},e))})]})]}),t.jsxs("div",{style:{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap",marginTop:12,color:"rgba(255,255,255,0.9)",fontSize:13},children:[t.jsxs("div",{children:["🎯 ",t.jsx("strong",{children:T?"Custom":r?"Degen":"Normal"})," Mode"]}),t.jsxs("div",{children:["📏 ",t.jsx("strong",{children:A})," Rows"]}),t.jsxs("div",{children:["🪣 ",t.jsx("strong",{children:me})," Buckets"]}),t.jsxs("div",{children:["⚡ ",t.jsx("strong",{children:j})," Ball",j>1?"s":""]}),t.jsxs("div",{children:["💰 Max: ",t.jsxs("strong",{children:[Math.max(...c).toFixed(2),"x"]})]})]}),t.jsxs("div",{style:{textAlign:"center",paddingTop:"clamp(12px, 2vw, 16px)",borderTop:"1px solid rgba(255, 255, 255, 0.06)",color:"rgba(255, 255, 255, 0.5)",fontSize:"clamp(10px, 2vw, 12px)",marginTop:"clamp(12px, 2vw, 16px)"},children:["💡 ",T?"Experiment with different combinations to find your perfect risk/reward balance":"Use the controls above to quickly switch modes and ball counts"]})]})})]})}),t.jsxs(Y.Portal,{target:"controls",children:[t.jsx(Re,{wager:n,setWager:l,onPlay:()=>ge(),playDisabled:i.isPlaying||oe,playText:"Play",children:t.jsxs("div",{style:{background:"linear-gradient(135deg, rgba(10, 5, 17, 0.85) 0%, rgba(139, 90, 158, 0.1) 50%, rgba(10, 5, 17, 0.85) 100%)",border:"1px solid rgba(212, 165, 116, 0.4)",borderRadius:"16px",padding:"14px",boxShadow:"inset 0 2px 8px rgba(10, 5, 17, 0.4), 0 4px 16px rgba(212, 165, 116, 0.1), 0 0 0 1px rgba(212, 165, 116, 0.15)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",gap:"12px",width:U?"100%":"fit-content",maxWidth:"100%"},children:[t.jsx("select",{value:j,onChange:e=>ie(Number(e.target.value)),disabled:i.isPlaying,style:{background:"transparent",border:"none",color:"rgba(212, 165, 116, 0.9)",fontSize:"12px",fontWeight:"bold",cursor:i.isPlaying?"not-allowed":"pointer",opacity:i.isPlaying?.5:1,outline:"none",fontFamily:"Libre Baskerville, serif"},children:[1,3,5,10].map(e=>t.jsxs("option",{value:e,style:{background:"#1a1a1a",color:"#ff5722"},children:[e," Ball",e>1?"s":""]},e))}),N&&t.jsxs("div",{style:{color:"rgba(255,255,255,0.9)",fontSize:"12px",fontWeight:"bold"},children:["Animating ",ke,"/",j]}),t.jsxs("button",{onClick:()=>{K(!0),O(!0)},disabled:i.isPlaying,style:{marginLeft:8,background:"transparent",border:"1px solid rgba(255,255,255,0.04)",color:"rgba(212, 165, 116, 0.95)",fontSize:"12px",padding:"6px 10px",borderRadius:8,cursor:i.isPlaying?"not-allowed":"pointer",opacity:i.isPlaying?.5:1,display:"flex",alignItems:"center",gap:8},title:"Game Mode & Start Stagger live in Settings",children:[t.jsx("strong",{style:{color:"inherit"},children:r?"Degen":"Normal"}),t.jsx("span",{style:{opacity:.6},children:"•"}),t.jsxs("span",{style:{fontSize:12},children:[z,"ms"]})]})]})}),t.jsxs(ze,{onPlay:()=>ge(),playDisabled:i.isPlaying||oe,playText:"Play",children:[t.jsx(De,{value:n,onChange:l}),t.jsxs("div",{style:{background:"linear-gradient(135deg, rgba(10, 5, 17, 0.85) 0%, rgba(139, 90, 158, 0.1) 50%, rgba(10, 5, 17, 0.85) 100%)",border:"1px solid rgba(212, 165, 116, 0.4)",borderRadius:"16px",padding:"14px",boxShadow:"inset 0 2px 8px rgba(10, 5, 17, 0.4), 0 4px 16px rgba(212, 165, 116, 0.1), 0 0 0 1px rgba(212, 165, 116, 0.15)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",gap:"12px",width:"fit-content"},children:[t.jsx("select",{value:j,onChange:e=>ie(Number(e.target.value)),disabled:i.isPlaying,style:{background:"transparent",border:"none",color:"rgba(212, 165, 116, 0.9)",fontSize:"12px",fontWeight:"bold",cursor:i.isPlaying?"not-allowed":"pointer",opacity:i.isPlaying?.5:1,outline:"none",fontFamily:"Libre Baskerville, serif"},children:[1,3,5,10].map(e=>t.jsxs("option",{value:e,style:{background:"#1a1a1a",color:"#ff5722"},children:[e," Ball",e>1?"s":""]},e))}),t.jsxs("button",{onClick:()=>{K(!0),O(!0)},disabled:i.isPlaying,style:{marginLeft:8,background:"transparent",border:"1px solid rgba(255,255,255,0.04)",color:"rgba(212, 165, 116, 0.95)",fontSize:"12px",padding:"6px 10px",borderRadius:8,cursor:i.isPlaying?"not-allowed":"pointer",opacity:i.isPlaying?.5:1,display:"flex",alignItems:"center",gap:8},title:"Game Mode & Start Stagger live in Settings",children:[t.jsx("strong",{style:{color:"inherit"},children:r?"Degen":"Normal"}),t.jsx("span",{style:{opacity:.6},children:"•"}),t.jsxs("span",{style:{fontSize:12},children:[z,"ms"]})]})]})]})]})]})}export{lt as default};
