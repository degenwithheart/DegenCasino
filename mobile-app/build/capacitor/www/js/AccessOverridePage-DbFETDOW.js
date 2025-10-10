import{r as o,j as e}from"./three-D4AtYCWe.js";import{W as C,u as j,d as s}from"./index-Dyfdn2uN.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-DLMfKFaI.js";const k={VITE_ACCESS_OVERRIDE_ENABLED:"true",VITE_ACCESS_OVERRIDE_MESSAGE:"Access is currently restricted. Please check back later!",VITE_OFFLINE_MESSAGE:"We are catching our breath, stacking sats in the shadows. Back soon to ride the next wave — hold tight, fam."},w=s.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  color: white;
`,y=s.h2`
  font-size: 1.8rem;
  margin-bottom: 12px;
  color: #ff5555;
`,M=s.p`
  color: #ccc;
  margin-bottom: 18px;
`,p=s.label`
  display: block;
  color: #ddd;
  margin-bottom: 6px;
  font-size: 0.9rem;
`;s.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
  color: white;
  margin-bottom: 12px;
`;const S=s.textarea`
  width: 100%;
  min-height: 140px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.02);
  color: white;
  margin-bottom: 12px;
`,b=s.div`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
`,R=s.button`
  padding: 8px 14px;
  border-radius: 999px;
  border: none;
  background: ${({$on:n})=>n?"linear-gradient(90deg,#44dd66,#22aa44)":"rgba(255,255,255,0.06)"};
  color: ${({$on:n})=>n?"black":"white"};
  cursor: pointer;
`,v=s.button`
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  background: linear-gradient(45deg, #ff5555, #ff8844);
  color: white;
  cursor: pointer;
`,f=s.div`
  color: #aaa;
  font-size: 0.85rem;
  margin-top: 10px;
`,_="access_override_ui",L=()=>{C();const{currentColorScheme:n}=j(),c=k||{},g=c.VITE_ACCESS_OVERRIDE_MESSAGE||"",h=c.VITE_OFFLINE_MESSAGE||"",T=c.VITE_ACCESS_OVERRIDE_ENABLED==="true"||!1,[i,m]=o.useState(T),[l,x]=o.useState(g),[d,u]=o.useState(h),[E,r]=o.useState("");o.useEffect(()=>{try{const t=localStorage.getItem(_);if(t){const a=JSON.parse(t);m(a.enabled),x(a.accessMessage||g),u(a.offlineMessage||h)}}catch{}},[]);const A=()=>{const t={enabled:i,accessMessage:l,offlineMessage:d};localStorage.setItem(_,JSON.stringify(t)),r("Saved to localStorage"),setTimeout(()=>r(""),2500)},O=async()=>{r("Applying to server...");try{const t=localStorage.getItem("admin_token"),a=await fetch("/api/admin/access-override",{method:"POST",headers:{"Content-Type":"application/json",...t?{"X-Admin-Token":t}:{}},body:JSON.stringify({enabled:i,accessMessage:l,offlineMessage:d})});if(a.ok)r("Server updated successfully");else{const I=await a.text();r(`Server responded: ${a.status} - ${I}`)}}catch{r("Server update failed (no endpoint or network error)")}setTimeout(()=>r(""),3e3)};return e.jsxs(w,{children:[e.jsx(y,{children:"Access Override / Offline Mode"}),e.jsxs(M,{children:["This page reflects the Vite environment variables (client-visible) used to control access override and offline messages. Note: server-only variables such as ",e.jsx("strong",{children:"ACCESS_OVERRIDE_PASSWORD"})," are not available in the browser and will not be shown here."]}),e.jsxs(b,{children:[e.jsx(p,{style:{minWidth:180},children:"Feature Flag (Enable Override)"}),e.jsx(R,{$on:i,onClick:()=>m(t=>!t),children:i?"Enabled":"Disabled"})]}),e.jsxs("div",{children:[e.jsx(p,{children:"Access Override Message (VITE_ACCESS_OVERRIDE_MESSAGE)"}),e.jsx(S,{value:l,onChange:t=>x(t.target.value)})]}),e.jsxs("div",{children:[e.jsx(p,{children:"Offline Message (VITE_OFFLINE_MESSAGE)"}),e.jsx(S,{value:d,onChange:t=>u(t.target.value)})]}),e.jsxs(b,{children:[e.jsx(v,{onClick:A,children:"Save (local)"}),e.jsx(v,{onClick:O,children:"Apply to Server (optional)"})]}),e.jsx(f,{children:"• The initial values are read from import.meta.env (Vite build-time). Toggling here updates local UI state and localStorage. To make persistent server-side changes you must update server environment or provide a server API that accepts these settings (this page will attempt POST /api/admin/access-override if available)."}),E&&e.jsx(f,{style:{marginTop:12},children:E})]})};export{L as default};
