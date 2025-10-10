import{r as m,j as i}from"./three-D4AtYCWe.js";import{j as Y,W,u as K,P as b,a8 as J,d as a,m as w}from"./index-eL7pTMGs.js";import"./react-vendor-faCf7XlP.js";import"./blockchain-C0nfa7Sw.js";import"./physics-audio-DLMfKFaI.js";const I=w`
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
`,_=w`
  0%, 100% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
`,f=a.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: white;
`,q=a.div`
  text-align: center;
  margin-bottom: ${({$compact:o})=>o?"2rem":"3rem"};
  position: relative;
`,V=a.h1`
  font-size: ${({$compact:o})=>o?"2.5rem":"3rem"};
  font-family: 'Luckiest Guy', cursive, sans-serif;
  background: linear-gradient(90deg, ${({$colorScheme:o})=>o?.colors?.primary||"#ffd700"}, ${({$colorScheme:o})=>o?.colors?.secondary||"#a259ff"}, ${({$colorScheme:o})=>o?.colors?.accent||"#ff00cc"}, ${({$colorScheme:o})=>o?.colors?.primary||"#ffd700"});
  background-size: 300% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  animation: ${I} 3s linear infinite;
  text-shadow: 0 0 30px ${({$colorScheme:o})=>o?.colors?.primary||"#ffd700"}80;
  
  @media (max-width: 768px) {
    font-size: ${({$compact:o})=>o?"2rem":"2.5rem"};
  }
`,X=a.p`
  font-size: ${({$compact:o})=>o?"1.1rem":"1.3rem"};
  color: ${({$colorScheme:o})=>o?.colors?.textSecondary||"rgba(255, 255, 255, 0.8)"};
  margin-bottom: ${({$compact:o})=>o?"1.5rem":"2rem"};
  font-weight: 300;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
`,Q=a.div`
  height: ${({$compact:o})=>o?"4px":"6px"};
  width: 60%;
  max-width: 400px;
  margin: 0 auto ${({$compact:o})=>o?"1.5rem":"2rem"};
  border-radius: 3px;
  background: linear-gradient(90deg, ${({$colorScheme:o})=>o?.colors?.primary||"#ffd700"}, ${({$colorScheme:o})=>o?.colors?.secondary||"#a259ff"}, ${({$colorScheme:o})=>o?.colors?.accent||"#ff00cc"}, ${({$colorScheme:o})=>o?.colors?.primary||"#ffd700"});
  background-size: 300% 100%;
  animation: ${I} 3s linear infinite;
  box-shadow: 0 0 20px ${({$colorScheme:o})=>o?.colors?.primary||"#ffd700"}66;
`,Z=a.div`
  position: absolute;
  top: -20px;
  right: 10%;
  font-size: 2rem;
  animation: ${_} 2s infinite;
  pointer-events: none;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    right: 5%;
  }
`,ee=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`,te=a.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;

  &:hover {
    border-color: #ff5555;
    transform: translateY(-2px);
  }
`,se=a.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #ff5555;
`,re=a.p`
  color: #ccc;
  font-size: 0.9rem;
  margin-bottom: 15px;
`,oe=a.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(45deg, #ff5555, #ff8844);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(255, 85, 85, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,ie=a.div`
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(255, 85, 85, 0.3);
  border-radius: 12px;
  padding: 25px;
  max-width: 800px;
  width: 95%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
`,ne=a.h3`
  color: #ff5555;
  margin-bottom: 15px;
`,ae=a.pre`
  background: rgba(255, 255, 255, 0.05);
  padding: 20px;
  border-radius: 8px;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Courier New', monospace;
  font-size: 0.85rem;
  line-height: 1.4;
  white-space: pre-wrap;
  word-break: break-word;
  color: #e0e0e0;
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 85, 85, 0.5);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 85, 85, 0.7);
  }

  /* Highlight status icons and emojis */
  span.status-icon {
    font-size: 1.1rem;
    margin-right: 4px;
  }
`,ce=a.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    color: #ff5555;
  }
`,A=a.div`
  text-align: center;
  padding: 50px 20px;
`,y=a.h2`
  color: #ff5555;
  margin-bottom: 20px;
`,E=a.p`
  color: #888;
  font-size: 1.1rem;
  margin-bottom: 30px;
`,le=a.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
`,ue=a.h4`
  color: #ff5555;
  margin-bottom: 10px;
  font-size: 1rem;
