import{j as r,r as x}from"./three-D4AtYCWe.js";import{y as Y,r as H,q as L,z as te,A as ae,B as ne,C as J,D as se,T as z,E as q,G as A,t as I,x as C,H as o,I as c,J as n,d as t,u as Q,K as ie,M as ce,L as le,m as X,j as de,o as me,p as xe,v as ge,w as fe,N as h,O as he,Q as pe,S as be,V as O}from"./index-eL7pTMGs.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-DLMfKFaI.js";const $e=t.div`
  display: flex;
  flex-direction: column;
  gap: ${o.lg};
  padding: ${o.xl};
  background: linear-gradient(135deg,
    rgba(24, 24, 24, 0.95),
    rgba(15, 15, 35, 0.98)
  );
  border-radius: 24px;
  border: 1px solid ${e=>e.$colorScheme?.colors?.primary||"#ffd700"}30;
  backdrop-filter: blur(20px);
  position: relative;
  width: 100%;
  max-width: none;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);

  &::before {
    content: '🎁';
    position: absolute;
    top: -12px;
    right: -12px;
    font-size: 1.8rem;
    filter: drop-shadow(0 0 12px ${e=>e.$colorScheme?.colors?.primary||"#ffd700"});
    animation: ${c.easing.bounce} 2s infinite;
  }

  ${n.maxMobile} {
    padding: ${o.lg};
    gap: ${o.base};
    border-radius: 20px;
    
    &::before {
      font-size: 1.5rem;
      top: -10px;
      right: -10px;
    }
  }
`,N=t.h3`
  margin: 0 0 ${o.base} 0;
  color: ${e=>e.$colorScheme?.colors?.primary||"#ffd700"};
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: ${o.sm};
  text-shadow: 0 0 10px ${e=>e.$colorScheme?.colors?.primary||"#ffd700"}50;

  ${n.maxMobile} {
    font-size: 1.2rem;
  }
`,ue=t.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: ${o.base};
  margin-bottom: ${o["2xl"]};

  ${n.maxMobile} {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: ${o.sm};
    margin-bottom: ${o.lg};
  }
`,B=t.div`
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.03)
  );
  border-radius: 16px;
  padding: ${o.lg};
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all ${c.duration.fast} ${c.easing.easeOut};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      ${e=>e.$colorScheme?.colors?.primary||"#ffd700"},
      ${e=>e.$colorScheme?.colors?.accent||"#a259ff"}
    );
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.12),
      rgba(255, 255, 255, 0.06)
    );
  }

  ${n.maxMobile} {
    padding: ${o.base};
    border-radius: 12px;
  }
`,U=t.div`
  font-size: 1.6rem;
  font-weight: 700;
  color: ${e=>e.$colorScheme?.colors?.accent||"#00ff88"};
  margin-bottom: ${o.xs};
  text-shadow: 0 0 8px ${e=>e.$colorScheme?.colors?.accent||"#00ff88"}50;

  ${n.maxMobile} {
    font-size: 1.4rem;
  }
`,D=t.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;

  ${n.maxMobile} {
    font-size: 0.8rem;
  }
`,Se=t.div`
  margin: ${o.base} 0;
`,je=t.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${o.sm};
  font-size: 0.95rem;
  flex-wrap: wrap;
  gap: ${o.xs};

  ${n.maxMobile} {
    font-size: 0.85rem;
    flex-direction: column;
    align-items: flex-start;
  }
`,we=t.span`
  color: ${e=>e.$colorScheme?.colors?.primary||"#ffd700"};
  font-weight: 700;
  text-shadow: 0 0 6px ${e=>e.$colorScheme?.colors?.primary||"#ffd700"}50;
