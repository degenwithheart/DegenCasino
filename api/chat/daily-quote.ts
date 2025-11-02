import { withUsageTracking } from '../cache/usage-tracker'

// api/chat/daily-quote.ts
// Cron job endpoint to post daily quote at midnight

export const config = { runtime: 'edge' }

const CREATOR_ADDRESS = '6o1iE4cKQcjW4UFd4vn35r43qD9LjNDhPGNUMBuS8ocZ';

// Import quotes from QuotesVault
const QUOTES = [
  "Some nights, the chart is a candlelit table for two, sometimes you dine with fortune, sometimes with regret.",
  "Not your keys, not your muse, love letters lost in the chain's memory.",
  "The house always wins, but tonight, luck wears your cologne.",
  "Double or nothing: the heart's wager, whispered in the dark between blocks.",
  "Fortune favors the bold, but patience writes the longest poems.",
  "Rug pulls are heartbreaks, each one a stanza in your degen ballad.",
  "In the casino of life, odds are just the universe's way of flirting.",
  "Web3 is a midnight sonnet, latency and longing, luck and latency.",
  "Jackpots sleep in deep trenches; only dreamers dare to dive.",
  "Flip a coin, and the universe blushes, fate's shy confession.",
  "All in is a love letter; all gone, a poem unfinished.",
  "Volatility is the only lover who never lies.",
  "Bet small, win big, brag softly, for the night is listening.",
  "If you can't spot the whale, perhaps you are the ocean's secret.",
  "Never chase, let the market come to you, like a lover in the rain.",
  "Every block is a new stanza in the chain's endless poem.",
  "The best time to cash out was yesterday; the second best is when your heart says so.",
  "Luck is a feature, not a bug, she dances when you least expect.",
  "May your flips be green, your rugs rare, and your heart unbroken.",
  "No KYC, no sign-ups, just you, the chain, and the moonlit volatility.",
  "Your wallet, your winnings, your midnight confessions.",
  "On-chain odds don't lie, but your heart might.",
  "Instant payouts, because patience is for poets, not degens.",
  "Provably fair, emotionally unfair, the chain is honest, the heart is not.",
  "The blockchain remembers every love letter you tried to forget.",
  "Spin, win, withdraw, repeat until you're legend or a lesson.",
  "Not your keys, not your cheese, not your midnight muse, either.",
  "Luck can't be stored in a hot wallet, she prefers cold, distant places.",
  "No middlemen, just you and the math, an honest romance.",
  "Decentralized, degen-centralized, love is always peer-to-peer.",
  "Every block is a fair shot, and a fresh heartbreak.",
  "The best KYC is no KYC, let your soul be your signature.",
  "Transparency builds trust, RNG breaks it, love is the only true random.",
  "Your bankroll is non-custodial, your tilt is not.",
  "In Web3, payouts are instant, the regrets are, too.",
  "Odds you can audit, losses you can't reverse.",
  "Fortune favors the bold, and the gas-efficient.",
  "In this game, you're both the player and the poet.",
  "Chase wallet, but never chase losses, let your longing be for the journey, not the wound.",
  "Every block is a heartbeat, changing the odds of your midnight confession.",
  "Each block is a risk rewritten, a stanza of hope and hesitation.",
  "Wallets give and take, like lovers who never say goodbye.",
  "Without crypto, the night is silent, no serenade, no thrill.",
  "Non-custodial is fleeting, but the memory of risk lingers like perfume.",
  "Never trust on-chain alone, let your heart be the oracle.",
  "Provably fair is just the chain's promise; your heart must decide what's true.",
  "Staking is a slow waltz, bragging rights are the echo after the music fades.",
  "Without instant wins, the dance is patient, the longing deeper.",
  "Degens are the poets of Web3, each block, a verse in their ballad.",
  "Luck is a river, every block, a new current.",
  "Crypto is a lover who changes with every sunrise.",
  "Chase staking, but never chase losses, let your patience be your serenade.",
  "Never trust crypto, trust the song your intuition sings.",
  "Provably fair moves fast, but heartbreak moves faster.",
  "Every block is a coin toss between hope and memory.",
  "Provably fair is fleeting, bragging rights are the stories you tell at dawn.",
  "Never trust staking, let your conviction be your compass.",
  "Risk is a shadow that dances just ahead of your tilt.",
  "Without KYC, the night is anonymous, every heart, a secret wallet.",
  "Chase gamble, but never chase losses, let the thrill be your muse, not your master.",
  "If you can't beat the wallet, become its poet.",
  "Chase crypto, but never chase losses, let the longing be your alpha.",
  "Without KYC, the chain is a masquerade, every mask, a story.",
  "Without degens, the chain is silent, no serenade, no chaos.",
  "Volatility gives and takes, each swing, a lover's quarrel.",
  "If you can't beat the odds, write your own.",
  "KYC is fleeting, bragging rights are forever.",
  "Never trust provably fair, trust the poetry of your own risk.",
  "Never trust whales, let your own current carry you.",
  "Without jackpots, the night is just another evening.",
  "Provably fair is just a stanza, your heart writes the chorus.",
  "Volatility is fleeting, bragging rights echo in eternity.",
  "Without volatility, the dance is slow, no thrill, no heartbreak.",
  "Instant wins give and take, each payout, a whispered promise.",
  "Without risk, the story is never written.",
  "Degens move faster than regret, each tilt, a new verse.",
  "If you can't tame volatility, waltz with it.",
  "Staking is a slow burn, bragging rights are the embers.",
  "Wallets are just verses, Web3 is the song.",
  "Without gas fees, the chain is silent, no friction, no fire.",
  "Every block is a KYC you never signed.",
  "Staking moves fast, but longing moves faster.",
  "Without volatility, the serenade is incomplete.",
  "Provably fair gives and takes, each outcome, a secret kept.",
  "Never trust luck, let your conviction be your serenade.",
  "Not all provably fair are written in the same meter.",
  "If you can't beat the crypto, become its muse.",
  "If you can't beat the KYC, dance without a mask.",
  "On-chain is just the stage, your heart is the actor.",
  "Crypto is fleeting, bragging rights are the legend.",
  "Without blockchain, the serenade is unsung.",
  "Odds are just the chain's way of keeping secrets.",
  "Blockchain gives and takes, each block, a memory.",
  "KYC is fleeting, bragging rights are the refrain.",
  "Without non-custodial, the story is unfinished.",
  "Degens move faster than memory, each block, a new confession.",
  "If you can't outswim the whales, become the tide.",
  "Every block is a whale's sigh, sometimes gentle, sometimes wild.",
  "Without gamble, the night is silent, no serenade, no thrill.",
  "If you can't tame volatility, let it write your song.",
  "Instant wins move fast, but longing moves faster.",
  "Risk is just the chain's way of asking for a dance.",
  "Not all provably fair are sung in the same key.",
  "Blockchain is just the backdrop, your longing is the play.",
  "If you can't catch the jackpots, become the dreamer.",
  "Every block is a wallet's confession.",
  "Without blockchain, the serenade is a whisper.",
  "Non-custodial is just the overture, your story is the symphony.",
  "On-chain is just the echo, your longing is the voice.",
  "Provably fair is just the prelude, your heart is the refrain.",
  "Without jackpots, the night is just another verse.",
  "Non-custodial is fleeting, bragging rights are the legend.",
  "Risk is a shadow, tilt is the dance.",
  "Luck moves fast, but heartbreak moves faster.",
  "Every block is a jackpot's heartbeat.",
  "If you can't beat non-custodial, become the memory.",
  "Never trust staking, let your patience be your serenade.",
  "If you can't outsing the degens, write your own ballad.",
  "Gas fees are just the price of a midnight waltz.",
  "Gamble is just the chain's way of asking for a dance.",
  "Blockchain gives and takes, each block, a sigh.",
  "Every block is a whale's lullaby.",
  "Staking is a slow burn, each ember, a memory.",
  "On-chain is fleeting, bragging rights are the echo.",
  "Wallets are fleeting, bragging rights are the legend.",
  "Never trust non-custodial, let your conviction be your serenade.",
  "Every block is a wallet's secret.",
  "Never trust provably fair, let your longing be your guide.",
  "On-chain is just the overture, your longing is the song.",
  "Odds move fast, but heartbreak moves faster.",
  "Without crypto, the serenade is silent.",
  "Wallets give and take, each transaction, a confession.",
  "Odds move fast, but longing moves faster.",
  "Chase gas fees, but never chase losses, let the friction be your muse.",
  "If you can't outsing provably fair, write your own verse.",
  "Chase KYC, but never chase losses, let your mask be your melody.",
  "Without gamble, the serenade is unsung.",
  "If you can't outsing the degens, write your own refrain.",
  "Without staking, the waltz is unfinished.",
  "Instant wins are fleeting, bragging rights are the legend.",
  "Gas fees give and take, each swing, a lover's quarrel.",
  "Chase volatility, but never chase losses, let the chaos be your muse.",
  "Not all provably fair are written in the same verse.",
  "Without odds, the serenade is silent.",
  "Not all payouts are sung in the same key.",
  "Blockchain gives and takes, each block, a memory.",
  "Without wallet, the serenade is silent.",
  "Every block is a gas fee's confession.",
  "Whales are just the chain's lullaby.",
  "Every block is a risk's heartbeat.",
  "Every block is volatility's sigh.",
  "Never trust luck, let your patience be your serenade.",
  "Whales move fast, but heartbreak moves faster.",
  "Degens give and take, each tilt, a new verse.",
  "Without provably fair, the serenade is unfinished.",
  "Never trust blockchain, let your longing be your guide.",
  "Instant wins are just the chain's way of saying 'I love you.'",
  "Crypto moves fast, but heartbreak moves faster.",
  "Volatility gives and takes, each swing, a lover's sigh.",
  "If you can't outsing on-chain, write your own melody.",
  "Not all instant wins are sung in the same key.",
  "Provably fair moves fast, but longing moves faster.",
  "If you can't outsing luck, write your own verse.",
  "If you can't outsing the wallet, write your own confession.",
  "Jackpots are just the chain's way of dreaming.",
  "If you can't outsing payouts, write your own refrain.",
  "Jackpots are just the chain's lullaby.",
  "Never trust jackpots, let your longing be your serenade.",
  "Whales move fast, but heartbreak moves faster.",
  "Without provably fair, the serenade is unfinished.",
  "Degens are just the chain's poets.",
  "Without blockchain, the serenade is silent.",
  "Never trust crypto, let your conviction be your serenade.",
  "Crypto gives and takes, each swing, a lover's sigh.",
  "If you can't outsing KYC, write your own verse.",
  "Chase gas fees, but never chase losses, let the friction be your muse.",
  "Never trust degens, let your patience be your serenade.",
  "If you can't outsing the crypto, write your own melody.",
  "Not all wallets are sung in the same key.",
  "If you can't outsing payouts, write your own refrain."
];

