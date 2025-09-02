import type { GameBundle } from './types'
import React from 'react'

export interface ExtendedGameBundle extends GameBundle {
  id: string;
  live: "up" | "down" | "new";
  meta: GameBundle['meta'] & {
    tag?: string;
  };
  app: React.LazyExoticComponent<React.ComponentType<any>>;
}

export const ALL_GAMES: ExtendedGameBundle[] = [
  {
    id: 'dice',
    live: 'up',
    meta: {
      name: 'Dice',
      background: '#000000CC',
      image: '/webp/games/dice.webp',
      description: `The dice is an ancient confessional. Each slide of the bar is a whispered prayer, a bargain struck with fate in silence. When the cube tumbles, it does not simply fall — it sings, it judges, it reveals the hidden truth of risk. The higher you aim, the sweeter the promise of reward, yet the sharper the sting of ruin. Here, fortune is not loud or brash; she is subtle, like a lover who tests your patience. Each roll is fragile and fleeting, a heartbeat between triumph and collapse, and you are left holding your breath as if waiting for destiny to whisper its answer. Dice is not just a game of numbers, but a ritual of surrender, an intimate embrace with chance itself.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./Dice')),
  },
  {
    id: 'slots',
    live: 'up',
    meta: {
      name: 'Slots',
      background: '#000000CC',
      image: '/webp/games/slots.webp',
      description: `The reels do not simply spin; they dance, weaving a story of longing, chance, and desire. Each click of the wheel is a verse in a ballad of chaos, each symbol a fleeting memory painted across time. Common outcomes drift by like strangers on the street, rare ones like old lovers crossing paths again, and legendaries like the lightning strike of first love — rare, electric, unforgettable. To play is to step into a ballroom of fate, where rhythm and luck entwine until, for one breathless moment, alignment arrives. When they lock into harmony, it is not just a payout but revelation itself. Slots is not a machine; it is a poem that writes itself anew with every spin, a reminder that beauty often lies in the waiting.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./Slots')),
  },
  {
    id: 'plinkorace',
    live: 'up',
    meta: {
      name: 'PlinkoRace',
      background: '#000000CC',
      image: '/webp/games/plinko-race.webp',
      description: `This is not just a game of falling chips — it is a chorus of souls tumbling through the branches of fate together. Each ball you drop is a fragment of yourself, bouncing, colliding, diverging, converging with others as gravity writes its impartial story. Alone, Plinko is poetry of descent, but here it becomes symphony — a shared thrill where every bounce feels communal. The race is not only about where you land, but about who falls beside you, how their paths brush yours, and how fortune crowns one while humbling another. Each descent is a reminder that destiny is not solitary but shared, that risk is sweeter when witnessed, and that the beauty of the fall lies not just in its ending, but in the journey downward.`,
      tag: 'Multiplayer',
    },
    app: React.lazy(() => import('./PlinkoRace')),
  },
  {
    id: 'flip',
    live: 'down',
    meta: {
      name: 'Flip',
      background: '#000000CC',
      image: '/webp/games/flip.webp',
      description: `A coin spins in the air, silver caught between two truths. Heads or tails, love or loss, everything or nothing — it is the simplest duel with destiny, yet the most unforgiving. In that suspended arc, the world falls silent, breath held, heart clenched, waiting to see which way fortune leans. There is no room for strategy here, no shield of skill. Flip is raw instinct distilled to its purest form, a reminder that sometimes life comes down to a single choice, a single moment, a single fall. When the coin lands, so too does your fate — fast, final, and absolute. It is not just chance; it is the poetry of risk made visible.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./Flip')),
  },
  {
    id: 'roulette',
    live: 'new',
    meta: {
      name: 'Roulette',
      background: '#000000CC',
      image: '/webp/games/roulette.webp',
      description: `The wheel of fortune spins with ancient wisdom, its numbered chambers holding the dreams and fears of countless souls. Each chip placed upon the green felt is a whispered prayer, a desperate hope cast into the cosmic dance of chance. Watch as the silver ball dances along the rim, bouncing between destiny and desire, until gravity claims it and fate reveals itself. This is not merely a game — it is a ritual of risk, where red and black become metaphors for life's eternal duality.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./Roulette')),
  },
  {
    id: 'hilo',
    live: 'up',
    meta: {
      name: 'HiLo',
      background: '#000000CC',
      image: '/webp/games/hilo.webp',
      description: `Cards are honest in ways that people never are. HiLo is a game of small lies and greater truths, of choices balanced on the razor’s edge. Each card turned is a question whispered by fate: higher, lower, more, less, risk, retreat? One guess leads to another, streaks build like fragile romances — beautiful in their ascent, tragic in their ending. The tension grows, the temptation deepens, and with every step the promise of reward dances just out of reach. But the secret is not in winning forever; it is in knowing when enough is enough, when to walk away before the story betrays you. HiLo is a reminder that all streaks, like all loves, must someday end.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./HiLo')),
  },
  {
    id: 'mines',
    live: 'up',
    meta: {
      name: 'Mines',
      background: '#000000CC',
      image: '/webp/games/mines.webp',
      description: `The board lies still, but beneath it sleeps chaos. Each tile you touch could be a kiss of fortune or the sting of betrayal. Twenty-five choices stretch before you, each one daring you deeper into the labyrinth. With every reveal, the silence grows heavier, your breath shorter. Push forward and your winnings blossom, but so too does the shadow of loss. Mines is not just a puzzle — it is a lover’s test, demanding courage yet punishing recklessness. To succeed, you must balance greed with grace, bravery with restraint. And even when you fall, you’ll find yourself drawn back, because danger, like desire, is impossible to resist.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./Mines')),
  },
  {
    id: 'plinko',
    live: 'up',
    meta: {
      name: 'Plinko',
      background: '#000000CC',
      image: '/webp/games/plinko.webp',
      description: `Drop your heart into the abyss and let gravity compose its melody. Each peg struck is a note, each bounce a stanza, until the ball finds its final resting place. The edges whisper wildness and chaos, the center hums with safety, but beauty lies always in the descent. To play Plinko is to surrender to inevitability, to watch your fate unfold in slow, delicate poetry. Whether you send one ball or a hundred, each fall feels unique, a brief story of physics and chance written before your eyes. The journey, not the destination, is what keeps you coming back.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./Plinko')),
  },
  {
    id: 'crash',
    live: 'up',
    meta: {
      name: 'Crash',
      background: '#000000CC',
      image: '/webp/games/crash.webp',
      description: `The rocket lights, and your pulse ignites with it. The climb is swift, intoxicating, and it feels as though it could rise forever. But nothing rises without end. The art is not in the ascent, but in the exit — in knowing when to let go, when to secure your fortune before the inevitable collapse. Leave too soon, and you taste regret. Wait too long, and you burn with the wreckage. Crash is a love story written in fire, where every launch is both promise and tragedy. It teaches you not just how to win, but how to leave before everything you love falls apart.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./CrashGame')),
  },
  {
    id: 'blackjack',
    live: 'up',
    meta: {
      name: 'BlackJack',
      background: '#000000CC',
      image: '/webp/games/blackjack.webp',
      description: `Beneath the low light, you and the dealer engage in a silent war dressed as civility. Twenty-one is the dream, the edge of perfection, but each card is both weapon and wound. Will you hit, risking everything for one more breath of hope, or will you stand, daring fate to favor restraint? Bluff with your eyes, calculate with your heart, and pray the dealer falters before you do. Blackjack is not just arithmetic; it is intimacy, tension, and duel woven into velvet and smoke. Every hand is a heartbeat. Every choice, a confession. And every victory, no matter how small, feels like seduction.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./BlackJack')),
  },
  {
    id: 'progressivepoker',
    live: 'up',
    meta: {
      name: 'Progressive Poker',
      background: '#000000CC',
      image: '/webp/games/progressive-poker.webp',
      description: `Five cards hold your fate, but here fortune favors the bold. Each hand dealt is a whispered promise — will you find the pair that starts your climb, the straight that lifts your spirit, or the royal flush that crowns you king? This is not just poker; it is progression itself, where each win becomes the seed of the next dream. Continue playing and watch your fortune blossom, or cash out and hold what you've earned. But beware — one bust hand and all returns to dust. In Progressive Poker, every decision is a love letter to risk, every hand a chance to rise or fall in the most beautiful way possible.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./ProgressivePoker')),
  },
]
