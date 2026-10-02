# RakeLink: Rail Freight Booking and Tracking

ITBT live class exercise: a web-based business app for a transportation and logistics business, published with GitHub Pages.

**Student:** Jaikee Kumar, MBA (Logistics and Supply Chain Management), Gati Shakti Vishwavidyalaya, Vadodara
**Live site:** https://jacky-021.github.io/Jaikee-Kumar-BusinessApp/

> RakeLink is a fictional company. Prices, contacts, consignments and dashboard figures are sample data created for this exercise.

## Project summary

| Question | Answer |
|---|---|
| Business | RakeLink, a rail freight booking service based in Vadodara, Gujarat (option 4 in the exercise list) |
| Problem | Small and mid-size shippers have no siding and no freight-tariff team. They struggle to get wagons, do not know the cost up front, and cannot see where their cargo is once it is loaded. |
| Customer | Steel, cement and fertiliser makers, agri-commodity traders, exporters moving containers to ports, and small shippers booking less than a full wagon |
| App | A booking and tracking site: service price list, operations dashboard, consignment tracker and enquiry form |
| Interactive feature | **Track order.** Enter a consignment ID such as `TRK1025` to see status, current location, expected arrival, rail partner and contact. |
| Manager's dashboard | Total bookings, delivered, in transit, delayed, on-time delivery, wagon turnaround, plus bookings per month, cargo mix, causes of delay and a "needs attention today" list |

## Exercise checklist

| Requirement | Where it is |
|---|---|
| 1. Home: business name, logo, purpose, short description, "Get Started" button | `#home` section |
| 2. About: what the company does, target customers, service area, value proposition | `#about` section |
| 3. Services: table with service, description, price | `#services` section |
| 4. Dashboard: 4 to 6 KPIs and at least one chart | `#dashboard` section (6 KPIs, 3 visualisations) |
| 5. Contact: details, email, phone, location, enquiry form | `#contact` section |
| Step 4: at least 5 working hyperlinks, each with a business purpose | See the table below (more than 10) |
| Step 5: one interactive business feature | Consignment tracker in `#track` |
| Step 7: GitHub Pages with `index.html`, `style.css`, `script.js`, `images/`, `README.md` | This repository |

### Hyperlinks and why each exists

| Link | Purpose |
|---|---|
| Get Started: Home to Services | Moves a new visitor straight to prices |
| Book this service: Services to Contact | Opens the enquiry form with that service already selected |
| Open delayed consignment TRK1018: Dashboard to Track | Lets a manager jump from a delay alert to the shipment detail |
| Open in-transit consignment TRK1025: Dashboard to Track | Shows what the customer sees for a live shipment |
| Get directions on Google Maps | Helps a customer or driver reach the office |
| Email and phone links | Contact the booking desk in one tap |
| LinkedIn | Company updates and credibility |
| FOIS portal | Register wagon demand and check official consignment status |
| Freight Business Development portal | Look up routes and distances before quoting |
| DFCCIL | Corridor details for the JN Port to Dadri container lane |
| Indian Railways | Freight circulars and tariff changes that affect pricing |

## Files

```
index.html     page structure and all content
style.css      design and responsive layout
script.js      charts, tracker, enquiry form, navigation (no libraries)
images/        logo.svg, favicon.svg, hero-train.svg, network-map.svg
README.md      this file
```

Sample consignment IDs for the tracker: `TRK1001` (delivered), `TRK1018` (delayed), `TRK1025` (in transit), `TRK1030` (booked), `TRK1042` (in transit), `TRK1055` (at destination terminal). Typing only the digits, for example `1025`, also works.

## Before you submit: make it yours

1. **Make the enquiry form send real emails (2 minutes).**
   - Go to https://web3forms.com, type your email address and click **Create Access Key**. The key arrives in your inbox.
   - Open `script.js` and, in `CONFIG`, replace `PASTE_YOUR_ACCESS_KEY_HERE` with that key.
   - After you publish, send one test enquiry from the live site. It arrives in your inbox. Without a key, the form still works, but it only offers the WhatsApp and email-app backup buttons.