`,ye=t.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;

  ${n.maxMobile} {
    font-size: 0.8rem;
  }
`,ve=t.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`,ke=t.div`
  width: ${e=>e.progress*100}%;
  height: 100%;
  background: linear-gradient(90deg,
    ${e=>e.$colorScheme?.colors?.primary||"#ffd700"},
    ${e=>e.$colorScheme?.colors?.accent||"#a259ff"}
  );
  transition: width ${c.duration.slow} ${c.easing.easeOut};
  box-shadow: 0 0 10px ${e=>e.$colorScheme?.colors?.primary||"#ffd700"}60;
`,Ce=t.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${o.base};
  margin-top: ${o.lg};

  ${n.maxMobile} {
    grid-template-columns: 1fr;
    gap: ${o.sm};
  }
`,E=t.div`
  .gamba-button {
    background: linear-gradient(135deg,
      ${e=>e.$colorScheme?.colors?.primary||"#ffd700"},
      ${e=>e.$colorScheme?.colors?.accent||"#a259ff"}
    ) !important;
    border: none !important;
    border-radius: 12px !important;
    padding: ${o.base} ${o.lg} !important;
    font-weight: 600 !important;
    color: #000 !important;
    transition: all ${c.duration.fast} ${c.easing.easeOut} !important;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
    
    &:hover {
      transform: scale(1.02) !important;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3) !important;
    }

    &:active {
      transform: scale(0.98) !important;
    }

    ${n.maxMobile} {
      padding: ${o.sm} ${o.base} !important;
      font-size: 0.9rem !important;
    }
  }
`,ze=t.div`
  margin-top: ${o["2xl"]};
`,Re=t.div`
  display: flex;
  flex-direction: column;
  gap: ${o.sm};
  max-height: 250px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 3px;
    
    &:hover {
      background: rgba(255, 215, 0, 0.5);
    }
  }
`,Me=t.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${o.base};
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.02)
  );
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.9rem;
  transition: all ${c.duration.fast} ${c.easing.easeOut};

  &:hover {
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0.04)
    );
    border-color: ${e=>e.$colorScheme?.colors?.primary||"#ffd700"}30;
  }

  ${n.maxMobile} {
    padding: ${o.sm};
    font-size: 0.85rem;
    flex-direction: column;
    align-items: flex-start;
    gap: ${o.xs};
  }
`,Te=t.span`
  color: ${e=>e.$colorScheme?.colors?.primary||"#ffd700"};
  font-weight: 600;
  text-shadow: 0 0 4px ${e=>e.$colorScheme?.colors?.primary||"#ffd700"}40;
