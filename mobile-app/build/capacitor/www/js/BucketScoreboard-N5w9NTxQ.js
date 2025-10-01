var _=Object.defineProperty;var N=(r,t,i)=>t in r?_(r,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):r[t]=i;var c=(r,t,i)=>N(r,typeof t!="symbol"?t+"":t,i);import{d as f,bn as W}from"./index-BarUt2o_.js";import{M as e}from"./matter-BpV9e9-B.js";import{R as E,r as I,j as u}from"./three-DV31HySq.js";const te=f.div`
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
`,L=700,T=700,G=50,R=9,O=11,M=.4,F=1,w=10,$=60,D=$,j=$*1.2,H=4;class ie{constructor(t){c(this,"width",L);c(this,"height",T);c(this,"engine",e.Engine.create({gravity:{y:F},timing:{timeScale:1}}));c(this,"runner",e.Runner.create({isFixed:!0}));c(this,"props");c(this,"ballComposite",e.Composite.create());c(this,"bucketComposite",e.Composite.create());c(this,"startPositions");c(this,"animationId",null);c(this,"visualizePath",!1);c(this,"activeBalls",[]);c(this,"makePlinko",(t,i)=>e.Bodies.circle(this.width/2+t,-10,R,{restitution:M,collisionFilter:{group:-6969},label:"Plinko",plugin:{startPositionIndex:i}}));c(this,"collisionHandler",t=>{const i={};for(const a of t.pairs){const n=(l,s)=>{a.bodyA.label===s&&(i[l]=a.bodyA),a.bodyB.label===s&&(i[l]=a.bodyB)};n("peg","Peg"),n("barrier","Barrier"),n("bucket","Bucket"),n("plinko","Plinko")}this.props.onContact(i)});this.props=t,this.startPositions=Array.from({length:G}).map(()=>e.Common.random(-w/2,w/2));const i=this.buildPegs();e.Composite.add(this.bucketComposite,this.makeBuckets()),e.Composite.add(this.engine.world,[...i,this.ballComposite,this.bucketComposite])}setVisualizePath(t){this.visualizePath=t}buildPegs(){const t=this.height/(this.props.rows+2);return Array.from({length:this.props.rows}).flatMap((a,n,l)=>{const s=n+1,g=this.width*n/(l.length-1),b=s===1?0:g/(s-1);return Array.from({length:s}).map((k,p)=>{const o=this.width/2-g/2+b*p,h=t*n+t/2;return e.Bodies.circle(o,h,O,{isStatic:!0,label:"Peg",plugin:{pegIndex:n*s+p}})})}).slice(1)}makeBuckets(){const t=this.props.buckets,i=this.width/t,a=Array.from({length:t+1}).map((l,s)=>e.Bodies.rectangle(s*i,this.height-j/2,H,j,{isStatic:!0,label:"Barrier",chamfer:{radius:2}}));return[...Array.from({length:t}).map((l,s)=>e.Bodies.rectangle(s*i+i/2,this.height-D/2,i-H,D,{isStatic:!0,isSensor:!0,label:"Bucket",plugin:{bucketIndex:s,bucketMultiplier:this.props.multipliers[s]||0}})),...a]}getBodies(){return e.Composite.allBodies(this.engine.world)}single(){e.Events.off(this.engine,"collisionStart",this.collisionHandler),e.Runner.stop(this.runner),e.Events.on(this.engine,"collisionStart",this.collisionHandler),e.Composite.add(this.ballComposite,this.makePlinko(e.Common.random(-w,w),0)),e.Runner.run(this.runner,this.engine)}cleanup(){e.World.clear(this.engine.world,!1),e.Engine.clear(this.engine),this.animationId!==null&&cancelAnimationFrame(this.animationId),this.animationId=null,this.activeBalls=[]}reset(){e.Runner.stop(this.runner),e.Composite.clear(this.ballComposite,!1),this.activeBalls=[]}simulate(t){const i=e.Engine.create({gravity:{y:F},timing:{timeScale:1}}),a=e.Runner.create({isFixed:!0}),n=e.Composite.create(),l=e.Composite.create(),s=this.buildPegs();e.Composite.add(l,this.makeBuckets()),e.Composite.add(i.world,[...s,n,l]);const g=(d,x)=>e.Bodies.circle(this.width/2+d,-10,R,{restitution:M,collisionFilter:{group:-6969},label:"Plinko",plugin:{startPositionIndex:x}});e.Composite.add(n,this.startPositions.map(g));const b=this.startPositions.map(()=>[]),k=[];let p=null,o=0;const h=(d,x,m,v)=>{for(const P of d.pairs){const B={},C=(z,A)=>{P.bodyA.label===A&&(B[z]=P.bodyA),P.bodyB.label===A&&(B[z]=P.bodyB)};C("peg","Peg"),C("barrier","Barrier"),C("bucket","Bucket"),C("plinko","Plinko"),B.plinko&&v===void 0&&m.push({frame:x,event:B})}},y=d=>{h(d,o,k);for(const x of d.pairs){const m=x.bodyA,v=x.bodyB;if(m.label==="Plinko"&&v.label==="Bucket"&&v.plugin.bucketIndex===t||v.label==="Plinko"&&m.label==="Bucket"&&m.plugin.bucketIndex===t){p=(m.label==="Plinko"?m:v).plugin.startPositionIndex;break}}};for(e.Events.on(i,"collisionStart",y),o=0;o<1e3;o++){e.Runner.tick(a,i,1);for(const d of n.bodies)if(d.label==="Plinko"){const x=d.plugin.startPositionIndex;b[x].push(d.position.x,d.position.y)}if(p!==null&&n.bodies.find(x=>x.plugin.startPositionIndex===p).position.y>this.height){o++;break}}if(e.Events.off(i,"collisionStart",y),p===null)return e.Engine.clear(i),null;const S=new Float32Array(b[p]),Y=k.filter(d=>d.event.plinko?.plugin.startPositionIndex===p);return e.Engine.clear(i),{bucketIndex:t,plinkoIndex:p,path:S,collisions:Y}}run(t){const i=e.Common.choose(this.bucketComposite.bodies.filter(l=>l.label==="Bucket"&&l.plugin.bucketMultiplier===t));if(!i)throw new Error("No bucket matches desired multiplier");const a=this.simulate(i.plugin.bucketIndex);if(!a)throw new Error("Failed to simulate desired outcome");this.visualizePath&&console.log("Simulation frames:",a.path.length/2);const n=this.makePlinko(this.startPositions[a.plinkoIndex],a.plinkoIndex);e.Composite.add(this.ballComposite,n),this.activeBalls.push({path:a.path,frame:0,collisions:a.collisions,ball:n,done:!1}),this.startReplayAnimation()}startReplayAnimation(){if(this.animationId!==null)return;const t=()=>{if(this.activeBalls.length===0){this.animationId=null;return}for(const a of this.activeBalls){if(a.done)continue;const n=a.path.length/2;if(a.frame>=n){a.done=!0;continue}const l=a.path[a.frame*2],s=a.path[a.frame*2+1];e.Body.setPosition(a.ball,{x:l,y:s}),a.collisions.filter(g=>g.frame===a.frame).forEach(({event:g})=>{const b={...g,plinko:a.ball};this.props.onContact(b)}),a.frame++}const i=[];for(const a of this.activeBalls)a.done?e.Composite.remove(this.ballComposite,a.ball):i.push(a);this.activeBalls=i,this.animationId=requestAnimationFrame(t)};this.animationId=requestAnimationFrame(t)}runAll(){if(e.Events.off(this.engine,"collisionStart",this.collisionHandler),e.Runner.stop(this.runner),e.Composite.clear(this.ballComposite,!1),e.Events.on(this.engine,"collisionStart",this.collisionHandler),this.props.enableMotion===!1){console.log("🎮 STATIC MODE: Ball will teleport to final position instantly");const t=this.makePlinko(e.Common.random(-w,w),0);e.Composite.add(this.ballComposite,t);let i=0;const a=1e3;for(;this.activeBalls.length===0&&i<a;)e.Engine.update(this.engine,16),i++;if(this.activeBalls.length>0){const n=this.activeBalls[0];for(;!n.done&&i<a*2;)if(e.Engine.update(this.engine,16),i++,t.position.y>T-100&&Math.abs(t.velocity.x)<.1&&Math.abs(t.velocity.y)<.1){n.done=!0;break}}return}e.Composite.add(this.ballComposite,this.startPositions.map(this.makePlinko)),e.Runner.run(this.runner,this.engine)}}const U=f.div`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1000;
  pointer-events: none;
  height: 320px; /* Fixed height for 6 tiles + title on desktop */
  overflow: hidden;
  
  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    right: 5px;
    top: 20px;
    transform: none;
    height: 200px; /* Fixed height for 4 tiles + title on mobile */
    gap: 4px;
  }
  
  /* Hide on very small screens */
  @media (max-width: 480px) {
    display: none;
  }
`,X=f.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  position: relative;
  
  @media (max-width: 768px) {
    gap: 4px;
  }
