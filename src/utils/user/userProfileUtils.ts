// Seeded hash function (FNV-1a)
export function fnv1a(str: string): number {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
}

// Seeded PRNG (Mulberry32)
export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Deterministically generate a natural-sounding degen-style username from a wallet string.
 */
export function generateUsernameFromWallet(wallet: string): string {
  const seed = fnv1a(wallet);
  const rng = mulberry32(seed);

  const cores = [
    "Degen", "Ape", "Pump", "Moon", "Bag", "Flip", "Hodl", "Shill", "Fomo", "Rug", "Bull", "Bear", "Whale", "Gem", "Dip"
  ];
  const prefixes = [
    "King", "Lord", "Master", "God", "Queen", "Sir", "Lady", "Crypto", "Ultra", "Mega"
  ];
  const suffixes = [
    "Master", "King", "God", "Queen", "Lord", "X", "99", "420", "1337", "Boss", "Chief"
  ];

  // Decide username structure by weighted random:
  // 40% core only
  // 25% prefix + core
  // 25% core + suffix
  // 10% core + core (compound)
  const choice = rng();
  let username = "";

  if (choice < 0.4) {
    // core only
    username = cores[Math.floor(rng() * cores.length)];
  } else if (choice < 0.65) {
    // prefix + core
    const prefix = prefixes[Math.floor(rng() * prefixes.length)];
    const core = cores[Math.floor(rng() * cores.length)];
    username = prefix + core;
  } else if (choice < 0.9) {
    // core + suffix
    const core = cores[Math.floor(rng() * cores.length)];
    const suffix = suffixes[Math.floor(rng() * suffixes.length)];
    username = core + suffix;
  } else {
    // core + core compound
    const core1 = cores[Math.floor(rng() * cores.length)];
    let core2 = cores[Math.floor(rng() * cores.length)];
    // prevent duplicates like "PumpPump"
    if (core2 === core1) {
      core2 = cores[(cores.indexOf(core2) + 1) % cores.length];
    }
    username = core1 + core2;
  }

  // 50% chance add numeric suffix
  if (rng() < 0.5) {
    const numDigits = rng() > 0.5 ? 3 : 4;
    const numSuffix = Math.floor(rng() * Math.pow(10, numDigits))
      .toString()
      .padStart(numDigits, "0");
    username += numSuffix;
  }

  return username;
}

/**
 * Generate a degen story from wallet address, optionally with chaos emoji mode.
 */