`,G=t.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.8rem;
  font-weight: 500;

  ${n.maxMobile} {
    font-size: 0.75rem;
  }
`;function Ae({className:e}){const g=Y(),a=H(),m=L(),s=te(),b=ae(g?.toBase58()),{showWalletToast:l}=ne(),f=J(b),$=se(b),u=async()=>{try{await a.copyLinkToClipboard(),l("REFERRAL_COPY_SUCCESS")}catch(i){console.error("Failed to copy referral link:",i)}},w={twitter:`🎰 Join me on DegenCasino! Get started with my referral link and we both win! 💰

${a.referralLink}`,discord:`🎰 **DegenCasino Invite** 🎰

Join me for some epic gaming! Use my referral link:
${a.referralLink}`},p=i=>{const S=w[i];if(i==="twitter"){const j=`https://twitter.com/intent/tweet?text=${encodeURIComponent(S)}`;window.open(j,"_blank")}else i==="discord"&&(navigator.clipboard.writeText(S),l("REFERRAL_COPY_SUCCESS"))};return r.jsxs($e,{className:e,children:[r.jsx(N,{children:"🎁 Referral Dashboard"}),r.jsxs(ue,{children:[r.jsxs(B,{children:[r.jsx(U,{children:b}),r.jsx(D,{children:"Total Referrals"})]}),r.jsxs(B,{children:[r.jsx(U,{children:r.jsx(z,{amount:s.totalEarnings,mint:m.mint})}),r.jsx(D,{children:"Total Earned"})]}),r.jsxs(B,{children:[r.jsxs(U,{children:[f.displayFee,"%"]}),r.jsx(D,{children:"Target Fee"})]})]}),r.jsxs(Se,{children:[r.jsxs(je,{children:[r.jsx(we,{children:q(f)}),f.nextTier&&r.jsxs(ye,{children:["Next: ",f.nextTierData?.badge," ",f.nextTierData?.name," • ","Badge"," (",$," more)"]})]}),r.jsx(ve,{children:r.jsx(ke,{progress:f.progress})})]}),r.jsxs(Ce,{children:[r.jsx(E,{children:r.jsx(A.Button,{onClick:u,children:"📋 Copy Referral Link"})}),r.jsx(E,{children:r.jsx(A.Button,{onClick:()=>p("twitter"),children:"🐦 Share on X"})}),r.jsx(E,{children:r.jsx(A.Button,{onClick:()=>p("discord"),children:"💬 Share on Discord"})})]}),s.recentReferrals.length>0&&r.jsxs(ze,{children:[r.jsx(N,{children:"👥 Recent Referrals"}),r.jsx(Re,{children:s.recentReferrals.map((i,S)=>{const j=I(i.address);return r.jsxs(Me,{children:[r.jsxs("div",{children:[r.jsxs(Te,{children:[j," (",C(i.address,6,4),")"]}),r.jsxs(G,{children:[" • ",i.gameCount," games"]})]}),r.jsx(G,{children:r.jsx(z,{amount:i.totalWagered,mint:m.mint})})]},i.address)})})]})]})}const Be=X`
  0% { opacity: 0; filter: blur(12px); transform: scale(0.8) rotate(-5deg); }
  60% { opacity: 1; filter: blur(2px); transform: scale(1.05) rotate(1deg); }
  100% { opacity: 1; filter: blur(0); transform: scale(1) rotate(0deg); }
`,Ue=X`
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.3), 0 0 40px rgba(255, 215, 0, 0.2);
  }
  50% {
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3);
  }
`,De=t.div`
  width: 100%;
  max-width: 700px;
  padding: ${o["3xl"]};
  background: linear-gradient(135deg,
    rgba(24, 24, 24, 0.95),
    rgba(15, 15, 35, 0.98)
  );
  backdrop-filter: blur(25px);
  border: 1px solid ${e=>e.$colorScheme?.colors?.primary||"#ffd700"}30;
  border-radius: 24px;
  color: white;
  position: relative;
  box-shadow:
    0 25px 50px rgba(0, 0, 0, 0.4),
    0 0 80px ${e=>e.$colorScheme?.colors?.primary||"#ffd700"}20,
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: ${Be} 0.6s cubic-bezier(0.7,0.2,0.2,1);
  margin: auto;

  ${n.maxMobile} {
    margin: ${o.base};
    padding: ${o.xl};
    max-width: calc(100vw - 2rem);
    max-height: calc(100vh - 4rem);
    overflow-y: auto;
    border-radius: 20px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      ${e=>e.$colorScheme?.colors?.primary||"#ffd700"},
      ${e=>e.$colorScheme?.colors?.accent||"#a259ff"},
      ${e=>e.$colorScheme?.colors?.primary||"#ffd700"}
    );
    border-radius: 24px 24px 0 0;
  }
`,Ee=t.div`
  text-align: center;
  margin-bottom: ${o["3xl"]};
  
  ${n.maxMobile} {
    margin-bottom: ${o.xl};
  }
`,Fe=t.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 ${o.sm} 0;
  background: linear-gradient(135deg,
    ${e=>e.$colorScheme?.colors?.primary||"#ffd700"},
    ${e=>e.$colorScheme?.colors?.accent||"#a259ff"}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 20px ${e=>e.$colorScheme?.colors?.primary||"#ffd700"}50;
  
  ${n.maxMobile} {
    font-size: 1.6rem;
  }
`,Le=t.p`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-weight: 500;
  
  ${n.maxMobile} {
    font-size: 0.9rem;
  }
`,Ie=t.div`
  display: flex;
  flex-direction: column;
  gap: ${o.base};
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(255, 215, 0, 0.5);
    }
  }

  ${n.maxMobile} {
    max-height: 350px;
    gap: ${o.sm};
  }
