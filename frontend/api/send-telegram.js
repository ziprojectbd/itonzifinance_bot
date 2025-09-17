// ESM-compatible Vercel Serverless Function
// Reads TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID from environment variables

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID || '@zikrulislam84';

    if (!token) {
      return res.status(500).json({ ok: false, error: 'Missing TELEGRAM_BOT_TOKEN env' });
    }

    // Parse JSON body safely
    let body = req.body ?? {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { return res.status(400).json({ ok: false, error: 'Invalid JSON body' }); }
    }

    const { subject, category, message } = body || {};
    if (!subject || !category || !message) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    // Collect metadata
    const serverTime = new Date().toISOString();
    const clientIpHeader = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '';
    const clientIp = Array.isArray(clientIpHeader)
      ? clientIpHeader[0]
      : (clientIpHeader || '').toString().split(',')[0].trim();
    const userAgent = req.headers['user-agent'] || '';

    

    const text = [
      `Subject: ${subject}`,
      `Category: ${category}`,
      `Message: ${message}`,
      '',
      '--- Meta ---',
      `Server time: ${serverTime}`,
      `Client IP: ${clientIp || 'N/A'}`,
      `User agent: ${userAgent || 'N/A'}`,
    ].join('\n');

    const tgResp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text })
    });

    const data = await tgResp.json().catch(() => ({}));
    if (!tgResp.ok || !data?.ok) {
      console.error('Telegram sendMessage failed', {
        status: tgResp.status,
        statusText: tgResp.statusText,
        response: data,
      });
      return res.status(502).json({ ok: false, error: data?.description || `Telegram API error (${tgResp.status})` });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Server error sending telegram message', err);
    return res.status(500).json({ ok: false, error: err?.message || 'Server error' });
  }
}
