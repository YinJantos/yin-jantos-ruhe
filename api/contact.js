'use strict';

const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function json(res, status, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(body);
}

function clean(value, max) {
  return String(value || '')
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .trim()
    .slice(0, max);
}

function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 254;
}

function limited(ip) {
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  attempts.set(ip, recent);
  return recent.length > MAX_ATTEMPTS;
}

module.exports = async function contact(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return json(res, 405, { message: 'Diese Route akzeptiert nur Kursanfragen.' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  } catch {
    return json(res, 400, { message: 'Die Anfrage enthält ungültige Daten.' });
  }

  if (clean(body.website, 200)) return json(res, 200, { ok: true });

  const ip = clean(
    req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'unknown',
    80
  );
  if (limited(ip)) {
    return json(res, 429, {
      message: 'Zu viele Anfragen in kurzer Zeit. Bitte versuche es später erneut.',
    });
  }

  const name = clean(body.name, 100);
  const email = clean(body.email, 254);
  const phone = clean(body.phone, 60);
  const course = clean(body.course, 120);
  const location = clean(body.location, 160);
  const message = clean(body.message, 3000);
  const privacy = body.privacy === 'on' || body.privacy === true || body.privacy === 'true';

  if (!name || !validEmail(email) || !course || !location || message.length < 10 || !privacy) {
    return json(res, 400, {
      message: 'Bitte prüfe die Pflichtfelder und die Datenschutzbestätigung.',
    });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || 'hello@njume.studio';
  if (!apiKey || !from) {
    return json(res, 503, {
      message: 'Der E-Mail-Versand ist noch nicht vollständig eingerichtet.',
    });
  }

  const text = [
    'Neue Kursanfrage über Yin & Jantos',
    '',
    `Name: ${name}`,
    `E-Mail: ${email}`,
    `Telefon: ${phone || 'nicht angegeben'}`,
    `Interesse: ${course}`,
    `Standort: ${location}`,
    '',
    'Nachricht:',
    message,
    '',
    `Eingang: ${new Date().toISOString()}`,
  ].join('\n');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `yin-jantos-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Neue Yin-&-Jantos-Anfrage: ${course}`,
      text,
    }),
  });

  if (!response.ok) {
    console.error('Resend rejected Yin & Jantos contact request', response.status);
    return json(res, 502, { message: 'Die Übermittlung ist gerade nicht möglich.' });
  }

  return json(res, 200, { ok: true });
};