2. **WhatsApp:** in `CONFIG`, set `whatsapp` to your number as digits only, for example `919876543210`.
3. **Email:** replace `bookings@rakelink.example` with your own email in `index.html` (Contact section) and in `script.js` (`CONFIG.email`).
4. **Phone:** replace `+91 90000 12345` and `tel:+919000012345` in `index.html`.
5. **LinkedIn:** replace `https://www.linkedin.com/` in `index.html` with your own profile or page URL.
7. **Data:** all dashboard numbers and consignments are in the `DASHBOARD` and `SHIPMENTS` blocks at the top of `script.js`.

## Run it on your computer

Open `index.html` in any browser. No build step or installation is needed. Fonts load from Google Fonts, so use an internet connection to see the intended typography.

## Publish on GitHub Pages

1. On GitHub, create a **public** repository named `Jaikee-Kumar-BusinessApp`.
2. Upload the files so that `index.html` is at the **top level** of the repository, not inside another folder. Choose **Add file > Upload files** and drag in `index.html`, `style.css`, `script.js`, `README.md` and the `images` folder. The four image files must end up *inside* a folder called `images` in the repository, never loose at the top level. After uploading, check that the file list shows an `images` folder, and open it to confirm it holds 4 files. If the folder did not upload, use the folder trick in Troubleshooting below.
3. Commit the upload to the `main` branch.
4. Go to **Settings > Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**. Choose branch `main` and folder `/ (root)`, then click **Save**.
5. Wait one or two minutes. The live address appears at the top of the Pages screen and follows this pattern: `https://username.github.io/Jaikee-Kumar-BusinessApp/`
6. Open the link, click every nav item and sample ID once, then submit that link.

## Troubleshooting

| Problem | Fix |
|---|---|
| The live site has no logo, train picture or map, or looks broken on a phone | The `images` folder is missing or the image files are loose at the top level. Open `https://username.github.io/Jaikee-Kumar-BusinessApp/images/logo.svg`. If you see the logo, the folder is fine. If you see "404", use the folder trick below. |
| The page shows plain unstyled text | `style.css` is missing or has a different name. All three files must be at the top level with these exact names. |
| The link shows "404" | Wait two minutes. Then check that `index.html` is in the main file list and that Settings > Pages is set to branch `main`, folder `/ (root)`. |
| The enquiry form does not send an email | Check that you pasted the Web3Forms key in `script.js`, and test on the live link, not by double-clicking `index.html`. Click **Send on WhatsApp** or **Send by email app** as a backup. |
| You edited a file but the live site did not change | Upload the edited file again (same name, it replaces the old one), wait a minute, then refresh with Cmd + Shift + R. |

**Folder trick (works in any browser):** in your repository click **Add file > Create new file**. In the name box type `images/start.txt` (typing the `/` creates the folder), type any letter in the editor, and click **Commit changes**. Then open the new `images` folder, click **Add file > Upload files**, drag in the four SVG files (`logo.svg`, `favicon.svg`, `hero-train.svg`, `network-map.svg`), and commit.

## Two-minute presentation

1. **What is your business?** RakeLink books wagons, rakes and containers on Indian Railways for shippers who have no siding of their own.
2. **What problem are you solving?** Shippers cannot easily get wagons, do not know the price up front, and lose sight of their cargo after loading.
3. **Who is your customer?** Steel, cement and fertiliser producers, commodity traders, exporters and small shippers in Gujarat, Maharashtra and Madhya Pradesh.
4. **What does your app do?** Customers compare services and prices, send an enquiry, and track any consignment by ID. Try `TRK1025` live.
5. **What information does your dashboard give the manager?** Bookings, delivered, in transit and delayed counts, on-time delivery, wagon turnaround, the cargo mix, and why 50 consignments are delayed. The "needs attention today" panel tells the manager what to act on first: terminal congestion causes the most delays, and wagon shortage on the Korba to Surat coal lane needs an extra allotment request.

## Credits

Built for the Information Technology and Business Transportation (ITBT) class exercise. Typefaces: Barlow and Barlow Condensed (Google Fonts, SIL Open Font License). Illustrations and logo drawn as SVG for this project.