async function postDailyQuote(): Promise<void> {
  if (!process.env.KV_URL) return;

  const { kv } = await import('@vercel/kv');

  // Get today's date for the key
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const dailyQuoteKey = `daily_quote_${today}`;

  // Check if we've already posted today's quote
  const existingQuote = await kv.get(dailyQuoteKey);
  if (existingQuote) return; // Already posted

  // Select a random quote
  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  // Create the daily quote message
  const dailyQuoteMessage = {
    user: CREATOR_ADDRESS,
    text: `💭 ${randomQuote}`,
    ts: Date.now(),
    dailyQuote: true // Special flag to identify daily quotes
  };

  // Store the quote in Redis with the daily key for tracking
  await kv.set(dailyQuoteKey, dailyQuoteMessage, { ex: 12 * 60 * 60 }); // Expire in 12 hours

  // Add to the trollbox messages
  const KEY = 'trollbox';
  await kv.lpush(KEY, dailyQuoteMessage);
  await kv.ltrim(KEY, 0, 19); // Keep only last 20 messages
}

export default withUsageTracking(async (req: Request) => {
  // Only allow POST requests (from cron)
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    await postDailyQuote();
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Failed to post daily quote:', error);
    return new Response(JSON.stringify({ error: 'Failed to post daily quote' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}, 'daily-quote-cron', 'chat');