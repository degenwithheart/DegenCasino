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
    id: 'dice-v2',
    live: 'up',
    meta: {
      name: 'Dice',
      background: '#000000CC',
      image: '/webp/games/dice.webp',
      description: `Peer into the mystical 8-ball and let cosmic forces generate your fortune. This is no ordinary dice — it is an oracle wrapped in canvas and code, where physics and magic converge to birth your lucky number. Watch as ethereal particles swirl around the enchanted sphere, its surface rippling with otherworldly energy before revealing the number that fate has chosen for you. Each generation is a séance with chance itself, a communion between your desire and the universe's hidden mathematics. The 8-ball does not roll — it dreams, it meditates, it channels pure possibility into digital form. Here, luck is not cast but conjured, not rolled but received like a gift from the cosmos.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./Dice-v2')),
  },
  {
    id: 'magic8ball',
    live: 'up',
    meta: {
      name: 'Magic 8-Ball',
      background: '#000000CC',
      image: '/webp/games/magic8ball.png',
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
    id: 'flip-v2',
    live: 'up',
    meta: {
      name: 'Flip',
      background: '#000000CC',
      image: '/webp/games/flip.webp',
      description: `Launch a constellation of coins into the ethereal dance of probability, each one spinning its own tale of heads and tails. Set your target count and watch as multiple fates unfold simultaneously in the air above you, their golden surfaces catching light like falling stars. This is not one flip but a symphony of flips, each coin a note in a binomial ballad where mathematics becomes poetry. The more coins you dare to toss, the more complex the harmony becomes, yet the sweeter the potential reward. Choose your target wisely — for in this aerial ballet of chance, precision is rewarded and greed is punished. When they all settle, they speak in unison the language of calculated risk.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./Flip-v2')),
  },
  {
    id: 'roulette-royale',
    live: 'up',
    meta: {
      name: 'Roulette Royale',
      background: '#000000CC',
      image: '/webp/games/roulette.webp',
      description: `The sacred wheel transforms into a battlefield of minds and fortunes, where multiple souls converge around a single table of destiny. This is not the solitary dance of chance, but a multiplayer symphony where each bet placed echoes with the hopes of others. Watch as fellow players lay their chips beside yours, all bound by the same spinning fate, all dreaming of the same golden moment when the ball finds their chosen number. Here, victory is not just about beating the odds — it is about outlasting, outthinking, and outplaying every other soul brave enough to join your table. Winner takes all in this royal court of chance.`,
      tag: 'Multiplayer',
      rtp: 97,
      maxWin: '35x'
    },
    app: React.lazy(() => import('./RouletteRoyale')),
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
    id: 'mines-v2',
    live: 'up',
    meta: {
      name: 'Mines',
      background: '#000000CC',
      image: '/webp/games/mines.webp',
      description: `The board lies still, but beneath it sleeps chaos. Each tile you touch could be a kiss of fortune or the sting of betrayal. Twenty-five choices stretch before you, each one daring you deeper into the labyrinth. With every reveal, the silence grows heavier, your breath shorter. Push forward and your winnings blossom, but so too does the shadow of loss. Mines is not just a puzzle — it is a lover’s test, demanding courage yet punishing recklessness. To succeed, you must balance greed with grace, bravery with restraint. And even when you fall, you’ll find yourself drawn back, because danger, like desire, is impossible to resist.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./Mines-v2')),
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
      description: `Twenty-one is the sacred number, the delicate balance between ambition and ruin. Each card dealt is a whispered promise, a step closer to perfection or a stumble toward collapse. Hit and you chase the dream of completion, stand and you trust in what fate has already given you. The dealer waits with infinite patience, their hidden card a secret that could shatter your confidence or crown your courage. This is not just mathematics — it is psychology made manifest, where knowing when to be satisfied is as crucial as knowing when to risk it all. In BlackJack, victory belongs not to the lucky, but to those who understand that sometimes the greatest triumph is knowing when you have enough.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./BlackJack-v2')),
  },
  {
    id: 'multipoker',
    live: 'up',
    meta: {
      name: 'Multi Poker',
      background: '#000000CC',
      image: '/webp/games/multi-poker.webp',
      description: `Five cards arrive like old friends bearing secrets, each hand a story waiting to unfold across multiple stages of revelation. This is poker reimagined as a progressive journey where each round builds upon the last, each decision echoing through future possibilities. Watch as pairs bloom into trips, trips ascend to straights, and straights reach toward the holy grail of royal flush. The beauty lies not in a single perfect hand, but in the gradual construction of victory through patience and wisdom. Here, poker becomes architecture — each card placed with intention, each hold and fold a brushstroke in a masterpiece of calculated risk. Multi Poker rewards not just luck, but the art of progression itself.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./MultiPoker-v2')),
  },
  {
    id: 'cryptochartgame-v2',
    live: 'new',
    meta: {
      name: 'Crypto Chart v2',
      background: '#000000CC',
      image: '/webp/games/crypto-chart.webp',
      description: `Enter the volatile world of cryptocurrency trading where fortunes are made and lost in milliseconds. Set your target multiplier and watch as the market dances to the rhythm of chaos and opportunity. Will your chosen coin moon to astronomical heights, or will it get rugged before reaching your target? This is more than gambling — it's a simulation of the wild west of digital assets, where diamond hands are forged and paper hands are revealed. The chart never lies, but it often surprises. Navigate the peaks and valleys of price action in this romantic dance with financial destiny.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./CryptoChartGame-v2')),
  },
  {
    id: 'doubleornothing-v2',
    live: 'new',
    meta: {
      name: 'Double or Nothing v2',
      background: '#000000CC',
      image: '/webp/games/double-or-nothing.webp',
      description: `The ultimate test of nerves and fortune distilled to its purest essence. Choose your poison: double your money with a coin flip, triple it with dice gods, or go full degen for the 10x moonshot. Each button hides a destiny — one leads to glory, the others to the void of nothing. This is capitalism in its rawest form, where greed meets probability in a beautiful, devastating embrace. The suspense builds as buttons reveal their secrets, and in that moment of revelation, you discover whether you're blessed by fortune or humbled by mathematics.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./DoubleOrNothing-v2')),
  },
  {
    id: 'fancyvirtualhorseracing-v2',
    live: 'new',
    meta: {
      name: 'Virtual Horse Racing v2',
      background: '#000000CC',
      image: '/webp/games/horse-racing.webp',
      description: `Feel the thunder of hooves on digital dirt as eight magnificent steeds compete for glory in the most romantic of all sports. Each horse carries a story, a dream, and odds that whisper of both triumph and heartbreak. Lightning Bolt strikes like fate itself, while Lunar Eclipse moves with mysterious elegance through the pack. Choose your champion and watch as they gallop toward destiny, their every stride a heartbeat in the symphony of competition. This is not just racing — it's poetry in motion, where the finish line separates dreamers from believers.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./FancyVirtualHorseRacing-v2')),
  },
  {
    id: 'keno-v2',
    live: 'new',
    meta: {
      name: 'Keno v2',
      background: '#000000CC',
      image: '/webp/games/keno.webp',
      description: `Enter the realm of numerical destiny where forty spheres hold the keys to fortune. Select your sacred numbers with the wisdom of the ancients, then watch as ten golden orbs emerge from the cosmic lottery to determine your fate. Each chosen number is a prayer whispered to Lady Luck herself, each match a love letter from the universe. The more selections you dare to make, the greater the potential for romantic triumph, yet the sweeter becomes each successful prediction. This is Keno — where mathematics dances with mysticism, and every draw brings the possibility of perfect numerical harmony.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./Keno-v2')),
  },
  {
    id: 'limbo-v2',
    live: 'new',
    meta: {
      name: 'Limbo v2',
      background: '#000000CC',
      image: '/webp/games/limbo.webp',
      description: `Ascend the mystical ladder of multipliers where each rung brings both greater glory and deeper peril. Set your target in the heavens and watch as the cosmic counter climbs toward your chosen destiny. Will you reach the stars, or will fate crash your dreams back to earth? The higher you dare to aim, the rarer the air becomes, yet the sweeter the oxygen of victory tastes. This is Limbo — the ultimate test of greed versus wisdom, where knowing when to dream big and when to stay humble becomes the difference between earthly riches and celestial bankruptcy.`,
      tag: 'Singleplayer',
    },
    app: React.lazy(() => import('./Limbo-v2')),
  },
]
