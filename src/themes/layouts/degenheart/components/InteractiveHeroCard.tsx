import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InteractiveHeroCardProps {
  card: {
    id: string;
    title: string;
    leftLabel: string;
    left: string[];
    rightLabel: string;
    right: string[];
    footer: string;
  };
  onComplete?: (choice: 'degenheart' | 'traditional') => void;
}

export function InteractiveHeroCard({ card, onComplete }: InteractiveHeroCardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [userChoices, setUserChoices] = useState<Array<'degenheart' | 'traditional'>>([]);
  const [showResult, setShowResult] = useState(false);

  // Generate dynamic steps based on the card data
  const generateSteps = (card: InteractiveHeroCardProps['card']) => {
    const cardQuestions = {
      ownership: [
        {
          question: "How important is true ownership of your funds to you?",
          degenheart: { text: "Critical - my wallet controls everything", icon: "🔐" },
          traditional: { text: "Convenient access is more important", icon: "🎰" }
        },
        {
          question: "Do you trust platforms to hold your money safely?",
          degenheart: { text: "Never - self-custody only", icon: "🛡️" },
          traditional: { text: "Yes, they have security measures", icon: "🏦" }
        }
      ],
      transparency: [
        {
          question: "How much do you care about seeing how games work?",
          degenheart: { text: "Everything must be verifiable on-chain", icon: "�" },
          traditional: { text: "As long as it's fair, I don't need details", icon: "🎲" }
        },
        {
          question: "Would you play if you couldn't audit the game logic?",
          degenheart: { text: "Absolutely not - transparency is key", icon: "📊" },
          traditional: { text: "Yes, if it has good reviews", icon: "⭐" }
        }
      ],
      accountless: [
        {
          question: "How do you feel about creating accounts for gambling?",
          degenheart: { text: "Hate it - connect wallet and go", icon: "🚫" },
          traditional: { text: "It's standard, I'm used to it", icon: "📝" }
        },
        {
          question: "Is KYC and identity verification acceptable?",
          degenheart: { text: "Never - privacy comes first", icon: "�" },
          traditional: { text: "If required for large wins, okay", icon: "✅" }
        }
      ],
      instant: [
        {
          question: "How long are you willing to wait for withdrawals?",
          degenheart: { text: "Instant only - blockchain speed", icon: "⚡" },
          traditional: { text: "A few days is acceptable", icon: "⏳" }
        },
        {
          question: "What matters more: speed or convenience?",
          degenheart: { text: "Speed and instant access", icon: "💨" },
          traditional: { text: "Convenience and familiarity", icon: "🪑" }
        }
      ],
      ethos: [
        {
          question: "Do you prefer pure Web3 or hybrid approaches?",
          degenheart: { text: "Pure Web3 - no compromises", icon: "🌐" },
          traditional: { text: "Hybrid works if it functions well", icon: "🔄" }
        },
        {
          question: "How important is complete decentralization?",
          degenheart: { text: "Essential - total user sovereignty", icon: "👑" },
          traditional: { text: "Nice to have, but not critical", icon: "🤝" }
        }
      ]
    };

    return cardQuestions[card.id as keyof typeof cardQuestions] || cardQuestions.ownership;
  };

  const steps = generateSteps(card);

  const handleChoice = (choice: 'degenheart' | 'traditional') => {
    const newChoices = [...userChoices, choice];
    setUserChoices(newChoices);

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate result
      const degenheartCount = newChoices.filter(c => c === 'degenheart').length;
      const finalChoice = degenheartCount >= 2 ? 'degenheart' : 'traditional';
      setShowResult(true);
      onComplete?.(finalChoice);
    }
  };

  const resetJourney = () => {
    setCurrentStep(0);
    setUserChoices([]);
    setShowResult(false);
  };

  if (showResult) {
    const degenheartCount = userChoices.filter(c => c === 'degenheart').length;
    const isDegenHeart = degenheartCount >= 2;

    return (
      <motion.div
        className="interactive-hero-card result"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          width: '250px',
          height: '250px',
          background: isDegenHeart
            ? 'linear-gradient(135deg, rgba(139, 90, 158, 0.9), rgba(184, 51, 106, 0.9))'
            : 'linear-gradient(135deg, rgba(107, 114, 128, 0.9), rgba(75, 85, 99, 0.9))',
          borderRadius: '20px',
          padding: '15px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: 'white',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          border: '2px solid rgba(255,255,255,0.1)',
          position: 'relative'
        }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          style={{ fontSize: '2.5rem', marginBottom: '10px' }}
        >
          {isDegenHeart ? '🚀' : '🎭'}
        </motion.div>

        <h3 style={{
          fontSize: '1rem',
          fontWeight: 'bold',
          marginBottom: '8px',
          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
          lineHeight: 1.2
        }}>
          {isDegenHeart ? `${card.title} - DegenHeart Way!` : 'Traditional Path Chosen'}
        </h3>

        <p style={{
          fontSize: '0.8rem',
          opacity: 0.9,
          marginBottom: '15px',
          lineHeight: 1.3,
          padding: '0 5px'
        }}>
          {isDegenHeart
            ? card.footer
            : 'The familiar path awaits. Easy access with traditional terms.'
          }
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetJourney}
          style={{
            padding: '6px 12px',
            background: 'rgba(255,255,255,0.2)',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '15px',
            color: 'white',
            fontSize: '0.7rem',
            fontWeight: '600',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  const currentStepData = steps[currentStep];

  return (
    <motion.div
      className="interactive-hero-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        width: '250px',
        height: '250px',
        background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.95), rgba(40, 40, 60, 0.95))',
        borderRadius: '20px',
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
        border: '2px solid rgba(255,255,255,0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Progress indicator */}
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '8px',
        right: '8px',
        height: '3px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '2px'
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #8b5a9e, #b8336a)',
            borderRadius: '2px'
          }}
        />
      </div>

      {/* Question */}
      <div style={{ textAlign: 'center', marginTop: '15px', flex: 1, display: 'flex', alignItems: 'center' }}>
        <h4 style={{
          fontSize: '0.85rem',
          fontWeight: '600',
          lineHeight: 1.3,
          opacity: 0.9,
          margin: 0
        }}>
          {currentStepData.question}
        </h4>
      </div>

      {/* Choice buttons */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '5px'
      }}>
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(139, 90, 158, 0.3)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleChoice('degenheart')}
          style={{
            padding: '10px',
            background: 'rgba(139, 90, 158, 0.2)',
            border: '1px solid rgba(139, 90, 158, 0.4)',
            borderRadius: '10px',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(10px)',
            justifyContent: 'center'
          }}
        >
          <span style={{ fontSize: '1rem' }}>{currentStepData.degenheart.icon}</span>
          <span style={{ flex: 1, textAlign: 'center' }}>{currentStepData.degenheart.text}</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: 'rgba(107, 114, 128, 0.3)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleChoice('traditional')}
          style={{
            padding: '10px',
            background: 'rgba(107, 114, 128, 0.2)',
            border: '1px solid rgba(107, 114, 128, 0.4)',
            borderRadius: '10px',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(10px)',
            justifyContent: 'center'
          }}
        >
          <span style={{ fontSize: '1rem' }}>{currentStepData.traditional.icon}</span>
          <span style={{ flex: 1, textAlign: 'center' }}>{currentStepData.traditional.text}</span>
        </motion.button>
      </div>

      {/* Step indicator */}
      <div style={{
        textAlign: 'center',
        fontSize: '0.65rem',
        opacity: 0.6
      }}>
        {currentStep + 1} / {steps.length}
      </div>
    </motion.div>
  );
}