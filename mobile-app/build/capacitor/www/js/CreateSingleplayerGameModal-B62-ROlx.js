import{r as n,j as e}from"./three-DV31HySq.js";import{d as t,as as h,be as u,m as W}from"./index-BarUt2o_.js";import{A as M}from"./index-CSHl0t8b.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-Bm3pLP40.js";const A=W`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.2);
  }
`,G=t(h.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`,z=t(h.div)`
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.9) 0%, rgba(0, 0, 0, 0.95) 100%);
  border: 2px solid rgba(255, 215, 0, 0.5);
  border-radius: 16px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  color: white;
  position: relative;
`,B=t.h2`
  text-align: center;
  margin-bottom: 25px;
  color: #ffd700;
  font-size: 1.5rem;
`,F=t.p`
  text-align: center;
  margin-bottom: 20px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
`,a=t.div`
  margin-bottom: 20px;
`,s=t.label`
  display: block;
  margin-bottom: 5px;
  color: #ffd700;
  font-weight: bold;
`,d=t.input`
  width: 100%;
  padding: 10px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #ffd700;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`,L=t.select`
  width: 100%;
  padding: 10px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #ffd700;
  }
  
  option {
    background: #000;
    color: white;
  }
`,P=t.input`
  margin-right: 8px;
  transform: scale(1.2);
`,R=t.label`
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  
  &:hover {
    color: #ffd700;
  }
`,I=t.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 25px;
`,m=t.button.withConfig({shouldForwardProp:r=>!["variant"].includes(r)})`
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${r=>r.variant==="primary"?u`
    background: linear-gradient(45deg, #ff6b6b, #ffd700);
    color: white;
    animation: ${A} 3s ease-in-out infinite;
    
    &:hover {
      transform: scale(1.05);
    }
  `:u`
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 2px solid rgba(255, 255, 255, 0.3);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    animation: none;
  }
`,N=t.button`
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`,O=t.div`
  display: flex;
  align-items: center;
  gap: 10px;
`,D=t.input`
  flex: 1;
`,T=t.span`
  min-width: 30px;
  color: #ffd700;
  font-weight: bold;
`;function K({onClose:r,onConfigureGame:b}){const[i,f]=n.useState("fixed"),[c,j]=n.useState(1e6),[p,y]=n.useState(5e5),[g,v]=n.useState(2e6),[l,w]=n.useState(30),[x,S]=n.useState(!0),[k,E]=n.useState(!0),C=()=>{b({wagerMode:i,fixedWager:c,minWager:i==="random"?p:void 0,maxWager:i==="random"?g:void 0,gameDuration:l,autoStart:x,showBotActions:k}),r()};return e.jsx(M,{children:e.jsx(G,{initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:o=>o.target===o.currentTarget&&r(),children:e.jsxs(z,{initial:{scale:.8,opacity:0},animate:{scale:1,opacity:1},exit:{scale:.8,opacity:0},transition:{type:"spring",stiffness:300,damping:25},children:[e.jsx(N,{onClick:r,children:"×"}),e.jsx(B,{children:"🎰 Singleplayer Game Setup"}),e.jsx(F,{children:"Configure your singleplayer roulette game. You'll play against the house with 3 AI opponents at your table!"}),e.jsxs(a,{children:[e.jsx(s,{children:"Wager Mode"}),e.jsxs(L,{value:i,onChange:o=>f(o.target.value),children:[e.jsx("option",{value:"fixed",children:"Fixed Wager (All players bet same amount)"}),e.jsx("option",{value:"random",children:"Random Wagers (Players bet different amounts)"})]})]}),i==="fixed"?e.jsxs(a,{children:[e.jsx(s,{children:"Fixed Wager Amount (SOL)"}),e.jsx(d,{type:"number",value:c/1e9,onChange:o=>j(Number(o.target.value)*1e9),step:"0.001",min:"0.001",placeholder:"1.0"})]}):e.jsxs(e.Fragment,{children:[e.jsxs(a,{children:[e.jsx(s,{children:"Minimum Wager (SOL)"}),e.jsx(d,{type:"number",value:p/1e9,onChange:o=>y(Number(o.target.value)*1e9),step:"0.001",min:"0.001",placeholder:"0.5"})]}),e.jsxs(a,{children:[e.jsx(s,{children:"Maximum Wager (SOL)"}),e.jsx(d,{type:"number",value:g/1e9,onChange:o=>v(Number(o.target.value)*1e9),step:"0.001",min:"0.001",placeholder:"2.0"})]})]}),e.jsxs(a,{children:[e.jsx(s,{children:"Betting Phase Duration (seconds)"}),e.jsxs(O,{children:[e.jsx(D,{type:"range",min:"10",max:"60",value:l,onChange:o=>w(Number(o.target.value))}),e.jsxs(T,{children:[l,"s"]})]})]}),e.jsx(a,{children:e.jsxs(R,{children:[e.jsx(P,{type:"checkbox",checked:x,onChange:o=>S(o.target.checked)}),"Auto-start next round after results"]})}),e.jsxs(I,{children:[e.jsx(m,{variant:"secondary",onClick:r,children:"Cancel"}),e.jsx(m,{variant:"primary",onClick:C,children:"🎮 Start Singleplayer Game"})]})]})})})}export{K as default};
