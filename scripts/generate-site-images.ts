/**
 * Generate the site's two raster images:
 *   - public/og-image.png (1200x630), the default social sharing card
 *   - public/apple-touch-icon.png (180x180), the home-screen icon
 *
 * Both use the site's dark palette (see src/styles/global.css). The card shows
 * the terminal window with a fixed example cron time. The outputs are
 * committed, so this only needs to run when the design changes.
 *
 * Run: npm run site-images
 */

import sharp from "sharp";
import { resolve } from "node:path";

const WIDTH = 1200;
const HEIGHT = 630;
const FONT = "Menlo, 'SF Mono', Monaco, 'Cascadia Mono', 'Fira Code', monospace";

// Dark palette from src/styles/global.css.
const color = {
  bg: "#0a0b10",
  bgAccent: "#10131c",
  terminal: "#11131a",
  titlebar: "#1a1d27",
  border: "rgba(255,255,255,0.08)",
  titlebarText: "#cbd5f5",
  prompt: "#d5d9e5",
  clock: "#e2e8f0",
  muted: "#9aa3b2",
};

// Example time: 14:30 on 16 Nov, a Monday.
const fields = [
  { value: "30", label: "MIN" },
  { value: "14", label: "HOUR" },
  { value: "16", label: "DAY" },
  { value: "11", label: "MONTH" },
  { value: "01", label: "WEEKDAY" },
];

const pitch = 180;
const firstCenter = 205;

const fieldMarkup = fields
  .map((field, i) => {
    const x = firstCenter + i * pitch;
    return `
      <text x="${x}" y="425" text-anchor="middle" font-size="92" font-weight="700" fill="${color.clock}">${field.value}</text>
      <text x="${x}" y="472" text-anchor="middle" font-size="20" letter-spacing="3" fill="${color.muted}">${field.label}</text>`;
  })
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" font-family="${FONT}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="0%" r="90%">
      <stop offset="0%" stop-color="${color.bgAccent}" />
      <stop offset="100%" stop-color="${color.bg}" />
    </radialGradient>
    <clipPath id="window"><rect x="100" y="90" width="1000" height="450" rx="24" /></clipPath>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  <rect x="100" y="90" width="1000" height="450" rx="24" fill="${color.terminal}" stroke="${color.border}" stroke-width="2" />
  <g clip-path="url(#window)">
    <rect x="100" y="90" width="1000" height="72" fill="${color.titlebar}" />
  </g>
  <circle cx="145" cy="126" r="9" fill="#ff5f57" />
  <circle cx="177" cy="126" r="9" fill="#febc2e" />
  <circle cx="209" cy="126" r="9" fill="#28c840" />
  <text x="248" y="134" font-size="24" font-weight="700" letter-spacing="2" fill="${color.titlebarText}">CRONTAB CLOCK</text>
  <text x="145" y="270" font-size="48" fill="${color.prompt}">~/ $ crontab --now</text>
  ${fieldMarkup}
  <text x="600" y="590" text-anchor="middle" font-size="24" fill="${color.muted}">crontab.dwk.io</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile(resolve("public", "og-image.png"));
console.log("Generated public/og-image.png (1200x630)");

// Full-bleed square: iOS applies its own rounded-corner mask.
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="${color.terminal}" />
  <circle cx="90" cy="90" r="58" fill="none" stroke="${color.clock}" stroke-width="8" />
  <line x1="90" y1="90" x2="90" y2="52" stroke="${color.clock}" stroke-width="9" stroke-linecap="round" />
  <line x1="90" y1="90" x2="116" y2="104" stroke="${color.clock}" stroke-width="9" stroke-linecap="round" />
  <circle cx="90" cy="90" r="6" fill="#28c840" />
</svg>`;

await sharp(Buffer.from(iconSvg)).png().toFile(resolve("public", "apple-touch-icon.png"));
console.log("Generated public/apple-touch-icon.png (180x180)");
