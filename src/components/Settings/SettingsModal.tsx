import React from 'react'
// Allow injected build-time constant from Vite define
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare const __APP_VERSION__: string | undefined
import { Modal } from '../Modal/Modal'
import styled from 'styled-components'
import { useUserStore } from '../../hooks/useUserStore'
import { setPrefetchUserOverride } from '../../hooks/usePrefetch'
const ThemeSelectorLazy = React.lazy(() => import('../Theme/ThemeSelector').then(m => ({ default: m.ThemeSelector })))
import { useTheme } from '../../themes/ThemeContext'

const Wrapper = styled.div`
  max-width: 500px;
  padding: 1.1rem 1.3rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: 'Inter', system-ui, sans-serif;
  color: #e8f3ff;
`

const Title = styled.h2`
  margin: 0 0 .25rem;
  font-size: 1.35rem;
  letter-spacing: .5px;
  background: linear-gradient(90deg,#ffd700,#a259ff);
  -webkit-background-clip: text;
  color: transparent;
`

const Section = styled.div`
  background: rgba(255,255,255,0.045);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const SectionHeader = styled.button<{ $open: boolean }>`
  all: unset;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .55rem .75rem;
  font-size: .7rem;
  letter-spacing: .5px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0));
  position: relative;
  user-select: none;
  &:focus-visible { outline: 2px solid #6366f1aa; outline-offset: -2px; }
  &::after {
    content: '';
    width: 8px; height: 8px;
    border-right: 2px solid #ccc;
    border-bottom: 2px solid #ccc;
    transform: rotate(${p => p.$open ? '45deg' : '-45deg'});
    transition: transform .25s;
    margin-left: .65rem;
  }
`

const SectionBody = styled.div<{ $open: boolean }>`
  display: grid;
  grid-template-rows: ${p => p.$open ? '1fr' : '0fr'};
  transition: grid-template-rows .32s cubic-bezier(.4,0,.2,1);
  > div { overflow: hidden; }
`

const SectionContentPad = styled.div`
  padding: .35rem .75rem .75rem;
  display: flex;
  flex-direction: column;
  gap: .55rem;
`

const StaticHeader = styled.div`
  display: flex;
  align-items: center;
  padding: .55rem .75rem .25rem;
  font-size: .7rem;
  letter-spacing: .5px;
  font-weight: 600;
  color: #fff;
  user-select: none;
  background: linear-gradient(90deg,rgba(255,255,255,0.06),rgba(255,255,255,0));
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px,1fr));
  gap: .4rem .65rem;
  margin: .35rem 0 .55rem;
`

const MetaChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  padding: .25rem .45rem;
  border-radius: 6px;
  font-size: .52rem;
  letter-spacing: .5px;
  font-weight: 600;
  color: #d9e6f5;
  white-space: nowrap;
`

const HorizontalScroll = styled.div`
  display: flex;
  flex-direction: row;
  gap: .75rem;
  overflow-x: auto;
  padding: .5rem .25rem .5rem .25rem;
  scrollbar-width: thin;
  scrollbar-color: #444 transparent;
  &::-webkit-scrollbar { height: 6px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #555; border-radius: 4px; }
`

const Row = styled.label`
  display: flex;
  align-items: center;
  gap: .55rem;
  font-size: .78rem;
  line-height: 1.2;
  cursor: pointer;
  user-select: none;
  padding: 2px 0;
  input { transform: scale(1.05); cursor: pointer; }
  span.badge { margin-left: auto; font-size: .55rem; background:#222; padding:2px 5px; border:1px solid #333; border-radius:5px; letter-spacing:.5px; }
`

// New compact UI primitives for richer controls (toggles, segmented buttons, selects)
const LabelText = styled.span`
  flex: 1;
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #f5f7fa;
  font-size: .68rem;
  letter-spacing: .3px;
`

const ToggleShell = styled.button<{ $on: boolean }>`
  position: relative;
  width: 34px;
  height: 18px;
  border-radius: 20px;
  background: ${p => p.$on ? 'linear-gradient(90deg,#4ade80,#16a34a)' : 'rgba(255,255,255,0.15)'};
  border: 1px solid ${p => p.$on ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.18)'};
  cursor: pointer;
  padding: 0;
  outline: none;
  transition: background .25s, box-shadow .25s;
  box-shadow: ${p => p.$on ? '0 0 0 2px rgba(74,222,128,0.25)' : 'none'};
  &:focus-visible { box-shadow: 0 0 0 2px #6366f180; }
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${p => p.$on ? '16px' : '2px'};
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.4);
    transition: left .25s ease;
  }
`

const Segmented = styled.div`
  display: inline-flex;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 8px;
  overflow: hidden;
`