`,Oe=t.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${o.lg};
  background: ${e=>e.$isUser?`linear-gradient(135deg,
        ${e.$colorScheme?.colors?.primary||"#ffd700"}20,
        ${e.$colorScheme?.colors?.accent||"#a259ff"}20
      )`:"linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))"};
  border: 1px solid ${e=>e.$isUser?e.$colorScheme?.colors?.primary||"#ffd700":"rgba(255, 255, 255, 0.08)"};
  border-radius: 16px;
  transition: all ${c.duration.fast} ${c.easing.easeOut};
  position: relative;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-2px);
    background: ${e=>e.$isUser?`linear-gradient(135deg,
          ${e.$colorScheme?.colors?.primary||"#ffd700"}30,
          ${e.$colorScheme?.colors?.accent||"#a259ff"}30
        )`:"linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.04))"};
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  ${e=>e.$isUser&&`
    animation: ${Ue} 2s infinite;
    box-shadow: 0 0 20px ${e.$colorScheme?.colors?.primary||"#ffd700"}30;
  `}

  ${n.maxMobile} {
    padding: ${o.base};
    flex-direction: column;
    align-items: flex-start;
    gap: ${o.sm};
    border-radius: 12px;
  }
`,We=t.div`
  display: flex;
  align-items: center;
  gap: ${o.base};
  flex: 1;

  ${n.maxMobile} {
    width: 100%;
    justify-content: space-between;
  }
`,Pe=t.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 1rem;
  color: #000;
  background: ${e=>e.$rank===1?"linear-gradient(135deg, #FFD700, #FFA500)":e.$rank===2?"linear-gradient(135deg, #C0C0C0, #A8A8A8)":e.$rank===3?"linear-gradient(135deg, #CD7F32, #B8860B)":`linear-gradient(135deg, ${e.$colorScheme?.colors?.primary||"#ffd700"}80, ${e.$colorScheme?.colors?.accent||"#a259ff"}80)`};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  
  ${n.maxMobile} {
    width: 36px;
    height: 36px;
    font-size: 0.9rem;
  }
`,Ne=t.div`
  display: flex;
  flex-direction: column;
  gap: ${o.xs};
  flex: 1;
`,Ge=t.div`
  font-weight: 600;
  font-size: 1rem;
  color: ${e=>e.$colorScheme?.colors?.primary||"#ffd700"};
  text-shadow: 0 0 6px ${e=>e.$colorScheme?.colors?.primary||"#ffd700"}40;

  ${n.maxMobile} {
    font-size: 0.9rem;
  }
`,Ke=t.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  font-family: monospace;

  ${n.maxMobile} {
    font-size: 0.75rem;
  }
`,Ve=t.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${o.xs};
  text-align: right;

  ${n.maxMobile} {
    align-items: flex-start;
    text-align: left;
    width: 100%;
  }
`,K=t.div`
  font-weight: 700;
  font-size: 1rem;
  color: ${e=>e.$colorScheme?.colors?.accent||"#00ff88"};
  text-shadow: 0 0 6px ${e=>e.$colorScheme?.colors?.accent||"#00ff88"}40;

  ${n.maxMobile} {
    font-size: 0.9rem;
  }
