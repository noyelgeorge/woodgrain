# Wood & Grains Furniture — Website

A simple, no-backend showcase site. Every product links to a pre-filled **WhatsApp enquiry** — there is no cart, checkout, or payment flow, on purpose.

## What changed from the original template

- Removed cart, wishlist, and checkout pages/logic — not needed for a "message us on WhatsApp" business.
- Product info moved out of the code and into one file: **`products.json`**. The site now *fetches* this file instead of having products hardcoded in JavaScript.
- Every product card and product page has a single **"Enquire on WhatsApp"** button that opens WhatsApp with the product name + price pre-filled, addressed to the number set in `js/script.js` (`WHATSAPP_NUMBER`).

## Adding / editing products (no coding)

You have two ways to do this:

### Option A — Edit `products.json` directly
Open `products.json`, copy an existing product block, change the fields, save. Each product looks like:
```json
{
  "id": 9,
  "name": "Coffee Table",
  "price": 8999,
  "category": "living-room",
  "material": "wood",
  "image": "products/coffee-table.jpg",
  "description": "Optional short description."
}
```
Categories must be one of: `living-room`, `bedroom`, `dining-room`, `office`, `storage`.
Put the matching image in `images/products/` with the exact filename you used above.

### Option B — Use the admin panel at `/admin` (recommended, no file editing at all)
This repo already includes a **Decap CMS** admin panel (`/admin`). Once set up (steps below), you get a simple web form: fill in name/price/category, drag in a photo, hit **Publish**. It commits the change to GitHub and your site rebuilds automatically — no code, no zip files, no manual uploads.

## Deploying (free, no backend/server cost)

1. **Push this folder to a GitHub repository** (create a free GitHub account if you don't have one, create a new repo, upload these files — or ask a developer friend to `git push` it for you once).
2. **Sign up at [netlify.com](https://netlify.com)** (free) and click "Add new site → Import an existing project", pick your GitHub repo. No build command needed — it's a static site. Deploy.
3. You'll get a free `yoursite.netlify.app` URL immediately; you can attach your own domain later for free (just DNS, no extra hosting cost).

## Turning on the `/admin` panel (Option B)

1. In `admin/config.yml`, change `repo: YOUR_GITHUB_USERNAME/YOUR_REPO_NAME` to your actual GitHub repo, e.g. `repo: john123/woodgrain-site`.
2. In Netlify: **Site settings → Identity → Enable Identity**, then **Enable Git Gateway** (under Identity → Services). This lets the admin panel commit to GitHub without you needing a GitHub login for every editor.
3. Invite yourself (or staff) as a user under **Identity → Invite users**.
4. Visit `yoursite.netlify.app/admin`, log in, and you'll see a "Products" editor — add, edit, or remove products and upload images there directly.

That's it — after that, adding a product is: open `/admin`, fill a form, upload a photo, click Publish. No terminal, no code, no separate hosting bill.

## Changing the WhatsApp number
Open `js/script.js` and change the line near the top:
```js
const WHATSAPP_NUMBER = '9746841327';
```
Use the full number with country code and no `+`, spaces, or dashes (e.g. `919746841327`).
