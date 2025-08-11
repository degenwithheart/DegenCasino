import React from 'react'
import { GambaUi } from 'gamba-react-ui-v2'

interface BallCountSelectorProps {
  ballCount: number
  onBallCountChange: (count: number) => void
  disabled?: boolean
}

const BALL_COUNT_OPTIONS = [1, 5, 10, 25, 50]

const BallCountSelector: React.FC<BallCountSelectorProps> = ({
  ballCount,
  onBallCountChange,
  disabled = false
}) => {
  return (
    <GambaUi.Select
      options={BALL_COUNT_OPTIONS}
      value={ballCount}
      onChange={onBallCountChange}
      label={(count) => <>{count} Ball{count > 1 ? 's' : ''}</>}
      disabled={disabled}
    />
  )
}

export default BallCountSelector
