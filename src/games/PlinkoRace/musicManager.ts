import { useSoundStore } from 'gamba-react-ui-v2';

type Unsub = () => void;

export const musicManager = {
  sound: null as any,
  count: 0,
  timer: 0 as any,
  sub: null as Unsub | null,
  muted: false,
};

try {
  const saved = localStorage.getItem('plinkorace_music_muted');
  if (saved != null) musicManager.muted = saved === '1';
} catch {
  // Ignore localStorage errors
}

export function attachMusic(snd: any) {
  musicManager.sound = snd;

  const vol = useSoundStore.getState().volume;
  snd.gain.set({ gain: musicManager.muted ? 0 : vol });

  if (!musicManager.sub) {
    musicManager.sub = useSoundStore.subscribe((state: { volume: number; }) => {
      if (musicManager.sound) {
        musicManager.sound.gain.set({ gain: musicManager.muted ? 0 : state.volume });
      }
    });
  }
}

export function stopAndDispose() {
  try { musicManager.sound?.player.stop(); } catch {
    // Ignore audio stop errors
  }
  musicManager.sound = null;

  musicManager.sub?.();
  musicManager.sub = null;
}

export function setMuted(muted: boolean) {
  musicManager.muted = muted;
  try { localStorage.setItem('plinkorace_music_muted', muted ? '1' : '0'); } catch {
    // Ignore localStorage errors
  }
  const vol = useSoundStore.getState().volume;
  try { musicManager.sound?.gain.set({ gain: muted ? 0 : vol }); } catch {
    // Ignore audio gain setting errors
  }
}

export function toggleMuted() {
  setMuted(!musicManager.muted);
}
