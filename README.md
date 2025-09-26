# Go Mejor Insurance — TCPA 1:1 Landing (Next.js + Vercel Postgres)

This is a ready-to-deploy project for **gomejorinsurance.com** with a TCPA-compliant lead form and server-side storage (Vercel Postgres).

## Quick Deploy (fastest)

1) **Create a Vercel account** → https://vercel.com  
2) **Create New > Storage > Postgres** (accept defaults).  
3) **Import this repo** (or Drag & Drop):  
   - Unzip this folder locally, `git init`, commit, push to GitHub, then "Import Project" in Vercel.  
4) Vercel will automatically inject Postgres environment variables for this project.  
5) **Add your domain** in Vercel: Project → Settings → Domains → `gomejorinsurance.com`.  
   - Follow the DNS steps Vercel gives you (nameservers or CNAME).  
6) **Visit your domain**, fill the form, and verify rows in Storage → Postgres → SQL editor (`SELECT * FROM leads_gomejorinsurance ORDER BY created_at DESC LIMIT 20;`).

## Local Dev

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Notes for 1:1 Compliance

- Legal entity: **The Mejor Communications, LLC and Power Group Partners**  
- Brand: **Go Mejor Insurance**  
- Domain: **gomejorinsurance.com**  
- The same entity/brand/domain appear in the footer, consent copy, Privacy, Terms, and schema.
- Consent checkbox is **not pre-checked** and the exact consent text is stored server-side.

## Where data goes

- API route: `app/api/lead/route.js`  
- Table: `leads_gomejorinsurance` (auto-created on first submit)  
- Captured: name, email, phone, zip, **IP**, user-agent, page URL, **exact consent text**, timestamp

## Optional (email notifications)

- Add a service like Resend/Mailgun in `route.js` to email yourself on each lead.
- Keep the database write for compliance logs.

## Customize contact

Edit `app/page.jsx` CONTACT constant for phone/email/address. Everything else is already set.