`,R=a.p`
  color: #ccc;
  font-size: 0.9rem;
  margin: 5px 0;
`,k=a.code`
  background: rgba(255, 255, 255, 0.1);
  padding: 5px 10px;
  border-radius: 4px;
  font-family: monospace;
`,de=[{id:"comprehensive-test",title:"🚀 Comprehensive System Test",description:"Run complete 60-second test of all RPC calls, APIs, and calculate daily usage metrics",endpoint:"/api/monitoring/comprehensive-test",method:"GET"},{id:"generate-test-data",title:"🧪 Generate Test Usage Data",description:"Create sample API calls to test usage tracking system",endpoint:"/api/monitoring/debug-usage",method:"POST"},{id:"rpc-health",title:"🔌 RPC Health Monitor",description:"Live health check of all Solana RPC endpoints with response times",endpoint:"/api/monitoring/rpc-health",method:"GET"},{id:"usage-debug",title:"🔍 Usage Tracking Debug",description:"Debug usage tracking system and see why calls might be missing",endpoint:"/api/monitoring/usage-debug",method:"GET"},{id:"usage-metrics",title:"📊 API Usage & Cost Analysis",description:"Calculate current API usage patterns and estimated daily costs",endpoint:"/api/monitoring/usage-metrics",method:"GET"},{id:"cache-stats",title:"Cache Statistics",description:"Get current cache statistics and performance metrics",endpoint:"/api/cache/cache-admin?action=stats",method:"GET"},{id:"cache-cleanup",title:"Cache Cleanup",description:"Clean expired cache entries",endpoint:"/api/cache/cache-admin?action=cleanup",method:"GET",requiresAuth:!0},{id:"cache-warmup",title:"Cache Warmup",description:"Warm up cache with common data",endpoint:"/api/cache/cache-warmup",method:"GET"},{id:"dns-check",title:"DNS Health Check",description:"Check DNS status across multiple locations",endpoint:"/api/dns/check-dns",method:"GET"},{id:"rtp-audit",title:"RTP Audit",description:"Run RTP validation tests for all games",endpoint:"/api/monitoring/comprehensive-test?plays=10000",method:"GET"},{id:"price-data",title:"Price Data",description:"Get cryptocurrency price data",endpoint:"/api/services/coingecko",method:"GET"},{id:"chat-messages",title:"Chat Messages",description:"Get current chat messages",endpoint:"/api/chat/chat",method:"GET"}],Se=()=>{const{publicKey:o,connected:S}=Y(),[h,$]=m.useState(null),[P,d]=m.useState(""),[T,x]=m.useState(!1),p=W(),{currentColorScheme:g}=K(),N=S&&o?.equals(b),U=e=>{if(!e)return"No data received";const t=e.overallStatus||"unknown";let s=`${t==="healthy"?"🟢":t==="degraded"?"🟡":"🔴"} SYSTEM STATUS: ${t.toUpperCase()}
`;if(s+=`${"═".repeat(50)}

`,e.summary&&(s+=`📊 TEST SUMMARY:
`,s+=`   ✓ Total Tests: ${e.summary.totalTests}
`,s+=`   ✓ Successful: ${e.summary.successfulTests}
`,s+=`   ${e.summary.failedTests>0?"✗":"✓"} Failed: ${e.summary.failedTests}
`,s+=`   📈 Success Rate: ${(e.summary.successfulTests/e.summary.totalTests*100).toFixed(1)}%
`,s+=`   ⚡ Average Response: ${Math.round(e.summary.averageResponseTime)}ms

`),e.rpcHealth){const r=e.rpcHealth.overallStatus;s+=`${r==="healthy"?"🟢":r==="degraded"?"🟡":"🔴"} RPC HEALTH:
`,s+=`   📡 Status: ${r.toUpperCase()}
`,s+=`   📞 Successful Calls: ${e.rpcHealth.successfulCalls}/${e.rpcHealth.totalCalls}
`,s+=`   ⚡ Average Response: ${Math.round(e.rpcHealth.averageResponseTime)}ms

