// server.js
const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const app = express();
const PORT = 5000;

app.use(express.json());

const FILE = path.join(__dirname, '.trollbox.json');
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function validateUser(user) {
  const clean = String(user ?? '').trim();
  if (!clean) return 'anon';
  if (clean.length > 24) return clean.slice(0, 24);
  return clean;
}
function validateText(text) {
  const clean = String(text ?? '').trim();
  if (!clean) return '';
  if (clean.length > 256) return clean.slice(0, 256);
  return clean;
}

async function getMessages() {
  try {
    const data = await fs.readFile(FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}
async function setMessages(msgs) {
  await fs.writeFile(FILE, JSON.stringify(msgs), 'utf8');
}

app.options('/api/chat', (req, res) => {
  res.set(corsHeaders).send('OK');
});

app.get('/api/chat', async (req, res) => {
  const list = (await getMessages()).slice(-20).reverse();
  res.set(corsHeaders).json(list);
});

app.post('/api/chat', async (req, res) => {
  const { user = 'anon', text } = req.body;
  const cleanUser = validateUser(user);
  const cleanText = validateText(text ?? '');
  if (!cleanText) return res.status(400).set(corsHeaders).send('Empty');
  const msg = { user: cleanUser, text: cleanText, ts: Date.now() };
  const msgs = await getMessages();
  const newMsgs = [...msgs, msg].slice(-20);
  await setMessages(newMsgs);
  res.set(corsHeaders).json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}/api/chat`);
});
