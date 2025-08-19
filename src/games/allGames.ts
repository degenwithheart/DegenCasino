import type { GameBundle } from './types'
import React from 'react'

export interface ExtendedGameBundle extends GameBundle {
  id: string;
  live: "up" | "down" | "new";
  meta: GameBundle['meta'] & {
    /** optional badge/tag to show on the card */
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
      image: '/games/dice.png',
      description: `The dice is an ancient confessional. Each slide of the bar is a whispered prayer, a bargain struck with fate in silence. When the cube tumbles, it does not simply fall — it sings, it judges, it reveals the hidden truth of risk. The higher you aim, the sweeter the promise of reward, yet the sharper the sting of ruin. Here, fortune is not loud or brash; she is subtle, like a lover who tests your patience. Each roll is fragile and fleeting, a heartbeat between triumph and collapse, and you are left holding your breath as if waiting for destiny to whisper its answer. Dice is not just a game of numbers, but a ritual of surrender, an intimate embrace with chance itself.`,
      tag: 'Singleplayer',
      effect: 'pulse',
    },
    app: React.lazy(() => import('./Dice')),
  },
  {
    id: 'slots',
    live: 'up',
    meta: {
      name: 'Slots',
      background: '#000000CC',
      image: '/games/slots.png',
      description: `The reels do not simply spin; they dance, weaving a story of longing, chance, and desire. Each click of the wheel is a verse in a ballad of chaos, each symbol a fleeting memory painted across time. Common outcomes drift by like strangers on the street, rare ones like old lovers crossing paths again, and legendaries like the lightning strike of first love — rare, electric, unforgettable. To play is to step into a ballroom of fate, where rhythm and luck entwine until, for one breathless moment, alignment arrives. When they lock into harmony, it is not just a payout but revelation itself. Slots is not a machine; it is a poem that writes itself anew with every spin, a reminder that beauty often lies in the waiting.`,
      tag: 'Singleplayer',
      effect: 'pulse',
    },
    app: React.lazy(() => import('./Slots')),
  },
  {
    id: 'plinkorace',
    live: 'down',
    meta: {
      name: 'PlinkoRace',
      background: '#000000CC',
      image: '/games/plinko-race.png',
      description: `This is not just a game of falling chips — it is a chorus of souls tumbling through the branches of fate together. Each ball you drop is a fragment of yourself, bouncing, colliding, diverging, converging with others as gravity writes its impartial story. Alone, Plinko is poetry of descent, but here it becomes symphony — a shared thrill where every bounce feels communal. The race is not only about where you land, but about who falls beside you, how their paths brush yours, and how fortune crowns one while humbling another. Each descent is a reminder that destiny is not solitary but shared, that risk is sweeter when witnessed, and that the beauty of the fall lies not just in its ending, but in the journey downward.`,
      tag: 'Multiplayer',
      effect: 'pulse',
    },
    app: React.lazy(() => import('./PlinkoRace')),
  },
  {
    id: 'flip',
    live: 'up',
    meta: {
      name: 'Flip',
      background: '#000000CC',
      image: '/games/flip.png',
      description: `A coin spins in the air, silver caught between two truths. Heads or tails, love or loss, everything or nothing — it is the simplest duel with destiny, yet the most unforgiving. In that suspended arc, the world falls silent, breath held, heart clenched, waiting to see which way fortune leans. There is no room for strategy here, no shield of skill. Flip is raw instinct distilled to its purest form, a reminder that sometimes life comes down to a single choice, a single moment, a single fall. When the coin lands, so too does your fate — fast, final, and absolute. It is not just chance; it is the poetry of risk made visible.`,
      tag: 'Singleplayer',
      effect: 'pulse',
    },
    app: React.lazy(() => import('./Flip')),
  },
  {
    id: 'flip-v1',
    live: 'new',
    meta: {
      name: 'Flip Duel',
      background: '#000000CC',
      image: '/games/flip-dual.png',
      description: `Two souls, one silver coin, and the breath of destiny between them. This is not just a flip — it is a duel where fate itself becomes the weapon. Face your opponent across the void of chance, both of you bound by the same prayer, the same desperate hope that the spinning silver will favor your choice. When the coin tumbles, it carries with it not just your fortune, but your honor. Victory tastes sweeter when earned against another dreamer, and defeat cuts deeper when witnessed by a rival. In this arena of pure chance, there are no second chances, no mercy, only the raw collision of two destinies and the silver arbiter that decides which dreams survive.`,
      tag: 'Multiplayer',
      effect: 'pulse',
    },
    app: React.lazy(() => import('./Flip-v1')),
  },
  {
    id: 'hilo',
    live: 'up',
    meta: {
      name: 'HiLo',
      background: '#000000CC',
      image: '/games/hilo.png',
      description: `Cards are honest in ways that people never are. HiLo is a game of small lies and greater truths, of choices balanced on the razor’s edge. Each card turned is a question whispered by fate: higher, lower, more, less, risk, retreat? One guess leads to another, streaks build like fragile romances — beautiful in their ascent, tragic in their ending. The tension grows, the temptation deepens, and with every step the promise of reward dances just out of reach. But the secret is not in winning forever; it is in knowing when enough is enough, when to walk away before the story betrays you. HiLo is a reminder that all streaks, like all loves, must someday end.`,
      tag: 'Singleplayer',
      effect: 'pulse',
    },
    app: React.lazy(() => import('./HiLo')),
  },
  {
    id: 'mines',
    live: 'up',
    meta: {
      name: 'Mines',
      background: '#000000CC',
      image: '/games/mines.png',
      description: `The board lies still, but beneath it sleeps chaos. Each tile you touch could be a kiss of fortune or the sting of betrayal. Twenty-five choices stretch before you, each one daring you deeper into the labyrinth. With every reveal, the silence grows heavier, your breath shorter. Push forward and your winnings blossom, but so too does the shadow of loss. Mines is not just a puzzle — it is a lover’s test, demanding courage yet punishing recklessness. To succeed, you must balance greed with grace, bravery with restraint. And even when you fall, you’ll find yourself drawn back, because danger, like desire, is impossible to resist.`,
      tag: 'Singleplayer',
      effect: 'pulse',
    },
    app: React.lazy(() => import('./Mines')),
  },
  {
    id: 'roulette',
    live: 'down',
    meta: {
      name: 'Roulette',
      background: '#000000CC',
      image: '/games/roulette.png',
      description: `The wheel is an ancient song, spun in velvet rooms where whispers and champagne blur together. Each rotation is a dance of elegance and chaos, where red and black become lovers circling in the dark. You place your bet not with logic, but with longing, letting your heart rest where reason will not follow. The ball teases, lingers, spins — until it drops, and with it, your fate. Roulette is not just a wager but a serenade, a timeless ritual where fortune flirts with you in public, then disappears without goodbye. It is old-world romance wrapped in modern risk, and every spin writes another verse in its eternal poem.`,
      tag: 'Singleplayer',
      effect: 'pulse',
    },
    app: React.lazy(() => import('./Roulette')),
  },
  {
    id: 'plinko',
    live: 'down',
    meta: {
      name: 'Plinko',
      background: '#000000CC',
      image: '/games/plinko.png',
      description: `Drop your heart into the abyss and let gravity compose its melody. Each peg struck is a note, each bounce a stanza, until the ball finds its final resting place. The edges whisper wildness and chaos, the center hums with safety, but beauty lies always in the descent. To play Plinko is to surrender to inevitability, to watch your fate unfold in slow, delicate poetry. Whether you send one ball or a hundred, each fall feels unique, a brief story of physics and chance written before your eyes. The journey, not the destination, is what keeps you coming back.`,
      tag: 'Singleplayer',
      effect: 'pulse',
    },
    app: React.lazy(() => import('./Plinko')),
  },
  {
    id: 'crash',
    live: 'up',
    meta: {
      name: 'Crash',
      background: '#000000CC',
      image: '/games/crash.png',
      description: `The rocket lights, and your pulse ignites with it. The climb is swift, intoxicating, and it feels as though it could rise forever. But nothing rises without end. The art is not in the ascent, but in the exit — in knowing when to let go, when to secure your fortune before the inevitable collapse. Leave too soon, and you taste regret. Wait too long, and you burn with the wreckage. Crash is a love story written in fire, where every launch is both promise and tragedy. It teaches you not just how to win, but how to leave before everything you love falls apart.`,
      tag: 'Singleplayer',
      effect: 'pulse',
    },
    app: React.lazy(() => import('./CrashGame')),
  },
  {
    id: 'blackjack',
    live: 'up',
    meta: {
      name: 'BlackJack',
      background: '#000000CC',
      image: '/games/blackjack.png',
      description: `Beneath the low light, you and the dealer engage in a silent war dressed as civility. Twenty-one is the dream, the edge of perfection, but each card is both weapon and wound. Will you hit, risking everything for one more breath of hope, or will you stand, daring fate to favor restraint? Bluff with your eyes, calculate with your heart, and pray the dealer falters before you do. Blackjack is not just arithmetic; it is intimacy, tension, and duel woven into velvet and smoke. Every hand is a heartbeat. Every choice, a confession. And every victory, no matter how small, feels like seduction.`,
      tag: 'Singleplayer',
      effect: 'pulse',
    },
    app: React.lazy(() => import('./BlackJack')),
  },
  {
    id: 'blackjack-v1',
    live: 'new',
    meta: {
      name: 'BlackJack Duel',
      background: '#000000CC',
      image: '/games/blackjack-dual.png',
      description: `The cards whisper secrets across a table where two souls meet in perfect tension. No dealer stands between you — just the raw clash of will against will, heart against heart. Twenty-one remains the sacred number, but now it must be earned not against the house, but against another dreamer who wants victory just as desperately as you do. Each card drawn is both promise and threat, each decision a chess move in a game of chance. When you hit, you dare not just fate but your opponent's courage. When you stand, you challenge their nerve. This is BlackJack stripped to its essence: pure human drama played out in hearts and spades, where the only dealer is destiny itself.`,
      tag: 'Multiplayer',
      effect: 'pulse',
    },
    app: React.lazy(() => import('./BlackJack-v1')),
  },
]
