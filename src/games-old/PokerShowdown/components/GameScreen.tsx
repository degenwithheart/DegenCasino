import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Card, PlayerResult, GameResult } from '../types'
import { CANVAS_WIDTH, CANVAS_HEIGHT, CARD_WIDTH, CARD_HEIGHT, SEAT_POSITIONS, POKER_COLORS } from '../constants'

const GameCanvas = styled.canvas`
  border: 3px solid ${POKER_COLORS.gold};
  border-radius: 15px;
  background: ${POKER_COLORS.table};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
`

const GameContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: ${POKER_COLORS.background};
`

interface GameScreenProps {
  gameResult: GameResult | null
  currentPhase: 'dealing' | 'drawing' | 'showdown' | 'results'
  playerNames: string[]
  onAnimationComplete?: () => void
}

export default function GameScreen({
  gameResult,
  currentPhase,
  playerNames,
  onAnimationComplete
}: GameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [animationStep, setAnimationStep] = useState(0)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT

    drawGame(ctx)

    if (currentPhase === 'dealing' || currentPhase === 'drawing' || currentPhase === 'showdown') {
      animatePhase()
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gameResult, currentPhase, animationStep])

  const drawGame = (ctx: CanvasRenderingContext2D) => {
    // Clear canvas
    ctx.fillStyle = POKER_COLORS.table
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

    // Draw poker table
    drawTable(ctx)

    if (gameResult) {
      // Draw player positions and cards
      gameResult.players.forEach((player, index) => {
        drawPlayerPosition(ctx, player, index, playerNames[index] || `Player ${index + 1}`)
      })

      // Draw pot in center
      drawCenterPot(ctx, gameResult.totalPot)
    } else {
      // Draw empty table
      drawEmptyPositions(ctx)
    }
  }

  const drawTable = (ctx: CanvasRenderingContext2D) => {
    const centerX = CANVAS_WIDTH / 2
    const centerY = CANVAS_HEIGHT / 2
    const tableRadius = 280

    // Draw table surface
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, tableRadius, tableRadius * 0.7, 0, 0, Math.PI * 2)
    ctx.fillStyle = POKER_COLORS.felt
    ctx.fill()

    // Draw table border
    ctx.strokeStyle = POKER_COLORS.gold
    ctx.lineWidth = 8
    ctx.stroke()

    // Draw inner border
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, tableRadius - 20, tableRadius * 0.7 - 15, 0, 0, Math.PI * 2)
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)'
    ctx.lineWidth = 2
    ctx.stroke()
  }

  const drawPlayerPosition = (ctx: CanvasRenderingContext2D, player: PlayerResult, index: number, name: string) => {
    const centerX = CANVAS_WIDTH / 2
    const centerY = CANVAS_HEIGHT / 2
    const position = SEAT_POSITIONS[index]
    
    if (!position) return

    const seatX = centerX + position.x
    const seatY = centerY + position.y

    // Draw player name
    ctx.fillStyle = POKER_COLORS.text
    ctx.font = 'bold 16px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(name, seatX, seatY - 100)

    // Draw winner indicator
    if (player.isWinner) {
      ctx.fillStyle = POKER_COLORS.gold
      ctx.font = 'bold 20px Arial'
      ctx.fillText('🏆 WINNER! 🏆', seatX, seatY - 120)
    }

    // Draw cards
    if (currentPhase === 'results' || currentPhase === 'showdown') {
      drawPlayerCards(ctx, player.finalHand, seatX - (5 * (CARD_WIDTH * 0.6 + 5)) / 2, seatY - 40, true)
      
      // Draw hand name
      ctx.fillStyle = player.isWinner ? POKER_COLORS.gold : POKER_COLORS.text
      ctx.font = 'bold 14px Arial'
      ctx.fillText(player.handEval.name, seatX, seatY + 60)
    } else if (currentPhase === 'dealing') {
      drawPlayerCards(ctx, player.initialHand, seatX - (5 * (CARD_WIDTH * 0.6 + 5)) / 2, seatY - 40, false)
    }

    // Draw discard indicators if in drawing phase
    if (currentPhase === 'drawing') {
      drawDiscardIndicators(ctx, player, seatX - (5 * (CARD_WIDTH * 0.6 + 5)) / 2, seatY - 40)
    }
  }

  const drawPlayerCards = (ctx: CanvasRenderingContext2D, cards: Card[], startX: number, startY: number, revealed: boolean) => {
    const cardScale = 0.6
    const cardSpacing = 5
    const scaledWidth = CARD_WIDTH * cardScale
    const scaledHeight = CARD_HEIGHT * cardScale

    cards.forEach((card, index) => {
      const cardX = startX + index * (scaledWidth + cardSpacing)
      const cardY = startY

      drawCard(ctx, card, cardX, cardY, scaledWidth, scaledHeight, revealed)
    })
  }

  const drawCard = (ctx: CanvasRenderingContext2D, card: Card, x: number, y: number, width: number, height: number, revealed: boolean) => {
    // Card background
    ctx.fillStyle = revealed ? '#ffffff' : POKER_COLORS.cardBack
    ctx.strokeStyle = POKER_COLORS.gold
    ctx.lineWidth = 2

    // Draw rounded rectangle
    ctx.beginPath()
    ctx.roundRect(x, y, width, height, 8)
    ctx.fill()
    ctx.stroke()

    if (revealed && card) {
      const suitSymbols = ['♠', '♥', '♦', '♣']
      const rankSymbols = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K']
      
      // Determine suit color
      const suitColor = (card.suit === 1 || card.suit === 2) ? '#e53935' : '#1a1a1a' // Hearts/Diamonds red, Clubs/Spades black
      ctx.fillStyle = suitColor

      // Draw rank (top-left)
      ctx.font = `bold ${Math.floor(width * 0.12)}px Arial`
      ctx.textAlign = 'left'
      ctx.fillText(rankSymbols[card.rank] || 'A', x + width * 0.08, y + height * 0.15)

      // Draw suit (center)
      ctx.font = `${Math.floor(width * 0.25)}px Arial`
      ctx.textAlign = 'center'
      ctx.fillText(suitSymbols[card.suit] || '♠', x + width / 2, y + height / 2 + width * 0.08)

      // Draw rank and suit (bottom-right, rotated)
      ctx.save()
      ctx.translate(x + width * 0.92, y + height * 0.85)
      ctx.rotate(Math.PI)
      ctx.font = `bold ${Math.floor(width * 0.12)}px Arial`
      ctx.textAlign = 'left'
      ctx.fillText(rankSymbols[card.rank] || 'A', 0, 0)
      ctx.restore()
    } else if (!revealed) {
      // Draw card back pattern
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.font = `${Math.floor(width * 0.15)}px Arial`
      ctx.textAlign = 'center'
      ctx.fillText('🂠', x + width / 2, y + height / 2 + width * 0.05)
    }
  }

  const drawDiscardIndicators = (ctx: CanvasRenderingContext2D, player: PlayerResult, startX: number, startY: number) => {
    const cardScale = 0.6
    const cardSpacing = 5
    const scaledWidth = CARD_WIDTH * cardScale
    const scaledHeight = CARD_HEIGHT * cardScale

    player.discardIndices.forEach((discardIndex) => {
      const cardX = startX + discardIndex * (scaledWidth + cardSpacing)
      const cardY = startY

      // Draw discard indicator
      ctx.fillStyle = 'rgba(255, 0, 0, 0.7)'
      ctx.fillRect(cardX, cardY, scaledWidth, scaledHeight)
      
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('DISCARD', cardX + scaledWidth / 2, cardY + scaledHeight / 2)
    })
  }

  const drawEmptyPositions = (ctx: CanvasRenderingContext2D) => {
    const centerX = CANVAS_WIDTH / 2
    const centerY = CANVAS_HEIGHT / 2

    SEAT_POSITIONS.forEach((position, index) => {
      const seatX = centerX + position.x
      const seatY = centerY + position.y

      // Draw empty seat
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)'
      ctx.setLineDash([5, 5])
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.ellipse(seatX, seatY, 60, 40, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '14px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`Seat ${index + 1}`, seatX, seatY)
    })
  }

  const drawCenterPot = (ctx: CanvasRenderingContext2D, totalPot: number) => {
    const centerX = CANVAS_WIDTH / 2
    const centerY = CANVAS_HEIGHT / 2

    // Draw pot background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, 80, 40, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = POKER_COLORS.gold
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw pot text
    ctx.fillStyle = POKER_COLORS.gold
    ctx.font = 'bold 18px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('POT', centerX, centerY - 5)
    
    ctx.fillStyle = POKER_COLORS.text
    ctx.font = '14px Arial'
    const potValue = (totalPot / 1000000000).toFixed(3)
    ctx.fillText(`${potValue} SOL`, centerX, centerY + 15)
  }

  const animatePhase = () => {
    // Simple animation counter
    animationRef.current = requestAnimationFrame(() => {
      setAnimationStep(prev => prev + 1)
      
      // Complete animation after some steps
      if (animationStep > 60) { // ~1 second at 60fps
        onAnimationComplete?.()
      }
    })
  }

  return (
    <GameContainer>
      <GameCanvas ref={canvasRef} />
    </GameContainer>
  )
}