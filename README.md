# Wood & Grains Furniture — Website

A simple showcase site. Every product links to a pre-filled **WhatsApp enquiry** — no cart, no checkout, no payments.

Products (name, price, category, photo) are managed through a real admin page at **`/admin.html`**, backed by a free [Supabase](https://supabase.com) project. No GitHub, no spreadsheets, no code editing needed for day-to-day updates.

## One-time setup

### 1. Create your Supabase project
- Sign up free at supabase.com (no credit card).
- Create a new project, pick a region, save your database password somewhere safe.

### 2. Create the `products` table
In **Table Editor → New table**, name it `products`, and add these columns (in addition to the default `id` and `created_at` columns Supabase adds automatically):

| Column      | Type |
|-------------|------|
| name        | text |
| price       | int8 |
| category    | text |
| material    | text |
| image_url   | text |
| description | text |

Leave **Row Level Security (RLS) off** for this table — this is a small showcase site with no logins, so the tradeoff is fine. (If you'd rather lock it down properly later, RLS policies are how you'd do that — ask me and I can walk you through it.)

### 3. Create a storage bucket for photos
**Storage → New bucket** → name it exactly `product-images` → set it to **Public**. This is where uploaded photos are actually stored; the table just holds a link to each one.

### 4. Get your API keys
**Project Settings → API** → copy the **Project URL** and the **anon public** key.

Open `js/supabase-config.js` in this project and paste them in:
```js
const SUPABASE_URL = 'https://yourproject.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
const ADMIN_PASSWORD = 'pick-something-only-you-know';
```
The anon key is safe to have in a public site — it can only do what your table/bucket permissions allow.

`ADMIN_PASSWORD` is a simple gate on `/admin.html` so casual visitors can't find it and start editing — it is **not** real security (anyone who views the page source can see it), just a deterrent. Good enough for a small business site; let me know if you'd like proper login-based security later.

## Deploying (free, no backend server, no ongoing cost)

1. Push this folder to a GitHub repository (one-time — you won't need to touch this again for routine updates).
2. Sign up free at [netlify.com](https://netlify.com), "Add new site → Import an existing project", pick your repo, deploy. No build command needed, it's a static site.
3. You'll get a live `yoursite.netlify.app` URL. Attach your own domain later if you want, still free.

## Using it day to day

- Go to `yoursite.netlify.app/admin.html`, enter your admin password.
- Fill in the name, price, category, material, optional description, and choose a photo.
- Click **Save product**. It appears on your live site within seconds — no redeploy needed.
- Edit or delete existing products from the list on the same page.

That's the entire workflow going forward: open the admin page, fill a form, upload a photo, done.

## Changing the WhatsApp number
Open `js/script.js` and change:
```js
const WHATSAPP_NUMBER = '9746841327';
```
Use the full number with country code, no `+`, spaces, or dashes (e.g. `919746841327`).

## Note on Supabase's free tier
A free Supabase project pauses itself after 7 days with zero activity. If that happens, log into your Supabase dashboard once and click "Restore" — it takes a few seconds and nothing is lost. This only happens if literally nobody visits your site or admin page for a full week.