`}if(e.usageMetrics){s+=`📈 DAILY USAGE ESTIMATE:
`;const r=e.usageMetrics.estimatedDailyUsage;if(s+=`   🔄 Total API Calls: ${r.totalDaily?.toLocaleString()||"N/A"}
`,s+=`   🔌 RPC Calls: ${r.rpcDaily?.toLocaleString()||"N/A"}
`,s+=`   💰 Price API Calls: ${r.priceDaily?.toLocaleString()||"N/A"}
`,s+=`   🌐 Helius Calls: ${r.heliusDaily?.toLocaleString()||"N/A"}

`,e.usageMetrics.costEstimates){s+=`💰 MONTHLY COST ESTIMATE:
`;const n=e.usageMetrics.costEstimates;s+=`   💸 Total: $${n.totalEstimatedMonthlyCost?.toFixed(2)||"N/A"}
`,s+=`   🌐 Helius: $${n.heliusCost?.toFixed(2)||"N/A"}
`,s+=`   📊 CoinGecko: $${n.coinGeckoCost?.toFixed(2)||"N/A"}

`}}return e.recommendations&&e.recommendations.length>0&&(s+=`💡 RECOMMENDATIONS:
`,e.recommendations.forEach((r,n)=>{s+=`   ${n+1}. ${r}
`}),s+=`
`),s+=`🕐 Test completed in ${e.duration}ms
`,s+=`📅 ${new Date(e.timestamp).toLocaleString()}`,s},v=e=>{if(!e)return"No data received";const t=e.overallStatus||"unknown";let s=`${t==="healthy"?"🟢":t==="degraded"?"🟡":"🔴"} RPC HEALTH STATUS: ${t.toUpperCase()}
`;return s+=`═══════════════════════════════════════

`,s+=`📊 OVERALL METRICS:
`,s+=`   • Total Calls: ${e.totalCalls}
`,s+=`   • Successful: ${e.successfulCalls}
`,s+=`   • Failed: ${e.failedCalls}
`,s+=`   • Success Rate: ${(e.successfulCalls/e.totalCalls*100).toFixed(1)}%
`,s+=`   • Average Response: ${Math.round(e.averageResponseTime)}ms

`,e.endpointSummaries&&e.endpointSummaries.length>0&&(s+=`🔌 ENDPOINT STATUS:
`,e.endpointSummaries.forEach(r=>{const n=r.status;s+=`
   ${n==="healthy"?"🟢":n==="degraded"?"🟡":"🔴"} ${r.type.toUpperCase()} RPC:
`,s+=`      • Status: ${n}
`,s+=`      • Success Rate: ${(r.successfulTests/r.totalTests*100).toFixed(1)}%
`,s+=`      • Avg Response: ${Math.round(r.averageResponseTime)}ms
`,s+=`      • Critical Failures: ${r.criticalFailures}
`})),e.estimatedDailyUsage&&(s+=`

📈 ESTIMATED DAILY USAGE:
`,s+=`   • Total Calls/Day: ${e.estimatedDailyUsage.totalCallsPerDay?.toLocaleString()}
`,e.estimatedDailyUsage.peakUsagePeriods&&(s+=`   • Peak Hours: ${e.estimatedDailyUsage.peakUsagePeriods.join(", ")}
`)),s+=`
🕐 Analysis completed in ${e.duration}ms
`,s+=`📅 ${new Date(e.timestamp).toLocaleString()}`,s},L=e=>{if(!e)return"No data received";let t=`📊 API USAGE METRICS REPORT (REAL DATA)
`;if(t+=`${"═".repeat(50)}

`,!(e.current?.total>0||e.daily?.total>0||Object.values(e.current?.breakdown||{}).some(s=>s>0)))return t+=`🔄 USAGE TRACKING ACTIVE

`,t+=`📝 STATUS:
`,t+=`   ✅ Real-time tracking system implemented
`,t+=`   ✨ In-memory counters active
`,t+=`   📊 Auto-generating test data each refresh

`,t+=`🧪 HOW TO SEE DATA:
`,t+=`   1️⃣ Refresh this page - auto-generates test calls
`,t+=`   2️⃣ Use your app normally to create real traffic
`,t+=`   3️⃣ Check console logs for tracking activity

