import React from 'react'
import { motion } from 'framer-motion'

interface CardProps {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades'
  value: string
  isHidden?: boolean
  className?: string
}

export const PlayingCard: React.FC<CardProps> = ({ 
  suit, 
  value, 
  isHidden = false, 
  className = "" 
}) => {
  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case 'hearts': return '♥️'
      case 'diamonds': return '♦️'
      case 'clubs': return '♣️'
      case 'spades': return '♠️'
      default: return '?'
    }
  }

  const getSuitColor = (suit: string) => {
    return suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-black'
  }

  return (
    <motion.div
      className={`relative w-20 h-28 bg-white rounded-lg border-2 border-gray-300 shadow-lg ${className}`}
      whileHover={{ scale: 1.05, rotate: 2 }}
      initial={{ rotateY: 180 }}
      animate={{ rotateY: isHidden ? 180 : 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Card Back */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-800 to-purple-900 rounded-lg flex items-center justify-center"
        style={{ backfaceVisibility: 'hidden' }}
      >
        <div className="text-white text-xs font-bold opacity-30">🎰</div>
      </div>
      
      {/* Card Front */}
      <div 
        className="absolute inset-0 bg-white rounded-lg p-2 flex flex-col justify-between"
        style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
      >
        <div className={`text-left ${getSuitColor(suit)}`}>
          <div className="text-sm font-bold">{value}</div>
          <div className="text-lg leading-none">{getSuitSymbol(suit)}</div>
        </div>
        
        <div className={`text-center ${getSuitColor(suit)} text-2xl`}>
          {getSuitSymbol(suit)}
        </div>
        
        <div className={`text-right ${getSuitColor(suit)} transform rotate-180`}>
          <div className="text-sm font-bold">{value}</div>
          <div className="text-lg leading-none">{getSuitSymbol(suit)}</div>
        </div>
      </div>
    </motion.div>
  )
}

interface HandProps {
  cards: Array<{ suit: 'hearts' | 'diamonds' | 'clubs' | 'spades', value: string }>
  isDealer?: boolean
  hideFirstCard?: boolean
}

export const CardHand: React.FC<HandProps> = ({ 
  cards, 
  isDealer = false, 
  hideFirstCard = false 
}) => {
  return (
    <div className="flex space-x-2">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ x: -100, opacity: 0, rotateY: 180 }}
          animate={{ x: 0, opacity: 1, rotateY: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: index * 0.3,
            ease: "backOut"
          }}
        >
          <PlayingCard
            suit={card.suit}
            value={card.value}
            isHidden={isDealer && index === 0 && hideFirstCard}
            className={index > 0 ? `-ml-4` : ''}
          />
        </motion.div>
      ))}
    </div>
  )
}

interface ChipProps {
  value: number
  color: string
  count?: number
}

export const CasinoChip: React.FC<ChipProps> = ({ value, color, count = 1 }) => {
  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-12 h-12 rounded-full border-4 border-white shadow-lg flex items-center justify-center font-bold text-white text-xs`}
          style={{ 
            backgroundColor: color,
            top: `-${i * 2}px`,
            zIndex: count - i 
          }}
          animate={{ 
            rotate: [0, 5, -5, 0],
            y: [0, -2, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1 
          }}
        >
          {value}
        </motion.div>
      ))}
    </motion.div>
  )
}
