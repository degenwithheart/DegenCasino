import React, { useEffect, useRef } from 'react';
import GameScreenFrame from '../Game/GameScreenFrame';
import { useGameplayEffects } from '../../hooks/game/useGameplayEffects';
import { useGraphics } from '../Game/GameScreenFrame';

interface GameplayFrameProps {
  title?: string;
  description?: string;
  colors?: [string, string, string?];
  gameState?: 'loading' | 'playing' | 'finished' | 'error';
  enableEffects?: boolean;
  enableMotion?: boolean;
  children: React.ReactNode;

  // Effect triggers - these can be called by games to trigger effects
  onScreenShake?: () => void;
  onWinFlash?: () => void;
  onParticleBurst?: () => void;

  // Accept any additional props that should be forwarded to GameScreenFrame
   
  [key: string]: any;
}

// Create a ref type for effect methods that games can access
export interface GameplayEffectsRef {
   
  [x: string]: any;
   
  screenShake: (intensity?: number, duration?: number) => void;
   
  winFlash: (color?: string, intensity?: number) => void;
   
  loseFlash: (color?: string, intensity?: number) => void;
   
  particleBurst: (x?: number, y?: number, color?: string, count?: number) => void;
   
  flash: (color?: string, duration?: number) => void;
}

const GameplayFrame = React.forwardRef<GameplayEffectsRef, GameplayFrameProps>(({
  title,
  description,
  colors,
  gameState,
  enableEffects,
  enableMotion,
  children,
  ...rest  // Capture any additional props
}, ref) => {
  const { settings } = useGraphics();
  const effects = useGameplayEffects();
  const containerRef = useRef<HTMLDivElement>(null);

  // Debug log on mount
  useEffect(() => {
    console.log('🎮 GameplayFrame mounted with settings:', settings);
    console.log('🎮 Effects object:', effects);
  }, []);

  // Expose effect methods to parent components via ref
  React.useImperativeHandle(ref, () => ({
    screenShake: (intensity?: number, duration?: number) => {
      console.log('🎮 GameplayFrame.screenShake called:', { intensity, duration });
      effects.screenShake(intensity, duration);
    },
    winFlash: (color?: string, intensity?: number) => {
      console.log('🎮 GameplayFrame.winFlash called:', { color, intensity });
      effects.winFlash(color, intensity);
    },
    loseFlash: (color?: string, intensity?: number) => {
      console.log('🎮 GameplayFrame.loseFlash called:', { color, intensity });
      effects.loseFlash(color, intensity);
    },
    particleBurst: (x?: number, y?: number, color?: string, count?: number) => {
      console.log('🎮 GameplayFrame.particleBurst called:', { x, y, color, count });
      effects.particleBurst(x, y, color, count);
    },
    flash: (color?: string, duration?: number) => {
      console.log('🎮 GameplayFrame.flash called:', { color, duration });
      effects.flash(color, duration);
    }
  }), [effects]);

  // Apply screen shake effect to container
  useEffect(() => {
    if (effects.isShaking && containerRef.current && settings.enableMotion) {
      const intensity = effects.shakeIntensity;
      const element = containerRef.current;

      console.log('📳 Applying screen shake with intensity:', intensity);

      // Create shake keyframes
      const keyframes = [];
      const duration = 500; // ms
      const steps = 20;

      for (let i = 0; i <= steps; i++) {
        const progress = i / steps;
        const amplitude = intensity * 10 * (1 - progress); // Decay over time
        const x = (Math.random() - 0.5) * amplitude;
        const y = (Math.random() - 0.5) * amplitude;
        const rotate = (Math.random() - 0.5) * intensity * 2;

        keyframes.push({
          transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
          offset: progress
        });
      }

      // Add final reset keyframe
      keyframes.push({
        transform: 'translate(0px, 0px) rotate(0deg)',
        offset: 1
      });

      // Apply animation
      const animation = element.animate(keyframes, {
        duration,
        easing: 'ease-out'
      });

      return () => {
        animation.cancel();
      };
    }
  }, [effects.isShaking, effects.shakeIntensity, settings.enableMotion]);

  // Apply flash effect to container
  useEffect(() => {
    if (effects.isFlashing && containerRef.current && settings.enableEffects) {
      const element = containerRef.current;

      console.log('⚡ Applying flash effect with color:', effects.flashColor);

      // Create flash overlay
      const overlay = document.createElement('div');
      overlay.style.position = 'absolute';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.right = '0';
      overlay.style.bottom = '0';
      overlay.style.backgroundColor = effects.flashColor;
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '1000';
      overlay.style.borderRadius = 'inherit';

      element.appendChild(overlay);

      // Animate flash
      const animation = overlay.animate([
        { opacity: '0' },
        { opacity: '0.4' },
        { opacity: '0.6' },
        { opacity: '0.2' },
        { opacity: '0' }
      ], {
        duration: 800,
        easing: 'ease-in-out'
      });

      animation.onfinish = () => {
        if (element.contains(overlay)) {
          element.removeChild(overlay);
        }
      };

      return () => {
        animation.cancel();
        if (element.contains(overlay)) {
          element.removeChild(overlay);
        }
      };
    }
  }, [effects.isFlashing, effects.flashColor, settings.enableEffects]);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <GameScreenFrame
        title={title}
        description={description}
        colors={colors}
        gameState={gameState}
        enableEffects={enableEffects}
        enableMotion={enableMotion}
        {...rest}  // Forward any additional props
      >
        {/* Only render children if not used as an overlay (when style prop contains position: absolute) */}
        {!rest.style?.position && children}
      </GameScreenFrame>
    </div>
  );
});

GameplayFrame.displayName = 'GameplayFrame';

export default GameplayFrame;
