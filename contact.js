// api/contact.js
// Vercel serverless function — handles contact form submissions
//
// SETUP:
// 1. Create a free account at resend.com
// 2. Add and verify your sending domain in Resend
// 3. Create an API key in Resend dashboard
// 4. In Vercel → Project Settings → Environment Variables, add:
//    RESEND_API_KEY = re_xxxxxxxxxxxx  (your Resend API key)
//    CONTACT_TO    = you@yourdomain.com (where emails go)
//    CONTACT_FROM  = noreply@clientdomain.com (verified sender domain)
//
// The /api folder is auto-detected by Vercel.
// This function is available at: https://yourclientsite.com/api/contact

export default async function handler(req, res) {

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Pull fields from request body
  const { name, email, message } = req.body;

  // Basic server-side validation (always validate on the server,
  // even if you also validate on the client)
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // Sanitize inputs (strip HTML tags to prevent injection)
  const safe = (str) => String(str).replace(/<[^>]*>/g, '').trim().slice(0, 2000);
  const safeName    = safe(name);
  const safeEmail   = safe(email);
  const safeMessage = safe(message);

  // Check required env vars
  const { RESEND_API_KEY, CONTACT_TO, CONTACT_FROM } = process.env;

  if (!RESEND_API_KEY || !CONTACT_TO || !CONTACT_FROM) {
    console.error('Missing required environment variables');
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  try {
    // Send email via Resend API
    // Docs: https://resend.com/docs/api-reference/emails/send-email
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to:   CONTACT_TO,
        reply_to: safeEmail,
        subject: `New inquiry from ${safeName}`,
        text: [
          `Name: ${safeName}`,
          `Email: ${safeEmail}`,
          ``,
          `Message:`,
          safeMessage,
        ].join('\n'),
        // Optional: add an html version for nicer formatting
        html: `
          <h2 style="font-family:sans-serif;color:#1e293b;">New Contact Form Submission</h2>
          <table style="font-family:sans-serif;font-size:15px;color:#334155;border-collapse:collapse;">
            <tr>
              <td style="padding:6px 12px 6px 0;font-weight:600;color:#64748b;">Name</td>
              <td style="padding:6px 0;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:6px 12px 6px 0;font-weight:600;color:#64748b;">Email</td>
              <td style="padding:6px 0;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
            </tr>
          </table>
          <div style="margin-top:16px;font-family:sans-serif;font-size:15px;color:#334155;">
            <p style="font-weight:600;color:#64748b;margin-bottom:8px;">Message</p>
            <p style="white-space:pre-line;">${safeMessage}</p>
          </div>
        `,
      }),
    });

    if (!resendRes.ok) {
      const errorBody = await resendRes.json();
      console.error('Resend API error:', errorBody);
      return res.status(502).json({ error: 'Failed to send email' });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Contact handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
