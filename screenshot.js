const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:8080';
const SCREENSHOT_DIR = path.join(__dirname, 'assets', 'screenshots');

// Sections to capture - { id, name, description }
const SECTIONS = [
  { id: 'home', name: 'hero', desc: 'Hero Section — Parallax image, animated glow orbs, floating emojis, and CTA buttons' },
  { id: 'dailyBar', name: 'daily-bar', desc: '#16 Daily Update Bar — Rotating notification banner above navbar with close toggle' },
  { id: 'navbar', name: 'navbar', desc: 'Navigation Bar — Fixed navbar with logo, links, occupancy badge, theme toggle, and hamburger menu' },
  { id: 'promo', name: 'promo', desc: 'Promo Cards — Birthday special, student discount, and group deals with countdown timer (#3)' },
  { id: 'perks', name: 'brand-perks', desc: 'Brand Perks — 3-column feature grid: budget-friendly, AC comfort, spacious room (with 3D tilt cards)' },
  { id: 'stats', name: 'stats', desc: 'Live Stats — Animated counters: 15,000+ customers, 5.0 rating, 3+ years, 50+ menu variants' },
  { id: 'kalkulator', name: 'kalkulator-harga', desc: '#2 Kalkulator Harga + #23 Group Bill Estimator — Price calculator with tax & service charge' },
  { id: 'moodpicker', name: 'mood-picker', desc: '#13 Mood-Based Menu Picker — Select mood (spicy, soup, BBQ, sweet, fresh, budget) for menu recommendations' },
  { id: 'shabuTimerSection', name: 'shabu-timer', desc: '#12 Shabu Timer — Interactive 90-minute AYCE timer with progress bar and quick presets' },
  { id: 'sogogiSuitSection', name: 'sogogi-suit', desc: '#14 Sogogi Suit Mini Game — Rock-paper-scissors vs bot, win Rp5k discount for next visit!' },
  { id: 'menu', name: 'menu-tabs', desc: 'Menu Showcase — 3 pricing cards (Regular, Grilled & Shabu, Wagyu) + 5 menu tabs' },
  { id: 'menu-meat', name: 'menu-daging', desc: 'Menu — Daging Premium tab with 14 meat items with real Unsplash photos' },
  { id: 'menu-sides', name: 'menu-side-dish', desc: 'Menu — Side Dish Korea tab: Kimchi, Tteokbokki, Gyoza, Corn Cheese, and more' },
  { id: 'menu-drinks', name: 'menu-minuman', desc: 'Menu — Minuman tab: Es Teh, Lemon Tea, Soju, Matcha Latte, and more' },
  { id: 'menu-dessert', name: 'menu-dessert', desc: 'Menu — Dessert tab: Ice Cream, Bingsu, Mochi, Pisang Goreng, Fruit Cocktail' },
  { id: 'testimonials', name: 'testimonials', desc: 'Testimonials Carousel — 3 customer reviews with auto-play, navigation dots, and star ratings' },
  { id: 'gallery', name: 'gallery', desc: 'Gallery — 5-image magazine grid with lightbox viewer, zoom, and keyboard navigation' },
  { id: 'socialProof', name: 'google-reviews', desc: '#4 Google Reviews Widget — 5.0 rating simulation with review cards' },
  { id: 'igFeedSection', name: 'instagram-feed', desc: '#1 Instagram Feed — Simulated Instagram grid with emoji placeholders' },
  { id: 'dapurCamSection', name: 'dapur-cam', desc: '#20 Dapur Cam Corner — Rotating kitchen moments with emoji animation' },
  { id: 'panciRekomendasiSection', name: 'panci-rekomendasi', desc: '#21 Panci Rekomendasi — Fun \"scientific\" facts about Sogogi' },
  { id: 'reservation', name: 'reservation-form', desc: 'Reservation Form — Full form validation, availability checker, WhatsApp submission, and success modal' },
  { id: 'nearbyLandmarksSection', name: 'nearby-landmarks', desc: '#8 Nearby Landmarks — Stasiun Buaran, UNKRIS, Mall@Basura, and more' },
  { id: 'tablePredictionSection', name: 'table-turn-prediction', desc: '#24 Table Turn Prediction — Estimated wait time based on day/time' },
  { id: 'mejaPickerSection', name: 'meja-virtual-picker', desc: '#15 Meja Virtual Picker — Interactive table layout with availability status' },
  { id: 'qrCodeSection', name: 'qr-code', desc: '#11 QR Code Generator — QR menu with WhatsApp share button' },
  { id: 'loyaltyCardSection', name: 'loyalty-card', desc: '#17 Loyalty Card — Digital stamp card: collect 5 stamps → Free 1 pax!' },
  { id: 'contact', name: 'footer', desc: 'Footer / Contact — Location, map, hours, and WhatsApp reservation CTA' },
  { id: 'features-misc', name: 'floating-features', desc: 'Floating Features — WA float (#18), Music player (#19), Sogogi-mergency (#22), Share menu (#7), Back to top' },
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function takeScreenshot(page, filePath) {
  await page.screenshot({ path: filePath, fullPage: false, type: 'png' });
  console.log(`  ✓ Saved: ${path.basename(filePath)}`);
}

async function main() {
  // Ensure directory exists
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Taking screenshots...\n');

  for (const section of SECTIONS) {
    console.log(`📸 ${section.name} — ${section.desc}`);

    try {
      const url = section.id === 'features-misc'
        ? BASE_URL
        : `${BASE_URL}/#${section.id}`;

      await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
      await sleep(1500); // Wait for animations

      // For specific sections, scroll to make them visible
      if (section.id !== 'home' && section.id !== 'navbar' && section.id !== 'dailyBar' && section.id !== 'features-misc') {
        try {
          const selector = section.id === 'menu-meat' ? '#menu' :
                           section.id === 'menu-sides' ? '#menu' :
                           section.id === 'menu-drinks' ? '#menu' :
                           section.id === 'menu-dessert' ? '#menu' :
                           `#${section.id}`;

          // Click the section so it's in view, then wait
          await page.evaluate((sel) => {
            const el = document.querySelector(sel);
            if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
          }, selector);
          await sleep(1000);
        } catch (e) {
          console.log(`  ⚠ Could not scroll to #${section.id}`);
        }
      }

      // For navbar and daily bar, scroll to top first
      if (section.id === 'navbar' || section.id === 'dailyBar') {
        await page.evaluate(() => window.scrollTo(0, 0));
        await sleep(500);
      }

      // For menu tabs, click appropriate tab
      if (section.id.startsWith('menu-')) {
        const tabMap = {
          'menu-meat': 'meat',
          'menu-sides': 'sides',
          'menu-drinks': 'drinks',
          'menu-dessert': 'dessert',
        };
        const tab = tabMap[section.id];
        if (tab) {
          await page.evaluate((t) => {
            const btn = document.querySelector(`[data-tab="${t}"]`);
            if (btn) btn.click();
          }, tab);
          await sleep(1000);
        }
      }

      // For floating features, scroll near bottom where they're visible
      if (section.id === 'features-misc') {
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await sleep(1000);
        // Then scroll back up a bit to see floater buttons
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 1200));
        await sleep(500);
      }

      const filePath = path.join(SCREENSHOT_DIR, `${section.name}.png`);
      await takeScreenshot(page, filePath);

    } catch (err) {
      console.log(`  ✗ Error: ${err.message}`);
    }
  }

  // Take a full-page screenshot
  console.log(`\n📸 full-page — Complete website overview`);
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 15000 });
    await sleep(2000);
    const fullPagePath = path.join(SCREENSHOT_DIR, 'full-page.png');
    await page.screenshot({ path: fullPagePath, fullPage: true, type: 'png' });
    console.log(`  ✓ Saved: full-page.png`);
  } catch (err) {
    console.log(`  ✗ Error: ${err.message}`);
  }

  await browser.close();
  console.log('\n✅ All screenshots captured!');
}

main().catch(console.error);
