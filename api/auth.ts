export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { password } = await req.json();
  const valid = password === process.env.ACCESS_OVERRIDE_PASSWORD;
  return new Response(JSON.stringify({ valid }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
