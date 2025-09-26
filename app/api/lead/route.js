import { sql } from '@vercel/postgres';

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      firstName, lastName, email, phone, zip,
      consentChecked, consentText, timestamp, pageUrl, userAgent
    } = body || {};

    if (!consentChecked) {
      return new Response(JSON.stringify({ ok: false, error: "Consent checkbox not checked." }), { status: 400 });
    }
    if (!firstName || !lastName || !email || !phone || !zip) {
      return new Response(JSON.stringify({ ok: false, error: "Missing required fields." }), { status: 400 });
    }

    const fwd = req.headers.get('x-forwarded-for') || "";
    const ip = fwd.split(',')[0].trim() || "unknown";

    await sql`
      CREATE TABLE IF NOT EXISTS leads_gomejorinsurance (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        zip TEXT NOT NULL,
        ip TEXT,
        user_agent TEXT,
        page_url TEXT,
        consent_text TEXT NOT NULL,
        brand TEXT NOT NULL,
        domain TEXT NOT NULL,
        submitted_at TEXT
      );
    `;

    await sql`
      INSERT INTO leads_gomejorinsurance
        (first_name, last_name, email, phone, zip, ip, user_agent, page_url, consent_text, brand, domain, submitted_at)
      VALUES
        (${firstName}, ${lastName}, ${email}, ${phone}, ${zip}, ${ip}, ${userAgent}, ${pageUrl}, ${consentText},
         ${"Go Mejor Insurance"}, ${"gomejorinsurance.com"}, ${timestamp});
    `;

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
}