const SegmentBtn = styled.button<{ $active?: boolean }>`
  font-size: .58rem;
  padding: .35rem .55rem;
  background: ${p => p.$active ? 'linear-gradient(90deg,#6366f1,#8b5cf6)' : 'transparent'};
  color: ${p => p.$active ? '#fff' : '#cdd6e5'};
  border: none;
  cursor: pointer;
  letter-spacing: .5px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  transition: background .18s, color .18s;
  &:hover { background: ${p => p.$active ? 'linear-gradient(90deg,#6366f1,#8b5cf6)' : 'rgba(255,255,255,0.08)'}; }
  &:focus-visible { outline: 2px solid #6366f1aa; outline-offset: -2px; }
  & + & { border-left: 1px solid rgba(255,255,255,0.12); }
`

const Select = styled.select`
  background: rgba(0,0,0,0.35);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  font-size: .6rem;
  padding: .35rem .5rem;
  border-radius: 6px;
  cursor: pointer;
  outline: none;
  &:focus-visible { box-shadow: 0 0 0 2px #6366f180; }
`

const Note = styled.p`
  margin: .25rem 0 0;
  font-size: .7rem;
  opacity: .7;
`

const ResetButton = styled.button`
  margin-top: .25rem;
  align-self: flex-start;
  background: linear-gradient(90deg,#a259ff,#ff008c);
  color: #fff;
  border: none;
  font-size: .65rem;
  letter-spacing: .5px;
  padding: .45rem .8rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 0 10px #ff00cc55;
  transition: opacity .2s, transform .2s;
  &:hover { opacity:.85; transform: translateY(-2px); }
`

