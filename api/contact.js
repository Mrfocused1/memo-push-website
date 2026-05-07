const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    await resend.emails.send({
      from: 'Memo Push Contact <noreply@memopush.app>',
      to: [process.env.CONTACT_TO_EMAIL || 'hello@memopush.app'],
      replyTo: email,
      subject: `[Memo Push Contact] ${subject} — from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <h2 style="color:#0a222e;margin-bottom:4px">New contact form submission</h2>
          <p style="color:#64748b;font-size:14px;margin-bottom:24px">Memo Push Website</p>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:14px;width:100px">Name</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:14px">${escapeHtml(name)}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:14px">Email</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:14px"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:14px">Subject</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:14px">${escapeHtml(subject)}</td></tr>
          </table>
          <div style="margin-top:24px">
            <p style="color:#64748b;font-size:14px;margin-bottom:8px">Message</p>
            <div style="background:#f8fafc;border-radius:8px;padding:16px;font-size:14px;white-space:pre-wrap">${escapeHtml(message)}</div>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send message' });
  }
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
