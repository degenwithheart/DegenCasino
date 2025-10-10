import{j as e}from"./three-D4AtYCWe.js";import{d as t}from"./index-eL7pTMGs.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-DLMfKFaI.js";const s={VITE_ACCESS_OVERRIDE_MESSAGE:"Access is currently restricted. Please check back later!",VITE_OFFLINE_MESSAGE:"We are catching our breath, stacking sats in the shadows. Back soon to ride the next wave — hold tight, fam."},a=t.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg,#070708,#0f0f10);
  color: white;
  padding: 24px;
`,c=t.div`
  max-width: 900px;
  width: 100%;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  border-radius: 14px;
  padding: 28px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.6);
  text-align: center;
`,d=t.h1`
  color: #ff6666;
  margin-bottom: 12px;
  font-size: 2.2rem;
`,i=t.p`
  color: #ddd;
  font-size: 1.05rem;
  line-height: 1.5;
`,l=t.div`
  margin-top: 18px;
  color: #bbb;
  font-size: 0.9rem;
`,f=()=>{const r=s||{},n=r.VITE_ACCESS_OVERRIDE_MESSAGE||"Access is currently restricted. Please check back later!",o=r.VITE_OFFLINE_MESSAGE||"We are catching our breath, back soon.";return e.jsx(a,{children:e.jsxs(c,{children:[e.jsx(d,{children:"We'll be back soon"}),e.jsx(i,{children:n}),e.jsx(i,{style:{marginTop:12,fontStyle:"italic"},children:o}),e.jsxs(l,{children:["If you are an admin, visit ",e.jsx("a",{href:"/admin",style:{color:"#fff",textDecoration:"underline"},children:"Admin"})," to manage override settings."]})]})})};export{f as default};
