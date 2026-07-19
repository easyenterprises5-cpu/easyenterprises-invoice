# Easy Enterprises — Invoicing App

A simple invoicing app for Easy Enterprises: create invoices with CGST/SGST,
manage clients, track paid/overdue status, and print or save invoices as PDF.

## Run it locally (optional, to test before deploying)

You'll need [Node.js](https://nodejs.org) installed on your computer.

```
npm install
npm run dev
```

Then open the link it prints (usually http://localhost:5173).

## Deploy to Vercel (same as your other sites)

1. Create a new GitHub repository and upload all these files to it
   (same way you did for the Invisible Safety Grill site).
2. Go to https://vercel.com and log in (or sign up with GitHub).
3. Click "Add New… → Project", select this GitHub repo, and click "Deploy".
4. Vercel will detect it's a Vite project automatically — no settings to change.
5. After a minute you'll get a live URL like `easy-enterprises-invoice.vercel.app`.

That's it — the site is now live and you can open it from any device.

## Important note about your data

Invoices, clients, and settings are saved in your browser's local storage.
This means:
- Your data stays on the device/browser you used to create it.
- If you clear your browser data, or switch to a different phone/browser,
  you won't see the same invoices there.
- This is fine for one person on one device. If you want to access your
  invoices from multiple devices (e.g. phone and laptop) or have staff
  use it too, let me know and I can help you add real shared storage
  (a small database) instead.
