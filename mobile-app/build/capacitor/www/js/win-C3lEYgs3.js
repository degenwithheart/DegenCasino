import{d as o,be as a,m as p}from"./index-BarUt2o_.js";import{m as x}from"./deterministicRng-BQgZTO1k.js";const y="/assets/lose-Cc6USioj.mp3",M="/assets/music-D1GRmmgR.mp3",b="/assets/rocket-Dh_UFmB3.webp",e=(t,m)=>{const s=typeof window<"u"?window.innerWidth:1920,r=4e3,n=x(m);let l=`${(n()*s).toFixed(2)}px ${(n()*r).toFixed(2)}px #ffffff`;for(let c=2;c<=t;c++)l+=`, ${(n()*s).toFixed(2)}px ${(n()*r).toFixed(2)}px #ffffff`;return l},d=e(700,"crash:small"),f=e(200,"crash:medium"),h=e(100,"crash:big"),w=p`
  from {
    transform: translateY(-100vh);
  }
  to {
    transform: translateY(0);
  }
`,i=o.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  ${t=>t.enableMotion!==!1&&a`
    animation: ${w} linear infinite;
  `}
`,S=o(i)`
  width: 1px;
  height: 1px;
  ${t=>t.enableMotion!==!1&&a`
    animation-duration: 150s;
  `}
  opacity: 1;
  transition: ${t=>t.enableMotion!==!1?"opacity 12s":"none"};
  box-shadow: ${d};
`,v=o(i)`
  width: 1px;
  height: 12px;
  top: -12px;
  ${t=>t.enableMotion!==!1&&a`
    animation-duration: 75s;
  `}
  opacity: 0;
  transition: ${t=>t.enableMotion!==!1?"opacity 2s":"none"};
  box-shadow: ${d};
`,L=o(i)`
  width: 2px;
  height: 2px;
  ${t=>t.enableMotion!==!1&&a`
    animation-duration: 100s;
  `}
  box-shadow: ${f};
`,k=o(i)`
  width: 2px;
  height: 25px;
  top: -25px;
  ${t=>t.enableMotion!==!1&&a`
    animation-duration: 6s;
  `}
  opacity: 0;
  transition: ${t=>t.enableMotion!==!1?"opacity 1s":"none"};
  box-shadow: ${f};
`,R=o(i)`
  width: 3px;
  height: 3px;
  ${t=>t.enableMotion!==!1&&a`
    animation-duration: 50s;
  `}
  box-shadow: ${h};
`,B=o(i)`
  width: 2px;
  height: 50px;
  top: -50px;
  ${t=>t.enableMotion!==!1&&a`
    animation-duration: 3s;
  `}
  opacity: 0;
  transition: ${t=>t.enableMotion!==!1?"opacity 1s":"none"};
  box-shadow: ${h};
`,D=o.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
`,F=o.div`
  font-size: 48px;
  color: ${t=>t.color||"#fff"}; // Use color prop or default to white
  text-shadow: 0 0 20px #fff;
  z-index: 1;
  font-family: monospace;
`,U=o.div`
  position: absolute;
  width: 120px;
  aspect-ratio: 1 / 1;
  background-image: url(${b});
  background-size: contain;
  background-repeat: no-repeat;
  transition: all 0.1s ease-out;
  
  ${t=>t.isExploding&&a`
    animation: ${$} 0.3s ease-out forwards;
    --initial-rotation: ${t.initialRotation||0}deg;
  `}
`,$=p`
  0% {
    transform: rotate(var(--initial-rotation)) scale(1);
    opacity: 1;
  }
  20% {
    transform: rotate(var(--initial-rotation)) scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: rotate(var(--initial-rotation)) scale(0.8);
    opacity: 0;
  }
`,A="/assets/win-BA92bcBv.mp3";export{y as C,v as L,F as M,U as R,M as S,A as W,D as a,S as b,L as c,k as d,R as e,B as f};