`,V=t.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${n.maxMobile} {
    font-size: 0.7rem;
  }
`,_e=t.span`
  background: linear-gradient(135deg,
    ${e=>e.$colorScheme?.colors?.primary||"#ffd700"}20,
    ${e=>e.$colorScheme?.colors?.accent||"#a259ff"}20
  );
  color: ${e=>e.$colorScheme?.colors?.primary||"#ffd700"};
  padding: ${o.xs} ${o.sm};
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid ${e=>e.$colorScheme?.colors?.primary||"#ffd700"}30;

  ${n.maxMobile} {
    padding: 4px ${o.xs};
    font-size: 0.65rem;
  }
`,Ye=t.div`
  text-align: center;
  padding: ${o["3xl"]} ${o.xl};
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
  line-height: 1.6;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${o.base};

  &::before {
    content: '🎯';
    font-size: 2rem;
    opacity: 0.6;
  }

  ${n.maxMobile} {
    padding: ${o["2xl"]} ${o.base};
    font-size: 1rem;
  }
`,He=t.button`
  position: absolute;
  top: ${o.base};
  right: ${o.base};
  background: none;
  border: none;
  color: ${e=>e.$colorScheme?.colors?.primary||"#ffd700"};
  font-size: 1.5rem;
  cursor: pointer;
  padding: ${o.sm};
  border-radius: 8px;
  transition: all ${c.duration.fast} ${c.easing.easeOut};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.1);
  }

  ${n.maxMobile} {
    font-size: 1.3rem;
    padding: ${o.xs};
  }
`;function Je({onClose:e}){const g=Y(),a=L(),m=le(20),{currentColorScheme:s}=Q(),b=g?.toBase58();return ie.createPortal(r.jsx(ce,{isOpen:!0,onClose:e,children:r.jsxs(De,{$colorScheme:s,children:[r.jsx(He,{onClick:e,$colorScheme:s,children:"×"}),r.jsxs(Ee,{children:[r.jsx(Fe,{$colorScheme:s,children:"🏆 Referral Leaderboard"}),r.jsx(Le,{children:"Top players by referral performance"})]}),r.jsx(Ie,{children:m.length===0?r.jsxs(Ye,{children:["Be the first to appear on the leaderboard!",r.jsx("br",{}),"Start inviting friends to earn rewards and climb the ranks."]}):m.map((l,f)=>{const $=f+1,u=l.address===b,w=I(l.address),p=J(l.referralCount);return r.jsxs(Oe,{$isUser:u,$colorScheme:s,children:[r.jsxs(We,{children:[r.jsx(Pe,{$rank:$,$colorScheme:s,children:$}),r.jsxs(Ne,{children:[r.jsxs(Ge,{$colorScheme:s,children:[w,u&&" (You)"]}),r.jsxs("div",{style:{display:"flex",alignItems:"center",gap:o.sm,flexWrap:"wrap"},children:[r.jsx(Ke,{children:C(l.address,6,4)}),r.jsx(_e,{$colorScheme:s,children:q(p)})]})]})]}),r.jsx(Ve,{children:r.jsxs("div",{style:{display:"flex",gap:o.lg},children:[r.jsxs("div",{children:[r.jsx(K,{$colorScheme:s,children:l.referralCount}),r.jsx(V,{children:"Referrals"})]}),r.jsxs("div",{children:[r.jsx(K,{$colorScheme:s,children:r.jsx(z,{amount:l.totalEarnings,mint:a.mint})}),r.jsx(V,{children:"Earnings"})]})]})})]},l.address)})})]})}),document.body)}function qe(){const[e,g]=x.useState(!1),a=()=>g(!0),m=()=>g(!1);return{isOpen:e,openModal:a,closeModal:m,Modal:e?r.jsx(Je,{onClose:m}):null}}const Qe=t.div`
  padding: ${o.base};
  background: ${e=>e.$colorScheme.colors.background};
  min-height: 100vh;
  color: ${e=>e.$colorScheme.colors.text};
`,Xe=t.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${o.lg} 0;
  background: linear-gradient(135deg, ${e=>e.$colorScheme.colors.accent}20, ${e=>e.$colorScheme.colors.surface}40);
  border-radius: ${O.button.borderRadius};
  margin-bottom: ${o.base};
  border: 1px solid ${e=>e.$colorScheme.colors.accent}30;