`,t+=`📋 CURRENT CONFIGURATION:
`,t+=`   🔌 Syndica: Standard Plan (FREE) - 100 RPS, 10M/month
`,t+=`   🌐 Helius: Free Plan - 10 RPS, 1M credits/month
`,t+=`   💰 All services: $0 cost (free plans)

`,t+=`📝 DEBUG INFO:
`,t+=`   • Current total: ${e.current?.total||0}
`,t+=`   • Daily total: ${e.daily?.total||0}
`,t+=`   • Breakdown: ${JSON.stringify(e.current?.breakdown||{})}
`,t;if(t+=`✅ REAL USAGE DATA DETECTED!

`,t+=`📈 CURRENT HOUR USAGE:
`,t+=`   🔄 Total: ${e.current?.total?.toLocaleString()}
`,t+=`   🔌 RPC: ${e.current?.breakdown?.rpc?.toLocaleString()}
`,t+=`   💰 Price: ${e.current?.breakdown?.price?.toLocaleString()}
`,t+=`   🌐 Helius: ${e.current?.breakdown?.helius?.toLocaleString()}
`,t+=`   💬 Chat: ${e.current?.breakdown?.chat?.toLocaleString()}
`,t+=`   🔧 Other: ${((e.current?.breakdown?.cache||0)+(e.current?.breakdown?.dns||0)+(e.current?.breakdown?.audit||0)).toLocaleString()}

`,e.rpcEndpoints&&Object.values(e.rpcEndpoints).reduce((r,n)=>r+(n||0),0)>0){t+=`🔌 RPC ENDPOINT BREAKDOWN:
`;const r=e.rpcEndpoints;t+=`   🥇 Syndica Primary: ${r["syndica-primary"]?.toLocaleString()||0}
`,t+=`   🏦 Syndica Balance: ${r["syndica-balance"]?.toLocaleString()||0}
`,t+=`   🔄 Helius Backup: ${r["helius-backup"]?.toLocaleString()||0}
`,t+=`   ⚠️  Ankr Last Resort: ${r["ankr-last-resort"]?.toLocaleString()||0}
`,t+=`   🚨 Solana Labs Last Resort: ${r["solana-labs-last-resort"]?.toLocaleString()||0}

`}if(e.daily?.total>0){t+=`🗓️ TODAY'S USAGE:
`;const s=e.daily;t+=`   📊 Total: ${s.total?.toLocaleString()}
`,t+=`   🔌 RPC: ${s.breakdown?.rpc?.toLocaleString()}
`,t+=`   💰 Price: ${s.breakdown?.price?.toLocaleString()}
`,t+=`   🌐 Helius: ${s.breakdown?.helius?.toLocaleString()}
`,t+=`   💬 Chat: ${s.breakdown?.chat?.toLocaleString()}
`,t+=`   🔧 Other: ${((s.breakdown?.cache||0)+(s.breakdown?.dns||0)+(s.breakdown?.audit||0)).toLocaleString()}

`}if(e.rateLimits){t+=`⚡ RATE LIMIT STATUS:
`;const s=e.rateLimits;if(s.syndica){const r=s.syndica.status==="healthy"?"🟢":"🟡";t+=`   ${r} SYNDICA: ${s.syndica.currentRps} RPS / ${s.syndica.rpsLimit} limit
`}if(s.helius){const r=s.helius.status==="healthy"?"🟢":"🟡";t+=`   ${r} HELIUS: ${s.helius.currentRps} RPS / ${s.helius.rpsLimit} limit
`}t+=`
`}return t+=`🎯 TRACKING SUCCESS! System is working correctly.
`,t},D=e=>{if(!e)return"No data received";let t=`🔍 USAGE TRACKING DEBUG REPORT
`;return t+=`${"═".repeat(50)}

`,t+=`📊 TRACKING STATUS: ${e.status?.toUpperCase()}

`,e.analysis&&(t+=`🎯 EXPECTED vs ACTUAL:
`,t+=`   Expected: ${e.analysis.expectedCalls.helius}, ${e.analysis.expectedCalls.syndica}
`,t+=`   Actual: Helius=${e.analysis.actualCalls.helius}, RPC=${e.analysis.actualCalls.rpc}, Total=${e.analysis.actualCalls.total}

