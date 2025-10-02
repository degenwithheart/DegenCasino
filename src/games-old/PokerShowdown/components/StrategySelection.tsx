import React, { useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { GambaUi } from 'gamba-react-ui-v2'
import { DrawStrategy, STRATEGY_PRESETS } from '../types'
import { STRATEGY_DESCRIPTIONS, POKER_COLORS } from '../constants'

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 25px rgba(255, 215, 0, 0.6);
  }
`

const StrategyContainer = styled.div`
  background: linear-gradient(135deg, ${POKER_COLORS.felt} 0%, ${POKER_COLORS.table} 100%);
  width: 100%;
  height: 100%;
  padding: 30px;
  position: relative;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.h2`
  color: ${POKER_COLORS.gold};
  text-align: center;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`

const StrategyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`

const StrategyCard = styled.div<{ $selected: boolean }>`
  background: linear-gradient(135deg, rgba(26, 107, 58, 0.8) 0%, rgba(13, 90, 45, 0.9) 100%);
  border: 3px solid ${props => props.$selected ? POKER_COLORS.gold : 'rgba(255, 215, 0, 0.3)'};
  border-radius: 15px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  ${props => props.$selected && css`
    animation: ${glowPulse} 2s infinite;
    transform: scale(1.05);
  `}
  
  &:hover {
    transform: translateY(-5px) ${props => props.$selected ? 'scale(1.05)' : 'scale(1.02)'};
    border-color: ${POKER_COLORS.gold};
  }
`

const StrategyName = styled.h3`
  color: ${POKER_COLORS.gold};
  margin-bottom: 15px;
  font-size: 22px;
  font-weight: bold;
`

const StrategyDescription = styled.p`
  color: ${POKER_COLORS.text};
  margin-bottom: 20px;
  line-height: 1.5;
  font-size: 16px;
`

const StrategyDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
`

const StrategyOption = styled.div<{ $enabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '${props => props.$enabled ? '✓' : '✗'}';
    color: ${props => props.$enabled ? '#4caf50' : '#f44336'};
    font-weight: bold;
    font-size: 16px;
  }
`

const CustomStrategySection = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  padding: 25px;
  border: 2px solid rgba(255, 215, 0, 0.2);
`

const CustomTitle = styled.h3`
  color: ${POKER_COLORS.gold};
  margin-bottom: 20px;
  font-size: 20px;
`

const CustomOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`

const CheckboxOption = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  color: ${POKER_COLORS.text};
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: ${POKER_COLORS.gold};
  }
`

const RiskLevelSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`

const RiskButton = styled.button<{ $selected: boolean }>`
  padding: 12px 20px;
  border: 2px solid ${props => props.$selected ? POKER_COLORS.gold : 'rgba(255, 215, 0, 0.3)'};
  background: ${props => props.$selected ? POKER_COLORS.gold : 'transparent'};
  color: ${props => props.$selected ? POKER_COLORS.background : POKER_COLORS.text};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  
  &:hover {
    border-color: ${POKER_COLORS.gold};
    background: ${props => props.$selected ? POKER_COLORS.gold : 'rgba(255, 215, 0, 0.1)'};
  }
`

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
`

const ActionButton = styled.button<{ $primary?: boolean }>`
  padding: 15px 30px;
  border: 2px solid ${props => props.$primary ? POKER_COLORS.accent : POKER_COLORS.gold};
  background: ${props => props.$primary ? POKER_COLORS.accent : 'transparent'};
  color: ${POKER_COLORS.text};
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.$primary ? POKER_COLORS.accent : POKER_COLORS.gold};
    color: ${props => props.$primary ? POKER_COLORS.text : POKER_COLORS.background};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`

interface StrategySelectionProps {
  selectedStrategy: DrawStrategy
  onStrategySelect: (strategy: DrawStrategy) => void
  onConfirm: () => void
  onCancel: () => void
  timeRemaining?: number
}

