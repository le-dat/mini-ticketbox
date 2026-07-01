# DESIGN.md — Mini Ticketbox

## Identity
**Sector:** Ticket Booking / E-commerce
**Mood:** High-urgency, premium dark, live-event energy
**Geometry:** Rounded (20–32px bento cards) + Sharp buttons (pill 32px)
**Motion:** Subtle spring-physics hover lifts, ping animations for live status

## Color Tokens
| Token | Value | Usage |
|---|---|---|
| `brand-primary` | `#F9A474` | CTA, active state, Regular ticket |
| `brand-secondary` | `#c3a3ff` | VIP ticket accent (brief override — purple allowed here) |
| `brand-success` | `#59d9a6` | Success states, order confirmed |
| `brand-warning` | `#f4bf63` | Warning banners, disconnected WS state |
| `brand-danger` | `#ff7d8b` | Error alerts |
| `bg-base` | `#0a0a0a` | Page background |
| `border-default` | `rgba(255,255,255,0.10)` | Card borders |
| `border-strong` | `rgba(255,255,255,0.20)` | Hover borders |

## Typography
- **Font:** System sans-serif via Tailwind (`font-sans`)
- **Display:** `font-display` for headings
- **Mono:** `font-mono` for codes/counts

## Component Tokens
- `bento-card`: `bg #0a0a0a`, `border-default`, `border-radius 20px/32px`, padding `18px/28px`
- `btn-brand-primary`: Orange gradient, dark text, `border-radius 32px`
- `btn-glint`: Inner highlight box-shadow effect

## Status UI Pattern
- WS Connected: Animated ping dot (brand-primary / brand-secondary color)
- WS Disconnected: Static dot (brand-warning) + Warning banner
- Loading: Spinner `border-t-transparent animate-spin`
- Error: `brand-danger` alert banner

## Notes
- Purple (`brand-secondary`) is ALLOWED for VIP ticket only — explicit brief override
- Glassmorphism: NOT used. Solid dark cards only.
- No mesh gradients. Background glow via `blur-[160px]` radial divs (subtle only).
