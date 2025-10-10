import{R as f,j as t}from"./three-D4AtYCWe.js";import{d as n,m as B,aw as T,G as x,ax as D}from"./index-Dyfdn2uN.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-DLMfKFaI.js";const y="/assets/rocket-ujzbJpOu.gif",F=n.div`
  position: relative;
  width: 100%;
  padding: 10px 0;
`,O=n.input.attrs({type:"range"})`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-image: url(${y});
    background-size: 100% 100%;
    cursor: pointer;
  }

  /* The slider handle (thumb) for Firefox */
  &::-moz-range-thumb {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-image: url(${y});
    background-size: 100% 100%;
    cursor: pointer;
  }
`;function P({value:a,onChange:i}){const e=f.useMemo(()=>Array.from({length:101}).map((h,l)=>l<=50?Math.round((1+9*(l/50))*4)/4:Math.round(10+90*((l-50)/50))),[]),c=h=>{i(e[Number(h.target.value)])},o=e.indexOf(a);return t.jsxs(F,{children:[t.jsxs("div",{style:{bottom:"30px",left:"50%"},children:[a.toFixed(2),"x"]}),t.jsx(O,{type:"range",min:"0",max:"100",value:o,onChange:c})]})}const U="/assets/crash-Cc6USioj.mp3",W="/assets/music-D1GRmmgR.mp3",w=a=>{const i=window.innerWidth,e=4e3;let c=`${Math.random()*i}px ${Math.random()*e}px #ffffff`;for(let o=2;o<=a;o++)c+=`, ${Math.random()*i}px ${Math.random()*e}px #ffffff`;return c},M=w(700),k=w(200),$=w(100),G=B`
  from {
    transform: translateY(-100vh);
  }
  to {
    transform: translateY(0);
  }
`,m=n.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  animation: ${G} linear infinite;
`,I=n(m)`
  width: 1px;
  height: 1px;
  animation-duration: 150s;
  opacity: 1;
  transition: opacity 12s;
  box-shadow: ${M};
`,N=n(m)`
  width: 1px;
  height: 12px;
  top: -12px;
  animation-duration: 75s;
  opacity: 0;
  transition: opacity 2s;
  box-shadow: ${M};
`,E=n(m)`
  width: 2px;
  height: 2px;
  animation-duration: 100s;
  box-shadow: ${k};
`,V=n(m)`
  width: 2px;
  height: 25px;
  top: -25px;
  animation-duration: 6s;
  opacity: 0;
  transition: opacity 1s;
  box-shadow: ${k};
`,Y=n(m)`
  width: 3px;
  height: 3px;
  animation-duration: 50s;
  box-shadow: ${$};
`,_=n(m)`
  width: 2px;
  height: 50px;
  top: -50px;
  animation-duration: 3s;
  opacity: 0;
  transition: opacity 1s;
  box-shadow: ${$};
`,H=n.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
`,J=n.div`
  font-size: 48px;
  color: ${a=>a.color||"#fff"}; // Use color prop or default to white
  text-shadow: 0 0 20px #fff;
  z-index: 1;
  font-family: monospace;
`,X=n.div`
  position: absolute;
  width: 120px;
  aspect-ratio: 1 / 1;
  background-image: url(${y});
  background-size: contain;
  background-repeat: no-repeat;
  transition: all 0.1s ease-out;
`,q=a=>{const i=Math.round(a%1*100)/100,e=(()=>{switch(i){case .25:return 4;case .5:return 2;case .75:return 4;default:return 1}})(),c=a*e,o=Array.from({length:e}).map(()=>a),l=Math.ceil(c)-e;return o.concat(Array.from({length:l}).map(()=>0))},K="/assets/win-BA92bcBv.mp3";function st(){const[a,i]=T(),[e,c]=f.useState(1.5),[o,h]=f.useState(0),[l,b]=f.useState("idle"),S=x.useGame(),g=D({music:W,crash:U,win:K}),v=()=>{const s=Math.min(o/1,1),r=20,d=30,u=s*(100-r),A=Math.pow(s,5)*(100-d),z=(1-Math.pow(s,2.3))*90;return{bottom:`${A}%`,left:`${u}%`,transform:`rotate(${z}deg)`}},j=(p,s,r)=>{const d=.01*(Math.floor(p)+1),u=p+d;if(h(u),u>=s){g.sounds.music.player.stop(),g.play(r?"win":"crash"),b(r?"win":"crash"),h(s);return}setTimeout(()=>j(u,s,r),50)},R=l==="crash"?"#ff0000":l==="win"?"#00ff00":"#ffffff",C=p=>{const s=Math.random(),r=Math.min(p,12),d=s>.95?2.8:p>10?5:6,u=1+Math.pow(s,d)*(r-1);return parseFloat(u.toFixed(2))},L=async()=>{b("idle");const p=q(e);await S.play({wager:a,bet:p});const r=(await S.result()).payout>0,d=r?e:C(e);console.log("multiplierResult",d),console.log("win",r),g.play("music"),j(0,d,r)};return t.jsxs(t.Fragment,{children:[t.jsx(x.Portal,{target:"screen",children:t.jsxs(H,{children:[t.jsx(I,{style:{opacity:o>3?0:1}}),t.jsx(N,{style:{opacity:o>3?1:0}}),t.jsx(E,{style:{opacity:o>2?0:1}}),t.jsx(V,{style:{opacity:o>2?1:0}}),t.jsx(Y,{style:{opacity:o>1?0:1}}),t.jsx(_,{style:{opacity:o>1?1:0}}),t.jsxs(J,{color:R,children:[o.toFixed(2),"x"]}),t.jsx(X,{style:v()})]})}),t.jsxs(x.Portal,{target:"controls",children:[t.jsx(x.WagerInput,{value:a,onChange:i}),t.jsx(P,{value:e,onChange:c}),t.jsx(x.PlayButton,{onClick:L,children:"Play"})]})]})}export{st as default};
