import type { GameBundle } from './types';
import React from 'react';

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
      description: `Peer into the mystical 8-ball and let cosmic forces generate your fortune. This is no ordinary dice — it is an oracle wrapped in canvas and code, where physics and magic converge to birth your lucky number. Watch as ethereal particles swirl around the enchanted sphere, its surface rippling with otherworldly energy before revealing the number that fate has chosen for you. Each generation is a séance with chance itself, a communion between your desire and the universe's hidden mathematics. The 8-ball does not roll — it dreams, it meditates, it channels pure possibility into digital form. Here, luck is not cast but conjured, not rolled but received like a gift from the cosmos.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./Dice')),
  },
  {
    id: 'magic8ball',
    live: 'up',
    meta: {
      name: 'Magic 8 Ball',
      background: '#000000CC',
      image: '/png/games/magic8ball.png',
      description: `Peer into the mystical 8-ball and let cosmic forces generate your fortune. This is no ordinary dice — it is an oracle wrapped in canvas and code, where physics and magic converge to birth your lucky number. Watch as ethereal particles swirl around the enchanted sphere, its surface rippling with otherworldly energy before revealing the number that fate has chosen for you. Each generation is a séance with chance itself, a communion between your desire and the universe's hidden mathematics. The 8-ball does not roll — it dreams, it meditates, it channels pure possibility into digital form. Here, luck is not cast but conjured, not rolled but received like a gift from the cosmos.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./Magic8Ball')),
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
    live: 'down',
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
    live: 'up',
    meta: {
      name: 'Flip',
      background: '#000000CC',
      image: '/webp/games/flip.webp',
      description: `Launch a constellation of coins into the ethereal dance of probability, each one spinning its own tale of heads and tails. Set your target count and watch as multiple fates unfold simultaneously in the air above you, their golden surfaces catching light like falling stars. This is not one flip but a symphony of flips, each coin a note in a binomial ballad where mathematics becomes poetry. The more coins you dare to toss, the more complex the harmony becomes, yet the sweeter the potential reward. Choose your target wisely — for in this aerial ballet of chance, precision is rewarded and greed is punished. When they all settle, they speak in unison the language of calculated risk.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./Flip')),
  },
  {
    id: 'hilo',
    live: 'new',
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
    live: 'new',
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
    live: 'new',
    meta: {
      name: 'BlackJack',
      background: '#000000CC',
      image: '/webp/games/blackjack.webp',
      description: `Twenty-one is the sacred number, the delicate balance between ambition and ruin. Each card dealt is a whispered promise, a step closer to perfection or a stumble toward collapse. Hit and you chase the dream of completion, stand and you trust in what fate has already given you. The dealer waits with infinite patience, their hidden card a secret that could shatter your confidence or crown your courage. This is not just mathematics — it is psychology made manifest, where knowing when to be satisfied is as crucial as knowing when to risk it all. In BlackJack, victory belongs not to the lucky, but to those who understand that sometimes the greatest triumph is knowing when you have enough.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./BlackJack')),
  },
];