export default function StrategySelection({
  selectedStrategy,
  onStrategySelect,
  onConfirm,
  onCancel,
  timeRemaining = 0
}: StrategySelectionProps) {
  const [showCustom, setShowCustom] = useState(false)
  const [customStrategy, setCustomStrategy] = useState<DrawStrategy>(selectedStrategy)

  const handlePresetSelect = (presetName: keyof typeof STRATEGY_PRESETS) => {
    const strategy = STRATEGY_PRESETS[presetName]
    onStrategySelect(strategy)
    setShowCustom(false)
  }

  const handleCustomToggle = () => {
    setShowCustom(!showCustom)
    if (!showCustom) {
      setCustomStrategy(selectedStrategy)
    }
  }

  const updateCustomStrategy = (updates: Partial<DrawStrategy>) => {
    const updated = { ...customStrategy, ...updates }
    setCustomStrategy(updated)
    onStrategySelect(updated)
  }

  const isPresetSelected = (presetName: keyof typeof STRATEGY_PRESETS) => {
    const preset = STRATEGY_PRESETS[presetName]
    return !showCustom && 
           preset.keepPairs === selectedStrategy.keepPairs &&
           preset.keepHighCards === selectedStrategy.keepHighCards &&
           preset.drawToFlush === selectedStrategy.drawToFlush &&
           preset.drawToStraight === selectedStrategy.drawToStraight &&
           preset.riskLevel === selectedStrategy.riskLevel
  }

  return (
    <>
      {/* Screen Portal */}
      <GambaUi.Portal target="screen">
        <StrategyContainer>
          <Title>
            Choose Your Strategy
            {timeRemaining > 0 && ` (${timeRemaining}s)`}
          </Title>

          <StrategyGrid>
            {Object.entries(STRATEGY_PRESETS).map(([name, strategy]) => (
              <StrategyCard
                key={name}
                $selected={isPresetSelected(name as keyof typeof STRATEGY_PRESETS)}
                onClick={() => handlePresetSelect(name as keyof typeof STRATEGY_PRESETS)}
              >
                <StrategyName>{name}</StrategyName>
                <StrategyDescription>
                  {STRATEGY_DESCRIPTIONS[name as keyof typeof STRATEGY_DESCRIPTIONS]}
                </StrategyDescription>
                <StrategyDetails>
                  <StrategyOption $enabled={strategy.keepPairs}>
                    Keep pairs or better
                  </StrategyOption>
                  <StrategyOption $enabled={strategy.keepHighCards}>
                    Keep high cards (T, J, Q, K, A)
                  </StrategyOption>
                  <StrategyOption $enabled={strategy.drawToFlush}>
                    Draw to flush opportunities
                  </StrategyOption>
                  <StrategyOption $enabled={strategy.drawToStraight}>
                    Draw to straight opportunities
                  </StrategyOption>
                  <div style={{ marginTop: '10px', fontWeight: 'bold', color: POKER_COLORS.gold }}>
                    Risk Level: {strategy.riskLevel.toUpperCase()}
                  </div>
                </StrategyDetails>
              </StrategyCard>
            ))}
          </StrategyGrid>

          <CustomStrategySection>
            <CustomTitle>
              <input
                type="checkbox"
                checked={showCustom}
                onChange={handleCustomToggle}
                style={{ marginRight: '10px' }}
              />
              Custom Strategy
            </CustomTitle>

            {showCustom && (
              <>
                <CustomOptions>
                  <CheckboxOption>
                    <input
                      type="checkbox"
                      checked={customStrategy.keepPairs}
                      onChange={(e) => updateCustomStrategy({ keepPairs: e.target.checked })}
                    />
                    Always keep pairs or better
                  </CheckboxOption>
                  
                  <CheckboxOption>
                    <input
                      type="checkbox"
                      checked={customStrategy.keepHighCards}
                      onChange={(e) => updateCustomStrategy({ keepHighCards: e.target.checked })}
                    />
                    Keep high cards (10, J, Q, K, A)
                  </CheckboxOption>
                  
                  <CheckboxOption>
                    <input
                      type="checkbox"
                      checked={customStrategy.drawToFlush}
                      onChange={(e) => updateCustomStrategy({ drawToFlush: e.target.checked })}
                    />
                    Draw to flush draws (4 suited)
                  </CheckboxOption>
                  
                  <CheckboxOption>
                    <input
                      type="checkbox"
                      checked={customStrategy.drawToStraight}
                      onChange={(e) => updateCustomStrategy({ drawToStraight: e.target.checked })}
                    />
                    Draw to straight draws
                  </CheckboxOption>
                </CustomOptions>

                <div>
                  <CustomTitle style={{ marginBottom: '10px', fontSize: '16px' }}>Risk Level:</CustomTitle>
                  <RiskLevelSelector>
                    {(['conservative', 'balanced', 'aggressive'] as const).map(level => (
                      <RiskButton
                        key={level}
                        $selected={customStrategy.riskLevel === level}
                        onClick={() => updateCustomStrategy({ riskLevel: level })}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </RiskButton>
                    ))}
                  </RiskLevelSelector>
                </div>
              </>
            )}
          </CustomStrategySection>

          <ActionButtons>
            <ActionButton onClick={onCancel}>
              Back to Lobby
            </ActionButton>
            <ActionButton $primary onClick={onConfirm}>
              Confirm Strategy
            </ActionButton>
          </ActionButtons>
        </StrategyContainer>
      </GambaUi.Portal>
    </>
  )
}