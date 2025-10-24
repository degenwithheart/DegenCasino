import React from 'react';
// Allow injected build-time constant from Vite define

declare const __APP_VERSION__: string | undefined;
import { Modal } from '../Modal/Modal';
import { useUserStore } from '../../hooks/data/useUserStore';
import { setPrefetchUserOverride } from '../../hooks/system/usePrefetch';
const ThemeSelectorLazy = React.lazy(() => import('../Theme/ColorSchemeSelector').then(m => ({ default: m.ColorSchemeSelector })));
import { useColorScheme } from '../../themes/ColorSchemeContext';
import { PLATFORM_CREATOR_ADDRESS, FOOTER_LINKS, DEFAULT_COLOR_SCHEME } from '../../constants';
import * as S from './Settings.styles';

interface SettingsModalProps { onClose: () => void; }

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [openSections, setOpenSections] = React.useState({
    quick: false,
    appearance: false,
    advanced: false,
  });
  const toggleSection = (key: keyof typeof openSections) => setOpenSections(s => ({ ...s, [key]: !s[key] }));
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const dataSaver = useUserStore(s => s.dataSaver);
  const particlesEnabled = useUserStore(s => s.particlesEnabled !== false);
  const prefetchLevel = useUserStore(s => s.prefetchLevel || 'conservative');
  const reduceMotion = useUserStore(s => !!s.reduceMotion);
  const lessGlow = useUserStore(s => !!s.lessGlow);
  const tickerInterval = useUserStore(s => s.tickerInterval || 15000);
  const imageQuality = useUserStore(s => s.imageQuality || 'balanced');
  const deferAudio = useUserStore(s => !!s.deferAudio);
  const progressiveImages = useUserStore(s => !!s.progressiveImages);
  const backgroundThrottle = useUserStore(s => !!s.backgroundThrottle);
  const cacheWarmup = useUserStore(s => !!s.cacheWarmup);
  const fontSlim = useUserStore(s => !!s.fontSlim);
  const autoAdapt = useUserStore(s => !!s.autoAdapt);
  const adaptiveRaf = useUserStore(s => s.adaptiveRaf !== false);
  const autoReduced = useUserStore(s => s.autoAdapt && (s.reduceMotion || s.lessGlow));
  const { setColorScheme } = useColorScheme();
  const set = useUserStore(s => s.set);

  // Derived constants for external links & addresses (sourced from main constants file)
  const creatorAddress = React.useMemo(() => {
    try { return PLATFORM_CREATOR_ADDRESS.toBase58(); } catch { return ''; }
  }, []);
  const links = React.useMemo(() => {
    const get = (title: string) => FOOTER_LINKS.find(l => l.title === title)?.href;
    return {
      terms: get('Terms') || '/terms',
      github: get('GitHub') || 'https://github.com/degenwithheart/DegenCasino',
      x: get('X') || 'https://x.com/DegenWithHeart',
    };
  }, []);

  const toggleDataSaver = () => {
    set({ dataSaver: !dataSaver });
    setPrefetchUserOverride(!dataSaver ? false : null as any);
  };
  const toggleParticles = () => set({ particlesEnabled: !particlesEnabled });
  const toggleReduceMotion = () => set({ reduceMotion: !reduceMotion });
  const toggleLessGlow = () => set({ lessGlow: !lessGlow });
  const toggleDeferAudio = () => set({ deferAudio: !deferAudio });
  const toggleProgressiveImages = () => set({ progressiveImages: !progressiveImages });
  const toggleBackgroundThrottle = () => set({ backgroundThrottle: !backgroundThrottle });
  const toggleCacheWarmup = () => set({ cacheWarmup: !cacheWarmup });
  const toggleFontSlim = () => set({ fontSlim: !fontSlim });
  const toggleAutoAdapt = () => set({ autoAdapt: !autoAdapt });
  const toggleAdaptiveRaf = () => set({ adaptiveRaf: !adaptiveRaf });
  const resetDefaults = () => {
    set({ dataSaver: false, particlesEnabled: true, prefetchLevel: 'conservative', reduceMotion: false, lessGlow: false, tickerInterval: 15000, imageQuality: 'balanced', deferAudio: true, progressiveImages: true, backgroundThrottle: true, cacheWarmup: true, fontSlim: true, autoAdapt: true });
    setPrefetchUserOverride(null as any);
    try {
      // Reset colorScheme to the configured default key
      if (setColorScheme) setColorScheme(DEFAULT_COLOR_SCHEME as any);
    } catch (_) {
      // Ignore errors when resetting color scheme
    }
  };

  return (
    <Modal onClose={onClose}>
      <S.Wrapper>
        <S.Title>Settings</S.Title>
        {/* Quick Section */}
        <S.Section>
          <S.SectionHeader
            $open={openSections.quick}
            onClick={() => toggleSection('quick')}
            aria-expanded={openSections.quick}
            aria-controls="settings-sec-quick"
          >Quick</S.SectionHeader>
          <S.SectionBody $open={openSections.quick}>
            <S.SectionContentPad id="settings-sec-quick">
              <S.Row title="Save bandwidth on slow or mobile connections">
                <S.LabelText>Save Data <span className="badge">BETA</span></S.LabelText>
                <S.ToggleShell $on={!!dataSaver} onClick={toggleDataSaver} aria-pressed={!!dataSaver} aria-label="Toggle data saver" />
              </S.Row>
              <S.Row title="Toggle particles & background effects">
                <S.LabelText>Visual Effects</S.LabelText>
                <S.ToggleShell $on={particlesEnabled} onClick={toggleParticles} aria-pressed={particlesEnabled} aria-label="Toggle visual effects" />
              </S.Row>
              <S.Row title="Reduce animations for comfort & battery">
                <S.LabelText>Less Motion</S.LabelText>
                <S.ToggleShell $on={reduceMotion} onClick={toggleReduceMotion} aria-pressed={reduceMotion} aria-label="Toggle reduced motion" />
              </S.Row>
              <S.Row title="Tone down bright glows & heavy shadows">
                <S.LabelText>Dim Glows</S.LabelText>
                <S.ToggleShell $on={lessGlow} onClick={toggleLessGlow} aria-pressed={lessGlow} aria-label="Toggle glow reduction" />
              </S.Row>
              <S.Row title="How aggressively to pre-load next screens">
                <S.LabelText>Load Ahead</S.LabelText>
                <S.Segmented>
                  {(['off', 'conservative', 'aggressive'] as const).map(opt => (
                    <S.SegmentBtn key={opt} $active={prefetchLevel === opt} onClick={() => set({ prefetchLevel: opt })}>{opt === 'off' ? 'Off' : opt === 'conservative' ? 'Norm' : 'Max'}</S.SegmentBtn>
                  ))}
                </S.Segmented>
              </S.Row>
              <S.Row title="Image quality vs speed">
                <S.LabelText>Images</S.LabelText>
                <S.Segmented>
                  {(['data', 'balanced', 'high'] as const).map(opt => (
                    <S.SegmentBtn key={opt} $active={imageQuality === opt} onClick={() => set({ imageQuality: opt })}>{opt === 'data' ? 'Data' : opt === 'balanced' ? 'Std' : 'High'}</S.SegmentBtn>
                  ))}
                </S.Segmented>
              </S.Row>
              <S.Row title="Price ticker refresh interval">
                <S.LabelText>Ticker</S.LabelText>
                <S.Select value={tickerInterval} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => set({ tickerInterval: Number(e.target.value) })} aria-label="Ticker refresh interval">
                  <option value={5000}>5s</option>
                  <option value={15000}>15s</option>
                  <option value={60000}>60s</option>
                  <option value={0}>Manual</option>
                </S.Select>
              </S.Row>
              <S.Row title="Use a subtle blur while large images load">
                <S.LabelText>Smooth Image Loading</S.LabelText>
                <S.ToggleShell $on={progressiveImages} onClick={toggleProgressiveImages} aria-pressed={progressiveImages} />
              </S.Row>
              <S.Row title="Automatically tone things down under heavy load">
                <S.LabelText>Auto Optimize</S.LabelText>
                <S.ToggleShell $on={autoAdapt} onClick={toggleAutoAdapt} aria-pressed={autoAdapt} />
              </S.Row>
              {autoReduced && (
                <div style={{ display: 'flex', gap: '.4rem', flexWrap: 'wrap' }}>
                  <button style={{ fontSize: '.55rem', background: '#333', color: '#fff', border: '1px solid #555', borderRadius: 6, padding: '.3rem .55rem', cursor: 'pointer' }} onClick={() => set({ reduceMotion: false, lessGlow: false })}>Restore Visuals</button>
                  <button style={{ fontSize: '.55rem', background: '#222', color: '#bbb', border: '1px solid #444', borderRadius: 6, padding: '.3rem .55rem', cursor: 'pointer' }} onClick={() => set({ autoAdapt: false })}>Stop Auto Optimize</button>
                </div>
              )}
              <S.Note>Tip: Save Data + Less Motion helps on battery & weak networks.</S.Note>
            </S.SectionContentPad>
          </S.SectionBody>
        </S.Section>
        {/* Appearance Section */}
        <S.Section>
          <S.SectionHeader
            $open={openSections.appearance}
            onClick={() => toggleSection('appearance')}
            aria-expanded={openSections.appearance}
            aria-controls="settings-sec-appearance"
          >Appearance</S.SectionHeader>
          <S.SectionBody $open={openSections.appearance}>
            <S.SectionContentPad id="settings-sec-appearance">
              <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '.25rem .4rem' }}>
                <React.Suspense fallback={<div style={{ fontSize: '.6rem', opacity: .6, padding: '.4rem' }}>Loading themes…</div>}>
                  <S.HorizontalScroll>
                    <ThemeSelectorLazy />
                  </S.HorizontalScroll>
                </React.Suspense>
              </div>
              <S.Row title="Load fewer font styles for speed">
                <S.LabelText>Simple Fonts</S.LabelText>
                <S.ToggleShell $on={fontSlim} onClick={toggleFontSlim} aria-pressed={fontSlim} />
              </S.Row>
              <S.ResetButton onClick={resetDefaults}>RESET DEFAULTS</S.ResetButton>
            </S.SectionContentPad>
          </S.SectionBody>
        </S.Section>
        {/* Advanced Section */}
        <S.Section>
          <S.SectionHeader
            $open={openSections.advanced}
            onClick={() => toggleSection('advanced')}
            aria-expanded={openSections.advanced}
            aria-controls="settings-sec-advanced"
          >Advanced</S.SectionHeader>
          <S.SectionBody $open={openSections.advanced}>
            <S.SectionContentPad id="settings-sec-advanced">
              <S.Row title="Delay audio engine until first sound">
                <S.LabelText>Delay Audio Engine</S.LabelText>
                <S.ToggleShell $on={deferAudio} onClick={toggleDeferAudio} aria-pressed={deferAudio} />
              </S.Row>
              <S.Row title="Lower internal frame rate under heavy load">
                <S.LabelText>Adaptive Performance</S.LabelText>
                <S.ToggleShell $on={adaptiveRaf} onClick={toggleAdaptiveRaf} aria-pressed={adaptiveRaf} />
              </S.Row>
              <S.Row title="Pause timers & loops when tab hidden">
                <S.LabelText>Pause In Background</S.LabelText>
                <S.ToggleShell $on={backgroundThrottle} onClick={toggleBackgroundThrottle} aria-pressed={backgroundThrottle} />
              </S.Row>
              <S.Row title="Preload key files after idle to speed next visits">
                <S.LabelText>Preload Core Files</S.LabelText>
                <S.ToggleShell $on={cacheWarmup} onClick={toggleCacheWarmup} aria-pressed={cacheWarmup} />
              </S.Row>
              <S.Note>Advanced: change only if you know the trade‑offs.</S.Note>
            </S.SectionContentPad>
          </S.SectionBody>
        </S.Section>
        {/* About Section */}
        {!isMobile && (
          <S.Section>
            <S.StaticHeader>About</S.StaticHeader>
            <S.SectionContentPad id="settings-sec-about" style={{ paddingTop: '.25rem' }}>
              <div style={{ fontSize: '.62rem', opacity: .75, lineHeight: 1.25 }}>This client runs fully in your browser. Gameplay outcomes are verifiable on‑chain and performance settings stay local (never sent to a server).</div>
              <S.InfoGrid>
                <S.MetaChip>Version {typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'}</S.MetaChip>
                <S.MetaChip>Chain Solana</S.MetaChip>
                <S.MetaChip>Provably Fair</S.MetaChip>
                <S.MetaChip>RTP Audited</S.MetaChip>
                <S.MetaChip>Adaptive FPS</S.MetaChip>
                <S.MetaChip>PWA Ready</S.MetaChip>
              </S.InfoGrid>
              <div style={{ fontSize: '.58rem', lineHeight: 1.25, color: '#c9d6e5' }}>
                <strong style={{ fontWeight: 600 }}>Fairness.</strong> Each game uses cryptographic randomness + on‑chain settlement. Independent RTP audit scripts ship inside the app (see test_scripts).
              </div>
              <div style={{ fontSize: '.58rem', lineHeight: 1.25, color: '#c9d6e5' }}>
                <strong style={{ fontWeight: 600 }}>Performance.</strong> The platform auto scales visuals under load (Auto Optimize) and can reduce frame work with Adaptive Performance.
              </div>
              <div style={{ fontSize: '.58rem', lineHeight: 1.25, color: '#c9d6e5' }}>
                <strong style={{ fontWeight: 600 }}>Terms.</strong> By playing you accept the <a href={links.terms} style={{ color: '#fff', textDecoration: 'underline' }}>platform terms</a> & basic fair‑play rules.
              </div>
              <div style={{ fontSize: '.58rem', lineHeight: 1.25, color: '#c9d6e5' }}>
                <strong style={{ fontWeight: 600 }}>Shortcuts.</strong> Alt + Shift + F: FPS / adaptive overlay. (More coming.)
              </div>
              <div style={{ fontSize: '.58rem', lineHeight: 1.25, color: '#c9d6e5' }}>
                <strong style={{ fontWeight: 600 }}>Support.</strong> Reach out on <a href={links.x} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>X</a>.
              </div>
              <div style={{ fontSize: '.58rem', lineHeight: 1.25, color: '#c9d6e5' }}>
                <strong style={{ fontWeight: 600 }}>Issues.</strong> Report bugs at <a href={links.github} target="_blank" rel="noopener noreferrer" style={{ color: '#fff', textDecoration: 'underline' }}>GitHub</a>.
              </div>
              <div style={{ fontSize: '.58rem', lineHeight: 1.25, color: '#c9d6e5' }}>
                <strong style={{ fontWeight: 600 }}>Donate (SOL):</strong> <code style={{ fontSize: '.55rem' }}>{creatorAddress}</code>
              </div>
            </S.SectionContentPad>
          </S.Section>
        )}
      </S.Wrapper>
    </Modal>
  );
};

export default SettingsModal;