interface SettingsModalProps { onClose: () => void }

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [openSections, setOpenSections] = React.useState({
    quick: false,
    appearance: false,
    advanced: false,
  })
  const toggleSection = (key: keyof typeof openSections) => setOpenSections(s => ({ ...s, [key]: !s[key] }))
  const [isMobile, setIsMobile] = React.useState(false)
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  const dataSaver = useUserStore(s => s.dataSaver)
  const particlesEnabled = useUserStore(s => s.particlesEnabled !== false)
  const prefetchLevel = useUserStore(s => s.prefetchLevel || 'conservative')
  const reduceMotion = useUserStore(s => !!s.reduceMotion)
  const lessGlow = useUserStore(s => !!s.lessGlow)
  const tickerInterval = useUserStore(s => s.tickerInterval || 15000)
  const imageQuality = useUserStore(s => s.imageQuality || 'balanced')
  const deferAudio = useUserStore(s => !!s.deferAudio)
  const progressiveImages = useUserStore(s => !!s.progressiveImages)
  const backgroundThrottle = useUserStore(s => !!s.backgroundThrottle)
  const cacheWarmup = useUserStore(s => !!s.cacheWarmup)
  const fontSlim = useUserStore(s => !!s.fontSlim)
  const autoAdapt = useUserStore(s => !!s.autoAdapt)
  const adaptiveRaf = useUserStore(s => s.adaptiveRaf !== false)
  const autoReduced = useUserStore(s => s.autoAdapt && (s.reduceMotion || s.lessGlow))
  const { setTheme } = useTheme()
  const set = useUserStore(s => s.set)

  const toggleDataSaver = () => {
    set({ dataSaver: !dataSaver })
    setPrefetchUserOverride(!dataSaver ? false : null as any)
  }
  const toggleParticles = () => set({ particlesEnabled: !particlesEnabled })
  const toggleReduceMotion = () => set({ reduceMotion: !reduceMotion })
  const toggleLessGlow = () => set({ lessGlow: !lessGlow })
  const toggleDeferAudio = () => set({ deferAudio: !deferAudio })
  const toggleProgressiveImages = () => set({ progressiveImages: !progressiveImages })
  const toggleBackgroundThrottle = () => set({ backgroundThrottle: !backgroundThrottle })
  const toggleCacheWarmup = () => set({ cacheWarmup: !cacheWarmup })
  const toggleFontSlim = () => set({ fontSlim: !fontSlim })
  const toggleAutoAdapt = () => set({ autoAdapt: !autoAdapt })
  const toggleAdaptiveRaf = () => set({ adaptiveRaf: !adaptiveRaf })
  const resetDefaults = () => {
    set({ dataSaver: false, particlesEnabled: true, prefetchLevel: 'conservative', reduceMotion:false, lessGlow:false, tickerInterval:15000, imageQuality:'balanced', deferAudio:true, progressiveImages:true, backgroundThrottle:true, cacheWarmup:true, fontSlim:true, autoAdapt:true })
    setPrefetchUserOverride(null as any)
    try {
      // Reset theme to a known default (assuming 'default' key exists) else first key
      if (setTheme) setTheme('default')
    } catch(_) {}
  }

  return (
    <Modal onClose={onClose}>
      <Wrapper>
        <Title>Settings</Title>
        {/* Quick Section */}
        <Section>
          <SectionHeader
            $open={openSections.quick}
            onClick={()=>toggleSection('quick')}
            aria-expanded={openSections.quick}
            aria-controls="settings-sec-quick"
          >Quick</SectionHeader>
          <SectionBody $open={openSections.quick}>
            <SectionContentPad id="settings-sec-quick">
          <Row title="Save bandwidth on slow or mobile connections">
            <LabelText>Save Data <span className="badge">BETA</span></LabelText>
            <ToggleShell $on={!!dataSaver} onClick={toggleDataSaver} aria-pressed={!!dataSaver} aria-label="Toggle data saver" />
          </Row>
          <Row title="Toggle particles & background effects">
            <LabelText>Visual Effects</LabelText>
            <ToggleShell $on={particlesEnabled} onClick={toggleParticles} aria-pressed={particlesEnabled} aria-label="Toggle visual effects" />
          </Row>
          <Row title="Reduce animations for comfort & battery">
            <LabelText>Less Motion</LabelText>
            <ToggleShell $on={reduceMotion} onClick={toggleReduceMotion} aria-pressed={reduceMotion} aria-label="Toggle reduced motion" />
          </Row>
          <Row title="Tone down bright glows & heavy shadows">
            <LabelText>Dim Glows</LabelText>
            <ToggleShell $on={lessGlow} onClick={toggleLessGlow} aria-pressed={lessGlow} aria-label="Toggle glow reduction" />
          </Row>
          <Row title="How aggressively to pre-load next screens">
            <LabelText>Load Ahead</LabelText>
            <Segmented>
              {(['off','conservative','aggressive'] as const).map(opt => (
                <SegmentBtn key={opt} $active={prefetchLevel===opt} onClick={()=>set({prefetchLevel:opt})}>{opt==='off'?'Off':opt==='conservative'?'Norm':'Max'}</SegmentBtn>
              ))}
            </Segmented>
          </Row>
          <Row title="Image quality vs speed">
            <LabelText>Images</LabelText>
            <Segmented>
              {(['data','balanced','high'] as const).map(opt => (
                <SegmentBtn key={opt} $active={imageQuality===opt} onClick={()=>set({imageQuality:opt})}>{opt==='data'?'Data':opt==='balanced'?'Std':'High'}</SegmentBtn>
              ))}
            </Segmented>
          </Row>
          <Row title="Price ticker refresh interval">
            <LabelText>Ticker</LabelText>
            <Select value={tickerInterval} onChange={(e: React.ChangeEvent<HTMLSelectElement>)=>set({tickerInterval: Number(e.target.value)})} aria-label="Ticker refresh interval">
              <option value={5000}>5s</option>
              <option value={15000}>15s</option>
              <option value={60000}>60s</option>
              <option value={0}>Manual</option>
            </Select>
          </Row>
          <Row title="Use a subtle blur while large images load">
            <LabelText>Smooth Image Loading</LabelText>
            <ToggleShell $on={progressiveImages} onClick={toggleProgressiveImages} aria-pressed={progressiveImages} />
          </Row>
          <Row title="Automatically tone things down under heavy load">
            <LabelText>Auto Optimize</LabelText>
            <ToggleShell $on={autoAdapt} onClick={toggleAutoAdapt} aria-pressed={autoAdapt} />
          </Row>
          {autoReduced && (
            <div style={{display:'flex', gap:'.4rem', flexWrap:'wrap'}}>
              <button style={{fontSize:'.55rem', background:'#333', color:'#fff', border:'1px solid #555', borderRadius:6, padding:'.3rem .55rem', cursor:'pointer'}} onClick={() => set({ reduceMotion:false, lessGlow:false })}>Restore Visuals</button>
              <button style={{fontSize:'.55rem', background:'#222', color:'#bbb', border:'1px solid #444', borderRadius:6, padding:'.3rem .55rem', cursor:'pointer'}} onClick={() => set({ autoAdapt:false })}>Stop Auto Optimize</button>
            </div>
          )}
          <Note>Tip: Save Data + Less Motion helps on battery & weak networks.</Note>
            </SectionContentPad>
          </SectionBody>
        </Section>
        {/* Appearance Section */}
        <Section>
          <SectionHeader
            $open={openSections.appearance}
            onClick={()=>toggleSection('appearance')}
            aria-expanded={openSections.appearance}
            aria-controls="settings-sec-appearance"
          >Appearance</SectionHeader>
          <SectionBody $open={openSections.appearance}>
            <SectionContentPad id="settings-sec-appearance">
              <div style={{border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'.25rem .4rem'}}>
                <React.Suspense fallback={<div style={{fontSize:'.6rem', opacity:.6, padding:'.4rem'}}>Loading themes…</div>}>
                  <HorizontalScroll>
                    <ThemeSelectorLazy />
                  </HorizontalScroll>
                </React.Suspense>
              </div>
              <Row title="Load fewer font styles for speed">
                <LabelText>Simple Fonts</LabelText>
                <ToggleShell $on={fontSlim} onClick={toggleFontSlim} aria-pressed={fontSlim} />
              </Row>
              <ResetButton onClick={resetDefaults}>RESET DEFAULTS</ResetButton>
            </SectionContentPad>
          </SectionBody>
        </Section>
        {/* Advanced Section */}
        <Section>
          <SectionHeader
            $open={openSections.advanced}
            onClick={()=>toggleSection('advanced')}
            aria-expanded={openSections.advanced}
            aria-controls="settings-sec-advanced"
          >Advanced</SectionHeader>
          <SectionBody $open={openSections.advanced}>
            <SectionContentPad id="settings-sec-advanced">
              <Row title="Delay audio engine until first sound">
                <LabelText>Delay Audio Engine</LabelText>
                <ToggleShell $on={deferAudio} onClick={toggleDeferAudio} aria-pressed={deferAudio} />
              </Row>
              <Row title="Lower internal frame rate under heavy load">
                <LabelText>Adaptive Performance</LabelText>
                <ToggleShell $on={adaptiveRaf} onClick={toggleAdaptiveRaf} aria-pressed={adaptiveRaf} />
              </Row>
              <Row title="Pause timers & loops when tab hidden">
                <LabelText>Pause In Background</LabelText>
                <ToggleShell $on={backgroundThrottle} onClick={toggleBackgroundThrottle} aria-pressed={backgroundThrottle} />
              </Row>
              <Row title="Preload key files after idle to speed next visits">
                <LabelText>Preload Core Files</LabelText>
                <ToggleShell $on={cacheWarmup} onClick={toggleCacheWarmup} aria-pressed={cacheWarmup} />
              </Row>
              <Note>Advanced: change only if you know the trade‑offs.</Note>
            </SectionContentPad>
          </SectionBody>
        </Section>
        {/* About Section */}
        {!isMobile && (
          <Section>
            <StaticHeader>About</StaticHeader>
            <SectionContentPad id="settings-sec-about" style={{paddingTop:'.25rem'}}>
              <div style={{fontSize:'.62rem', opacity:.75, lineHeight:1.25}}>This client runs fully in your browser. Gameplay outcomes are verifiable on‑chain and performance settings stay local (never sent to a server).</div>
              <InfoGrid>
                <MetaChip>Version {typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'}</MetaChip>
                <MetaChip>Chain Solana</MetaChip>
                <MetaChip>Provably Fair</MetaChip>
                <MetaChip>RTP Audited</MetaChip>
                <MetaChip>Adaptive FPS</MetaChip>
                <MetaChip>PWA Ready</MetaChip>
              </InfoGrid>
              <div style={{fontSize:'.58rem', lineHeight:1.25, color:'#c9d6e5'}}>
                <strong style={{fontWeight:600}}>Fairness.</strong> Each game uses cryptographic randomness + on‑chain settlement. Independent RTP audit scripts ship inside the app (see test_scripts).
              </div>
              <div style={{fontSize:'.58rem', lineHeight:1.25, color:'#c9d6e5'}}>
                <strong style={{fontWeight:600}}>Performance.</strong> The platform auto scales visuals under load (Auto Optimize) and can reduce frame work with Adaptive Performance.
              </div>
              <div style={{fontSize:'.58rem', lineHeight:1.25, color:'#c9d6e5'}}>
                <strong style={{fontWeight:600}}>Privacy.</strong> No tracking pixels. Preferences are stored in localStorage only.
              </div>
              <div style={{fontSize:'.58rem', lineHeight:1.25, color:'#c9d6e5'}}>
                <strong style={{fontWeight:600}}>Shortcuts.</strong> Alt + Shift + F: FPS / adaptive overlay. (More coming.)
              </div>
              <div style={{fontSize:'.58rem', lineHeight:1.25, color:'#c9d6e5'}}>
                <strong style={{fontWeight:600}}>Support / Issues.</strong> Open a GitHub issue or reach out via project channels.
              </div>
              <div style={{fontSize:'.58rem', lineHeight:1.25, color:'#c9d6e5'}}>
                <strong style={{fontWeight:600}}>Donate (SOL):</strong> <code style={{fontSize:'.55rem'}}>6o1iE4cKQcjW4UFd4vn35r43qD9LjNDhPGNUMBuS8ocZ</code>
              </div>
            </SectionContentPad>
          </Section>
        )}
      </Wrapper>
    </Modal>
  )
}

export default SettingsModal