`),e.current?.hour&&(t+=`📈 CURRENT HOUR USAGE:
`,Object.entries(e.current.hour).forEach(([c,s])=>{t+=`   ${c}: ${s}
`}),t+=`
`),e.current?.rpcEndpoints&&(t+=`🔌 RPC ENDPOINT USAGE:
`,Object.entries(e.current.rpcEndpoints).forEach(([c,s])=>{t+=`   ${c}: ${s}
`}),t+=`
`),e.tracking?.trackedAPIs&&(t+=`✅ TRACKED APIs:
`,e.tracking.trackedAPIs.forEach(c=>{t+=`   • ${c}
`}),t+=`
`),e.analysis?.possibleReasons&&(t+=`❓ POSSIBLE REASONS FOR MISSING CALLS:
`,e.analysis.possibleReasons.forEach((c,s)=>{t+=`   ${s+1}. ${c}
`}),t+=`
`),e.raw&&(t+=`🔧 RAW DEBUG DATA:
`,t+=`   Total Tracked Calls: ${e.raw.totalTrackedCalls}
`,t+=`   Hourly Counters: ${Object.keys(e.raw.hourlyCounters).length} entries
`,t+=`   Daily Counters: ${Object.keys(e.raw.dailyCounters).length} entries
`,t+=`   Endpoint Counters: ${Object.keys(e.raw.endpointCounters).length} entries
`),t+=`
📅 ${new Date(e.timestamp).toLocaleString()}`,t},M=e=>{if(!e)return"No data received";let t=`💾 CACHE STATISTICS
`;return t+=`═══════════════════════════════════════

`,t+=`📊 CACHE PERFORMANCE:
`,t+=`   • Total Entries: ${e.totalEntries||"N/A"}
`,t+=`   • Hit Rate: ${e.hitRate?(e.hitRate*100).toFixed(1)+"%":"N/A"}
`,t+=`   • Memory Usage: ${e.memoryUsage||"N/A"}
`,t+=`   • Expired Entries: ${e.expiredEntries||"N/A"}

`,e.actions&&(t+=`🛠️ AVAILABLE ACTIONS:
`,e.actions.forEach(c=>{t+=`   • ${c}
`})),t+=`
📅 ${new Date(e.timestamp).toLocaleString()}`,t},O=e=>{if(!e)return"No data received";const t=e.status||"unknown";let s=`${t==="Online"?"🟢":t==="Issues"?"🟡":"🔴"} DNS STATUS: ${t.toUpperCase()}
`;return s+=`═══════════════════════════════════════

`,e.results&&e.results.length>0&&(s+=`🌍 GLOBAL DNS STATUS:
`,e.results.forEach(r=>{const n=r.status==="online"?"🟢":"🔴";s+=`   ${n} ${r.location}, ${r.country}: ${r.status}
`})),s},G=e=>{if(!e)return"No data received";const t=e.overallStatus||"unknown";let s=`${t==="healthy"?"🟢":t==="warning"?"🟡":"🔴"} RTP AUDIT: ${t.toUpperCase()}
`;return s+=`═══════════════════════════════════════

`,s+=`🎰 AUDIT SUMMARY:
`,s+=`   • Total Tests: ${e.totalTests||"N/A"}
`,s+=`   • Passed: ${e.passedTests||"N/A"}
`,s+=`   • Failed: ${e.failedTests||"N/A"}
`,s+=`   • Success Rate: ${e.successRate?(e.successRate*100).toFixed(1)+"%":"N/A"}

`,e.gameResults&&e.gameResults.length>0&&(s+=`🎲 GAME RESULTS:
`,e.gameResults.forEach(r=>{const n=r.status==="pass"?"✅":"❌";s+=`   ${n} ${r.game}: ${r.status} (RTP: ${(r.actualRtp*100).toFixed(2)}%)
`})),s},j=e=>{if(!e)return"No data received";let t=`💰 CRYPTOCURRENCY PRICES
`;return t+=`═══════════════════════════════════════

`,Object.entries(e).forEach(([s,r])=>{r&&typeof r=="object"&&r.usd&&(t+=`💎 ${s.toUpperCase()}:
`,t+=`   • Price: $${r.usd.toFixed(6)}

`)}),t},H=e=>{if(!Array.isArray(e))return"Invalid chat data received";let t=`💬 CHAT MESSAGES (${e.length} total)
`;return t+=`═══════════════════════════════════════

