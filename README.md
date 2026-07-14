# Al Teneen Al Ahmar Karate — Website

Static website for **AL TENEEN AL AHMAR KARATE CLUB** (التنين الأحمر للكاراتيه), Al Dhaid, Sharjah.

## Preview locally

Just open `index.html` in a browser, or use VS Code's **Live Server** extension.

## Site details (already configured)

1. **WhatsApp number** — set to the office number `971501643009` at the top of
   [js/main.js](js/main.js). Every contact button on the site uses this one value.

2. **Class schedule** — Mon–Sat: 9:00 AM–12:00 PM and 3:00 PM–10:00 PM;
   Sunday: office only. Edit in the Schedule section of [index.html](index.html).

3. **Photos** — real photos are live. Originals are in `images/`, and the site uses
   web-optimized copies in `images/web/` (resized + compressed). To swap a photo,
   replace the matching file in `images/web/` (e.g. `chief.jpg`, `kickboxing.jpg`,
   `yoga.jpg`, `fitness.jpg`, `students.jpg`, `karate.jpg`, `gallery-1..3.jpg`).

## Features

- English / Arabic toggle (عربي button in the navbar) with full RTL layout, remembered between visits
- Red / black / gold "Red Dragon" theme
- Scroll-reveal animations, animated stat counters, belt-journey animation
- Every contact button opens WhatsApp with a pre-filled enquiry message (in the selected language)
- Floating WhatsApp button, Google Maps embed of Al Dhaid, Instagram links
- Fully responsive with mobile slide-in menu

## Deploy (free options)

- **Netlify Drop**: drag the folder onto https://app.netlify.com/drop
- **GitHub Pages**: push this folder to a repo → Settings → Pages
- **Vercel**: `npx vercel` inside the folder
