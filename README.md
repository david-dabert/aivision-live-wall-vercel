# AIVISION Shared Tree — Vercel edition

Public English-language web app for collecting anonymous responses and grouping similar ideas with AI.

## Deploy on Vercel

1. Import this folder into a GitHub repository, then import the repository into Vercel; or run `npx vercel --prod` in this folder.
2. In Vercel, open **Integrations → Browse Marketplace**, install **Upstash Redis**, and connect it to this project. It adds the Redis environment variables automatically.
3. Add these environment variables in **Settings → Environment Variables**:
   - `OPENAI_API_KEY` — server-only API key for theme clustering.
   - `ADMIN_TOKEN` — a long, private facilitator password.
   - optional: `OPENAI_MODEL` — the text model to use.
4. Redeploy. Open `/wall?s=october-2026` on the projector. Participants scan the QR code and submit on the public page.

The facilitator enters `ADMIN_TOKEN` only when selecting **Group with AI** or **Reset**. The browser never receives the OpenAI key.

## Data minimisation

Do not ask for names, email addresses, or sensitive personal information. The app stores anonymous short answers in Vercel KV. When the facilitator presses **Group with AI**, those answers are sent to the OpenAI API solely to generate anonymous themes. Reset the session after the workshop.