`,Ze=t.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.2);
  margin-bottom: ${o.base};
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`,er=t.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`,rr=t.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${e=>e.$colorScheme.colors.text};
  font-size: 2rem;
`,or=t.h2`
  margin: 0;
  font-size: ${h.scale.xl};
  font-weight: ${h.weight.bold};
  color: ${e=>e.$colorScheme.colors.text};
  text-align: center;
`,tr=t.p`
  margin: ${o.xs} 0;
  font-size: ${h.scale.sm};
  color: ${e=>e.$colorScheme.colors.text}80;
  font-family: monospace;
`,y=t.div`
  background: ${e=>e.$colorScheme.colors.surface}40;
  border: 1px solid ${e=>e.$colorScheme.colors.accent}20;
  border-radius: ${O.button.borderRadius};
  padding: ${o.base};
  margin-bottom: ${o.base};
`,v=t.h3`
  margin: 0 0 ${o.base} 0;
  font-size: ${h.scale.lg};
  font-weight: ${h.weight.semibold};
  color: ${e=>e.$colorScheme.colors.text};
`,T=t.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${o.sm} 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`,k=t.button`
  background: ${e=>e.$variant==="primary"?`linear-gradient(135deg, ${e.$colorScheme.colors.accent}, ${e.$colorScheme.colors.accent}CC)`:`${e.$colorScheme.colors.surface}60`};
  border: 1px solid ${e=>e.$colorScheme.colors.accent}40;
  color: ${e=>e.$colorScheme.colors.text};
  padding: ${o.sm} ${o.base};
  border-radius: ${O.button.borderRadius};
  font-size: ${h.scale.base};
  font-weight: ${h.weight.medium};
  cursor: pointer;
  transition: all ${c.duration.fast} ease;
  display: flex;
  align-items: center;
  gap: ${o.sm};
  min-height: ${o.touchTarget};
  flex: 1;
  justify-content: center;
  
  &:active {
    transform: scale(0.98);
  }
`,F=t.div`
  display: flex;
  gap: ${o.sm};
  margin-top: ${o.base};
`,ar=t.div`
  display: flex;
  flex-direction: column;
  gap: ${o.base};
`,_=t.div`
  color: ${e=>e.$colorScheme.colors.text}80;
  font-size: ${h.scale.sm};
  display: flex;
  align-items: center;
  gap: ${o.xs};
`;t.span`
  color: ${e=>e.$colorScheme?.colors?.primary||"#ffd700"};
  font-weight: 600;
  font-family: monospace;
  text-shadow: 0 0 4px ${e=>e.$colorScheme?.colors?.primary||"#ffd700"}40;
