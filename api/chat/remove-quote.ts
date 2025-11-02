import { withUsageTracking } from '../cache/usage-tracker'

// api/chat/remove-quote.ts
// Cron job endpoint to remove daily quote at noon

export const config = { runtime: 'edge' }

const CREATOR_ADDRESS = '6o1iE4cKQcjW4UFd4vn35r43qD9LjNDhPGNUMBuS8ocZ';

async function removeDailyQuote(): Promise<void> {
  if (!process.env.KV_URL) return;

  const { kv } = await import('@vercel/kv');

  // Get today's date for the key
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const dailyQuoteKey = `daily_quote_${today}`;

  // Get the stored daily quote
  const storedQuote = await kv.get(dailyQuoteKey) as any;
  if (!storedQuote) return; // No quote to remove

  // Remove from the trollbox messages
  const KEY = 'trollbox';

  // Get all messages and filter out the daily quote
  const allMessages = await kv.lrange(KEY, 0, -1) as any[];
  const filteredMessages = allMessages.filter((msg: any) =>
    !(msg.dailyQuote && msg.ts === storedQuote.ts && msg.user === CREATOR_ADDRESS)
  );

  // Clear the list and add back the filtered messages
  await kv.del(KEY);
  if (filteredMessages.length > 0) {
    // Add messages back in reverse order (newest first)
    for (const msg of filteredMessages.reverse()) {
      await kv.lpush(KEY, msg);
    }
    // Trim to keep only last 20 messages
    await kv.ltrim(KEY, 0, 19);
  }

  // Remove the stored daily quote key
  await kv.del(dailyQuoteKey);
}

export default withUsageTracking(async (req: Request) => {
  // Only allow POST requests (from cron)
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    await removeDailyQuote();
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Failed to remove daily quote:', error);
    return new Response(JSON.stringify({ error: 'Failed to remove daily quote' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}, 'remove-quote-cron', 'chat');