`,q=f.div`
  position: absolute;
  width: 100%;
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: translateY(${({position:r,isMobile:t})=>r*(t?40:48)}px);
  
  ${({isTransitioning:r})=>r&&`
    z-index: 10;
  `}
`,V=f.div`
  position: relative;
  width: 60px;
  height: 40px;
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
    width: 50px;
    height: 32px;
    font-size: 12px;
    border-radius: 6px;
  }
  
  ${({multiplier:r,isPlaceholder:t})=>{if(t)return`
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
      `;const i=W(r);return`
      /* Enhanced 3D gradient backgrounds like Mines */
      background: linear-gradient(135deg, 
        ${i.primary}, 
        ${i.secondary} 50%, 
        ${i.tertiary}
      );
      
      /* Multiple shadow layers for 3D depth */
      box-shadow: 
        0 6px 12px rgba(5, 5, 15, 0.4),
        0 4px 8px rgba(8, 8, 20, 0.3),
        0 2px 4px rgba(15, 15, 30, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
        
      /* Enhanced 3D border effects */
      border: 3px solid ${i.primary.replace("0.9)","0.8)")};
    `}}
  
  ${({isActive:r})=>r&&`
    /* Enhanced 3D active state with glow effects */
    transform: scale(1.15);
    border-color: rgba(255, 255, 0, 0.8);
    box-shadow: 
      0 8px 20px rgba(255, 215, 0, 0.6),
      0 6px 12px rgba(5, 5, 15, 0.4),
      0 4px 8px rgba(8, 8, 20, 0.3),
      0 2px 4px rgba(15, 15, 30, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    animation: bucketPulse 0.6s ease-out;
    
    @media (max-width: 768px) {
      transform: scale(1.1);
    }
  `}
  
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
  
  ${({isActive:r})=>r&&`
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
`;f.div`
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
    width: 16px;
    height: 16px;
    font-size: 8px;
    top: -6px;
    left: -6px;
  }
`;const K=f.div`
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
`,ae=({multipliers:r,activeBuckets:t=new Set,bucketHits:i=new Map,recentHits:a=[]})=>{const[n,l]=E.useState(!1),[s,g]=E.useState([]),[b,k]=E.useState(!1);I.useEffect(()=>{const o=()=>l(window.innerWidth<=768);return o(),window.addEventListener("resize",o),()=>window.removeEventListener("resize",o)},[]);const p=n?4:6;return I.useEffect(()=>{const o=Array.from({length:p},(h,y)=>({bucketIndex:-1,isPlaceholder:!0,id:`placeholder-${y}-${p}`}));g(o)},[p]),I.useEffect(()=>{if(a.length===0)return;const o=a[a.length-1];k(!0);const h={bucketIndex:o,isPlaceholder:!1,id:`bucket-${o}-${Date.now()}`};g(y=>[...y.slice(1),h]),setTimeout(()=>k(!1),500)},[a]),u.jsxs(U,{children:[u.jsx(K,{children:"RECENT HITS"}),u.jsx(X,{children:s.map((o,h)=>u.jsx(q,{position:h,isTransitioning:b,isMobile:n,children:u.jsxs(V,{multiplier:o.isPlaceholder?0:r[o.bucketIndex]||0,isActive:!o.isPlaceholder&&t.has(o.bucketIndex),index:o.bucketIndex,isPlaceholder:o.isPlaceholder,children:[!o.isPlaceholder&&u.jsxs(u.Fragment,{children:[(r[o.bucketIndex]||0).toFixed(2),"×"]}),o.isPlaceholder&&u.jsx("div",{style:{opacity:.4,fontSize:"12px",color:"rgba(255, 255, 255, 0.5)"},children:"--"})]})},o.id))})]})};export{ae as B,ie as P,te as S,H as a,D as b,j as c};