`,e.length===0?t+=`📭 No messages found
`:(e.slice(-10).forEach((s,r)=>{const n=new Date(s.ts).toLocaleTimeString();t+=`[${n}] ${s.user}: ${s.text}
`}),e.length>10&&(t+=`
... and ${e.length-10} more messages`)),t},F=(e,t)=>e.id==="comprehensive-test"?U(t):e.id==="generate-test-data"?`🧪 TEST DATA GENERATED SUCCESSFULLY!
${"═".repeat(50)}

Sample API calls have been created to test the usage tracking system.

✅ Generated calls:
   • Helius API call
   • CoinGecko price API call
   • Syndica RPC call
   • Chat API call

💡 Now run "API Usage & Cost Analysis" to see the tracked data!

Response: ${JSON.stringify(t,null,2)}`:e.id==="rpc-health"?v(t):e.id==="usage-debug"?D(t):e.id==="usage-metrics"?L(t):e.id==="cache-stats"?M(t):e.id==="dns-check"?O(t):e.id==="rtp-audit"?G(t):e.id==="price-data"?j(t):e.id==="chat-messages"?H(t):JSON.stringify(t,null,2),z=m.useCallback(async e=>{x(!0),d("");try{const c=`${window.location.origin}${e.endpoint}`,s={"Content-Type":"application/json"};if(e.requiresAuth){const u=localStorage.getItem("admin_token")||prompt("Enter admin token (check .env file or Vercel settings):");u&&(s["X-Admin-Token"]=u,localStorage.setItem("admin_token",u))}const r=await fetch(c,{method:e.method,headers:s,body:e.body?JSON.stringify(e.body):void 0}),n=await r.text();let l=`Status: ${r.status} ${r.statusText}

`;if(r.ok)try{const u=JSON.parse(n);l+=F(e,u)}catch{l+=`Response:
${n}`}else l+=`Error:
${n}`;d(l)}catch(t){d(`Error: ${t instanceof Error?t.message:"Unknown error"}`)}finally{x(!1)}},[]),B=e=>{$(e),z(e)},C=()=>{$(null),d("")};return S?N?i.jsxs(f,{children:[i.jsxs(q,{$compact:!!p,children:[i.jsx(Z,{children:"🛠️⚡🛠️"}),i.jsx(V,{$compact:!!p,$colorScheme:g,children:"🛠️ Admin Control Panel"}),i.jsx(Q,{$compact:!!p,$colorScheme:g}),i.jsx(X,{$compact:!!p,$colorScheme:g,children:"Manage and monitor your DegenCasino platform"})]}),i.jsxs(le,{children:[i.jsx(ue,{children:"🔐 Admin Token Setup"}),i.jsxs(R,{children:["• ",i.jsx("strong",{children:"Status:"})," Server-side configured"]}),i.jsxs(R,{style:{color:"#888",fontSize:"0.8rem",marginTop:"10px"},children:["💡 ",i.jsx("strong",{children:"Tip:"})," Token is stored in localStorage after first use"]})]}),i.jsx(ee,{children:de.map(e=>i.jsxs(te,{children:[i.jsx(se,{children:e.title}),i.jsx(re,{children:e.description}),i.jsx(oe,{onClick:()=>B(e),disabled:T,children:T&&h?.id===e.id?"Executing...":"Execute"})]},e.id))}),h&&i.jsx(J,{onClose:C,children:i.jsxs(ie,{children:[i.jsx(ce,{onClick:C,children:"×"}),i.jsxs(ne,{children:[h.title," - Result"]}),i.jsx(ae,{children:P||"Loading..."})]})})]}):i.jsx(f,{children:i.jsxs(A,{children:[i.jsx(y,{children:"🚫 Access Denied"}),i.jsxs(E,{children:["Only the platform creator can access admin commands.",i.jsx("br",{}),i.jsx("br",{}),"Connected: ",i.jsx(k,{children:o?.toBase58()}),i.jsx("br",{}),"Required: ",i.jsx(k,{children:b.toBase58()})]})]})}):i.jsx(f,{children:i.jsxs(A,{children:[i.jsx(y,{children:"🔒 Wallet Not Connected"}),i.jsx(E,{children:"Please connect your wallet to access admin commands."})]})})};export{Se as default};