`;t.div`
  padding: ${o.lg};
  background: linear-gradient(135deg,
    rgba(24, 24, 24, 0.95),
    rgba(15, 15, 35, 0.98)
  );
  border-radius: 24px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  margin: ${o.base};

  ${n.maxMobile} {
    padding: ${o.base};
    border-radius: 16px;
    margin: ${o.xs};
  }

  /* Ambient glow effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at 30% 20%,
      rgba(255, 215, 0, 0.08) 0%,
      rgba(162, 89, 255, 0.05) 50%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }
`;function dr(){const e=de(),g=me(),{currentColorScheme:a}=Q(),[m,s]=x.useState("Guest"),[b,l]=x.useState(""),[f,$]=x.useState(!1),{balance:u,bonusBalance:w}=xe();L();const p=H(),[i,S]=x.useState(!1),j=qe(),Z=()=>e.disconnect(),d=e.publicKey?.toBase58(),W=d?`https://robohash.org/${d}?size=100x100&set=set5`:null;x.useEffect(()=>{if(!e.publicKey){s("Guest"),l("");return}const R=e.publicKey.toString();let M=localStorage.getItem(`username-${R}`);M||(M=I(R),localStorage.setItem(`username-${R}`,M)),s(M),l(ge(R))},[e.publicKey]);const[P,ee]=x.useState(!1);x.useEffect(()=>{setTimeout(()=>$(!0),50)},[]),x.useEffect(()=>{e.connecting||ee(!0)},[e.connecting]),x.useEffect(()=>{P&&!e.connected&&!e.connecting&&g("/")},[P,e.connected,e.connecting,g]);const re=async()=>{try{S(!0),await p.removeInvite()}finally{S(!1)}},oe=()=>{d&&navigator.clipboard.writeText(d)};return r.jsxs(r.Fragment,{children:[r.jsxs(Qe,{$colorScheme:a,children:[r.jsxs(Xe,{$colorScheme:a,children:[r.jsx(Ze,{children:W?r.jsx(er,{src:W,alt:"Avatar"}):r.jsx(rr,{$colorScheme:a,children:r.jsx(fe,{})})}),r.jsx(or,{$colorScheme:a,children:m}),d&&r.jsx(tr,{$colorScheme:a,children:C(d,8,4)})]}),r.jsxs(y,{$colorScheme:a,children:[r.jsx(v,{$colorScheme:a,children:"📜 Degen Folk Lore"}),r.jsx("p",{style:{fontSize:h.scale.base,lineHeight:"1.6",margin:0,color:a.colors.text+"80",textAlign:"center"},children:b})]}),r.jsxs(y,{$colorScheme:a,children:[r.jsx(v,{$colorScheme:a,children:"💰 Balance"}),r.jsxs(T,{children:[r.jsx("span",{children:"Token Balance:"}),r.jsx(z,{amount:u})]}),r.jsxs(T,{children:[r.jsx("span",{children:"Bonus Balance:"}),r.jsx(z,{amount:w})]})]}),r.jsxs(y,{$colorScheme:a,children:[r.jsx(v,{$colorScheme:a,children:"💼 Wallet Info"}),r.jsxs(T,{children:[r.jsx("span",{children:"Adapter:"}),r.jsx("span",{children:e.wallet?.adapter.name||"No wallet"})]}),r.jsxs(T,{children:[r.jsx("span",{children:"Address:"}),r.jsx("span",{children:d?C(d,6,6):"Not connected"})]}),r.jsxs(F,{children:[d&&r.jsxs(k,{$colorScheme:a,$variant:"secondary",onClick:oe,children:[r.jsx(he,{})," Copy Address"]}),e.connected&&r.jsxs(k,{$colorScheme:a,$variant:"secondary",onClick:Z,children:[r.jsx(pe,{})," Disconnect"]})]}),d&&r.jsx(F,{children:r.jsx(k,{as:"a",href:`https://solscan.io/account/${d}`,target:"_blank",rel:"noopener noreferrer",$colorScheme:a,$variant:"primary",children:"View on Solscan"})})]}),r.jsxs(y,{$colorScheme:a,children:[r.jsx(v,{$colorScheme:a,children:"🔗 Referral Connection"}),p.referrerAddress?r.jsxs(ar,{children:[r.jsxs(_,{$colorScheme:a,children:["Referred by: ",C(p.referrerAddress.toString(),4,4)]}),r.jsx(k,{$colorScheme:a,$variant:"secondary",onClick:re,disabled:i,children:i?"Removing...":"Remove Referrer"})]}):r.jsx(_,{$colorScheme:a,children:"No active referral connection"})]}),r.jsxs(y,{$colorScheme:a,children:[r.jsx(v,{$colorScheme:a,children:"📊 Referral Dashboard"}),r.jsx(Ae,{}),r.jsx(F,{children:r.jsxs(k,{$colorScheme:a,$variant:"primary",onClick:j.openModal,children:[r.jsx(be,{})," View Leaderboard"]})})]})]}),j.Modal]})}export{dr as UserProfile,dr as default};
