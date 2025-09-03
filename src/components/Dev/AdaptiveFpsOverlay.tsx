import React, { useEffect, useState } from 'react'
import { subscribeRaf, getAdaptiveState, setAdaptiveRaf } from '../../utils/rafScheduler'
import { useUserStore } from '../../hooks/useUserStore'

export const AdaptiveFpsOverlay: React.FC = () => {
  const adaptiveEnabled = useUserStore(s => s.adaptiveRaf !== false)
  const [fps, setFps] = useState(0)
  const [avgFrame, setAvgFrame] = useState(0)
  const [scale, setScale] = useState(1)
  const [frames, setFrames] = useState(0)
  const [lastT, setLastT] = useState(performance.now())
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // keyboard toggle: shift+alt+F
    const handler = (e: KeyboardEvent) => {
      if (e.key.toLowerCase()==='f' && e.altKey && e.shiftKey) {
        setVisible(v=>!v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    setAdaptiveRaf(adaptiveEnabled)
  }, [adaptiveEnabled])

  useEffect(() => {
    if (!visible) return
    const unsub = subscribeRaf((_dt, now) => {
      const f = frames + 1
      if (now - lastT >= 1000) {
        setFps(f)
        setFrames(0)
        setLastT(now)
        const st = getAdaptiveState()
        setScale(st.dynamicScale)
        setAvgFrame(st.avgFrame)
      } else {
        setFrames(f)
      }
    }, 60, { forceForeground: true })
    return () => unsub()
  }, [visible, frames, lastT])

  if (!visible) return null
  return (
    <div style={{
      position:'fixed', bottom:10, right:10, zIndex:9999, fontFamily:'monospace', fontSize:11,
      background:'rgba(0,0,0,0.65)', color:'#0ff', padding:'6px 8px', border:'1px solid #0ff', borderRadius:6,
      boxShadow:'0 0 8px #0ff'
    }}>
      <div style={{fontWeight:600, marginBottom:2}}>Adaptive FPS</div>
      <div>FPS: {fps}</div>
      <div>Scale: {scale.toFixed(2)}</div>
      <div>Avg Frame: {avgFrame.toFixed(1)}ms</div>
      <div style={{opacity:.5}}>Shift+Alt+F to toggle</div>
      <div style={{marginTop:4}}>
        <label style={{display:'flex', gap:4, alignItems:'center', cursor:'pointer'}}>
          <input type="checkbox" checked={adaptiveEnabled} onChange={() => useUserStore.getState().set({ adaptiveRaf: !adaptiveEnabled })} /> enabled
        </label>
      </div>
    </div>
  )
}

export default AdaptiveFpsOverlay