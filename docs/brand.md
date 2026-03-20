# Brand — Crontab Clock

## Identity

- **Site name:** Crontab Clock
- **Type:** Personal web art project
- **Owner:** dwk
- **URL:** crontab.dwk.io
- **Tagline:** The current time in crontab format.

## Visual Identity

**Vibe:** Hacker-elegant. A macOS terminal window floating on a dark gradient. Clean, precise, playful.

**Colors:**
- Light mode: white terminal on soft gray-blue background
- Dark mode: near-black terminal on deep charcoal with subtle blue glow
- Traffic light dots: red `#ff5f57`, yellow `#febc2e`, green `#28c840`
- Supports `prefers-color-scheme` with no toggle — follows system preference

**Typography:** Monospace system stack — `"SF Mono", Menlo, Monaco, "Cascadia Mono", "Fira Code", monospace`. Used for everything — headings, body, clock display.

**Layout:** Single centered terminal window. No navigation. No blog. Minimal footer.

**Interaction:**
- Command types out character-by-character on load
- Clock updates every second
- Hovering/focusing individual cron fields reveals their label (minute, hour, etc.)
- Blinking cursor disappears after command finishes typing
- Respects `prefers-reduced-motion`

## Content

Single page: the crontab clock. No blog, no additional pages.

## Footer

Minimal: CC-BY 4.0 license with Creative Commons icons, link to dwk.io.

## Accessibility

- WCAG AA contrast in both light and dark modes
- `aria-live="polite"` on the clock for screen readers
- `aria-label` on each clock field
- Keyboard-focusable clock fields with visible focus indicators
- Skip link to main content
- Reduced motion support
