import React from 'react'
import * as S from './Toasts.styles'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useToastStore, type Toast as TToast } from '../hooks/useToast'

function Toast({ toast }: {toast: TToast}) {
  const timeout = React.useRef<ReturnType<typeof setTimeout>>()
  const discard = useToastStore((state) => state.discard)
  const [ticking, setTicking] = React.useState(true)

  React.useLayoutEffect(
    () => {
      timeout.current = setTimeout(() => {
        discard(toast.id)
      }, 10000)
      return () => clearTimeout(timeout.current)
    },
    [toast.id],
  )

  const pauseTimer = () => {
    setTicking(false)
    clearTimeout(timeout.current)
  }
  const resumeTimer = () => {
    setTicking(true)
    timeout.current = setTimeout(() => {
      discard(toast.id)
    }, 10000)
  }

  return (
    <S.StyledToast
      onClick={() => discard(toast.id)}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
    >
      <div>
        <div style={{ 
          fontWeight: '700',
          fontSize: '1.1em',
          background: 'linear-gradient(135deg, #ffd700, #ff6b9d, #9564ff)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
          marginBottom: '4px',
          lineHeight: '1.3'
        }}>
          {toast.title}
        </div>
        <div style={{ 
          color: 'rgba(255, 255, 255, 0.85)', 
          fontSize: '0.92em',
          lineHeight: '1.4',
          fontWeight: '400'
        }}>
          {toast.description}
        </div>
        {toast.link && (
          <div style={{
            marginTop: '8px',
            fontSize: '0.85em',
            color: '#9564ff',
            textDecoration: 'underline',
            opacity: 0.9
          }}>
            View Transaction →
          </div>
        )}
      </div>
      <S.StyledTimer $ticking={ticking} />
    </S.StyledToast>
  )
}

export default function Toasts() {
  const toasts = useToastStore((state) => [...state.toasts].reverse())
  const showAll = useMediaQuery('sm')

  const visible = showAll ? toasts : toasts.slice(0, 1)

  return (
    <S.StyledToasts>
      {visible.map((toast, i) => (
        <Toast toast={toast} key={toast.id} />
      ))}
      {!showAll && toasts.length > 1 && (
        <S.StackedToast />
      )}
    </S.StyledToasts>
  )
}