export function generateDegenStoryFromWallet(wallet: string, chaosMode = false): string {
  const username = generateUsernameFromWallet(wallet);

  const emojiPacks = {
    rockets: ["🚀", "🚀🚀", "🚀🔥", "🚀💎🙌", "🚀🌕", "🚀📈"],
    charts: ["📈", "📉", "📊", "📈🔥", "📈💰", "📉😅"],
    memes: ["🐸", "🦍", "💎🙌", "🍌", "🐂", "🐻", "🤑", "🤡"],
  };

  const e = (category: keyof typeof emojiPacks) => {
    const arr = emojiPacks[category];
    return arr[Math.floor(Math.random() * arr.length)];
  };

  function chaosify(text: string): string {
    if (!chaosMode) return text;
    const words = text.split(" ");
    const emojiCount = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < emojiCount; i++) {
      const pos = Math.floor(Math.random() * (words.length - 2)) + 1;
      const categories = Object.keys(emojiPacks) as (keyof typeof emojiPacks)[];
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const emoji = e(cat);
      words[pos] = words[pos] + " " + emoji;
    }
    return words.join(" ");
  }

  const intros = [
    `Yo, meet ${username}, the OG degen riding the waves of chaos ${e("rockets")} in crypto’s wild jungle.`,
    `Introducing ${username}, a true legend in the land of LAMBO dreams and diamond hands ${e("memes")}.`,
    `Say gm to ${username}, the fearless ape ${e("memes")} who never sleeps when the charts are pumping ${e("charts")}.`,
    `Here comes ${username}, always chasing the next moonshot ${e("rockets")} and dodging rug pulls.`,
    `All eyes on ${username}, the master of FOMO ${e("charts")} and HODL, living for the next big pump.`,
    `${username} showed up to the bull run ${e("rockets")} with nothing but vibes and left with generational memes ${e("memes")}.`,
    `You’ll hear whispers about ${username} ${e("memes")} whenever someone flips a 10x overnight.`,
    `They say ${username} can smell a breakout ${e("charts")} before the candles even print.`,
    `Some call ${username} a gambler, others call them a visionary ${e("memes")} — all agree they’re degen royalty.`,
    `From memecoins to blue chips, ${username} rides the volatility ${e("charts")} like a pro surfer on a tsunami ${e("rockets")}.`
  ];

  const traits = [
    `${username} is known for sniping rug pulls with hawk eyes 👀 and never missing a pump ${e("charts")}.`,
    `With turbo FOMO and diamond hands ${e("memes")}, ${username} laughs in the face of volatility.`,
    `A true Degen, ${username} stacks gains ${e("charts")}, flips coins, and always bets on green.`,
    `When others panic sell, ${username} just HODLs harder ${e("rockets")} and buys the dip.`,
    `Legend says ${username} once turned dust into a LAMBO ${e("rockets")} with pure degen energy.`,
    `${username} doesn’t follow the market — the market follows ${username} ${e("charts")}.`,
    `${username} treats every dip like it’s Black Friday ${e("memes")} at the crypto store.`,
    `${username} has a sixth sense for spotting coins before they trend ${e("charts")}.`,
    `Charts fear ${username} because they know a pump is coming ${e("rockets")}.`,
    `${username} apes in ${e("memes")} without hesitation, because hesitation kills gains.`
  ];

  const challenges = [
    `Survived the Great Crash of '24 ${e("charts")}, shrugged off the bear market, and came back swinging.`,
    `Dodged more rugs ${e("memes")} than most, and still grinding for that next 100x.`,
    `Faced FUD, whales dumping ${e("charts")}, and even a few pump and dumps, but never lost the vibe.`,
    `Lost a few bags to the wild west ${e("memes")} of crypto, but always bounced back stronger.`,
    `Even when the gas fees were savage ${e("memes")}, ${username} kept the grind alive.`,
    `${username} has been liquidated ${e("charts")}, hacked, and scammed… but still GM every morning.`,
    `They said “crypto is dead” ${e("memes")} — ${username} just bought more ${e("rockets")}.`,
    `Held through more red candles ${e("charts")} than a Valentine’s Day dinner, and still bullish.`,
    `Weathered every dip ${e("charts")} like a storm-hardened captain ${e("memes")}.`,
    `Saw friends fade away in the bear market but ${username} stayed, and it paid ${e("rockets")}.`
  ];

  const calls = [
    `Follow ${username}'s journey — the grind never stops ${e("rockets")} and neither do the gains.`,
    `Stay tuned, because ${username} is just getting started. WAGMI ${e("memes")}${e("rockets")}`,
    `If you see ${username} in the chat ${e("memes")}, drop a gm and watch the magic happen.`,
    `Next stop: moon ${e("rockets")}. Don’t blink or you’ll miss ${username}’s next play.`,
    `Remember, in the world of degens, ${username} is always one step ahead ${e("charts")}.`,
    `This is just chapter one ${e("charts")} of ${username}’s bull run saga ${e("rockets")}.`,
    `Grab your popcorn 🍿 — ${username} makes every trade a spectacle ${e("memes")}.`,
    `In crypto history books ${e("charts")}, ${username} will have their own chapter.`,
    `${username} doesn’t just chase pumps ${e("rockets")} — they create them.`,
    `Moon, Mars, or beyond ${e("rockets")} — ${username} will be there first ${e("memes")}.`
  ];

  const intro = chaosify(intros[Math.floor(Math.random() * intros.length)]);
  const trait = chaosify(traits[Math.floor(Math.random() * traits.length)]);
  const challenge = chaosify(challenges[Math.floor(Math.random() * challenges.length)]);
  const call = chaosify(calls[Math.floor(Math.random() * calls.length)]);

  return `${intro} ${trait} ${challenge} ${call}`;
}
