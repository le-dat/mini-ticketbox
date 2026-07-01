# Design System - Bento Pro

This skill defines a premium bento-oriented interface language inspired by the `hen-ry.com` benefits experience: dark-first, editorial typography, asymmetric card mosaics, subtle glow layers, and conversion-focused messaging.

## Before Writing Any Code

1. Read every module that applies. For landing pages, start with `layout.md`, `content.md`, `typography.md`, `colors.md`, `cards.md`, and `buttons.md`.
2. Confirm global tokens exist in `globals.css` before creating components.
3. Use semantic HTML and keyboard-safe interactions by default.

## Critical Rules

- **Tokens are AGNOSTIC, NOT Tailwind classes:** The tokens defined in the `.md` files (like `neutral-primary-soft`, `heading`, `border-default`) are agnostic design system tokens, NOT literal Tailwind classes. Do not blindly use classes like `bg-neutral-primary-soft` unless you have explicitly mapped them in the CSS/Tailwind configuration. You must implement the mapping yourself.

- Bento layout is the baseline pattern, not a decorative add-on.
- Cards must feel tactile: soft borders, layered surfaces, and controlled hover lift.
- Keep copy compact, confident, and outcome-oriented.
- Every interactive element must define default, hover, focus-visible, active, and disabled states.
- Respect reduced-motion preferences for all animated reveals.

## Module Index

### Foundation
- [colors.md](colors.md) - palette and semantic token roles
- [typography.md](typography.md) - editorial hierarchy and reading rhythm
- [layout.md](layout.md) - section spacing, shells, and compositional rules
- [content.md](content.md) - bento grid recipes and responsive spans
- [radius.md](radius.md) - corner radii scale
- [shadows.md](shadows.md) - depth and glow treatment
- [borders.md](borders.md) - stroke usage and separators

### Components
- [hero.md](hero.md) - hero section patterns, geometric backgrounds, and ambient light
- [buttons.md](buttons.md) - button styles and state logic (keep existing)
- [button-group.md](button-group.md) - grouped actions
- [cards.md](cards.md) - bento tile anatomy and emphasis tiers
- [inputs.md](inputs.md) - form control treatment
- [alerts.md](alerts.md) - status blocks
- [badges.md](badges.md) - metadata and status chips
- [lists.md](lists.md) - bullet, feature, and metadata lists
- [avatars.md](avatars.md) - people and team markers
- [icon-shapes.md](icon-shapes.md) - icon container standards
-

### Complex Components
- [accordion.md](accordion.md) - expandable detail stacks
- [dropdown.md](dropdown.md) - action and selection menus
- [modals.md](modals.md) - focused overlays
- [tabs.md](tabs.md) - grouped content navigation
- [tables.md](tables.md) - dense data presentation
- [pagination.md](pagination.md) - segmented page traversal
- [sidebars.md](sidebars.md) - persistent navigation rails
- [radios-checkboxes-toggle.md](radios-checkboxes-toggle.md) - selection controls
- [tooltips-popovers.md](tooltips-popovers.md) - lightweight help layers

---

## Source file: `accordion.md`

# Accordion

## Intent
Accordions handle dense detail while preserving page flow.

## Anatomy
- Header row with title, optional subtitle, and indicator
- Panel with body text and optional nested list
- Radius: `radius-lg`; separators use hairline strokes

## Behavior
- One-open default in FAQ contexts.
- Expand/collapse animation under 240ms.

## Rules
- Ensure keyboard navigation with Enter/Space and arrow keys.
- Keep header text concise to prevent wrapping instability.

---

## Source file: `alerts.md`

# Alerts

## Intent
Status messaging should be clear, concise, and visually integrated with bento surfaces.

## Anatomy
- Icon + title + message + optional action
- Padding: 16px to 20px
- Radius: `radius-lg`
- Border: 1px tinted by status

## Variants
- Info: cool blue tint
- Success: green tint
- Warning: amber tint
- Danger: red tint

## Rules
- Never rely on color alone; include icon and label.
- Keep critical alerts above dense content clusters.

---

## Source file: `avatars.md`

# Avatars

## Intent
Avatars add human proof and team identity without visual clutter.

## Specs
- Sizes: 24, 32, 40, 56, 72
- Shape: circle by default, rounded-square only for brand marks
- Border: 1px `border.default`

## Stacks
- Overlap: 20-28%
- Keep stack count visible; use `+N` overflow chip when needed.

## Rules
- Always provide accessible name via alt text or aria-label.
- Avoid decorative avatar shadows stronger than `shadow-xs`.

---

## Source file: `badges.md`

# Badges

## Intent
Badges communicate status, category, or trust signals in compact form.

## Specs
- Height: 24px default, 20px small
- Padding: 10px horizontal
- Radius: `radius-pill`
- Typography: label style, medium weight

## Variants
- Neutral, Accent, Success, Warning, Danger

## Rules
- Avoid badge overuse; max 2 badges per compact card header.
- Badges must remain readable on textured or gradient panels.

---

## Source file: `borders.md`

# Borders

## Intent
Borders define layers and card boundaries without visual noise.

## Standards
- Default stroke: 1px `border.default`
- Emphasis stroke: 1px `border.strong`
- Hairline separators: 1px with 40% opacity of `border.default`

## Rules
- Use border + glow together for premium surfaces.
- Avoid 2px borders except explicit focus or selected states.
- Do not use fully opaque white borders in dark mode.

---

## Source file: `button-group.md`

# Button Group

## Intent
Grouped actions should feel compact and intentional within dense bento cards.

## Structure
- Wrap: inline-flex for short groups, grid for mixed-size CTAs.
- Gap: 10px desktop, 8px mobile.
- Align primary action first in LTR interfaces.

## Rules
- One dominant button per group.
- Secondary and ghost actions must not visually overpower primary CTA.
- Preserve accessible focus order and visible ring overlap handling.

---

## Source file: `buttons.md`

# Buttons

> Dependencies: `colors.md`, `radius.md`, `shadows.md`

## Primary Brand Color

- **Button primary color:** `#F9A474` (defined in `colors.md` as the primary token).
- **Brand buttons must use the primary token from `colors.md`** as the source of truth (do not hardcode a different base color).

## Core Specs (every button except ghost and disabled)

- **Radius:** 32px (base) or 9999px for pills
- **Border:** 1px solid
- **Shadow:** shadow-xs
- **Glint effect:** Every button except ghost and disabled gets a combined box-shadow that layers the base shadow with an inset top-edge highlight and a subtle outer color glow:
  - `var(--shadow-xs), inset var(--color-1-400) 0 6px 0px -5px, var(--color-1-700) 0 4px 10px -5px`
- **Font weight:** 500 (medium)
- **Font:** Inter
- **Box sizing:** border-box
- **Transition:** color transitions on hover

## Sizes

| Size | Font size | Horizontal padding | Vertical padding |
|---|---|---|---|
| Extra small | 12px | 12px | 6px |
| Small | 14px | 12px | 8px |
| Base (default) | 14px | 16px | 10px |
| Large | 16px | 20px | 12px |
| Extra large | 16px | 24px | 14px |

## Variants

### Brand
- **Background:** modern gradient derived from the `colors.md` primary token (`#F9A474`) (`linear-gradient(135deg, #F9A474 0%, #F7B38E 55%, #FCD2B7 100%)`)
- **Border:** transparent
- **Text:** `#1A120D`
- **Hover:** deepen gradient (`linear-gradient(135deg, #F39A67 0%, #F9A474 55%, #F7B38E 100%)`) and slightly increase glow
- **Focus ring:** 4px, `#F9A47466`
- **Glint:** yes
- **Style note:** keep the brand CTA looking beautiful, modern, and premium (soft gradient blend, subtle highlight, no harsh contrast edges)

### Secondary
- **Background:** neutral-secondary-medium
- **Border:** border-default-medium
- **Text:** body color
- **Hover:** neutral-tertiary-medium background, heading text color
- **Focus ring:** 4px, neutral-tertiary color
- **Glint:** yes

### Tertiary
- **Background:** neutral-primary-soft
- **Border:** border-default
- **Text:** body color
- **Hover:** neutral-secondary-medium background, heading text color
- **Focus ring:** 4px, neutral-tertiary-soft color
- **Glint:** yes

### Success
- **Background:** success token
- **Border:** transparent
- **Text:** white
- **Hover:** success-strong background
- **Focus ring:** 4px, success-medium color
- **Glint:** yes

### Danger
- **Background:** danger token
- **Border:** transparent
- **Text:** white
- **Hover:** danger-strong background
- **Focus ring:** 4px, danger-medium color
- **Glint:** yes

### Warning
- **Background:** warning token
- **Border:** transparent
- **Text:** white
- **Hover:** warning-strong background
- **Focus ring:** 4px, warning-medium color
- **Glint:** yes

### Dark
- **Background:** dark token
- **Border:** transparent
- **Text:** white
- **Hover:** dark-strong background
- **Focus ring:** 4px, neutral-tertiary color
- **Glint:** yes

### Ghost (NO shadow, NO glint)
- **Background:** transparent
- **Border:** transparent
- **Text:** heading color
- **Hover:** neutral-secondary-medium background
- **Focus ring:** 4px, neutral-tertiary color
- **No shadow, no glint effect**

### Disabled (NO shadow, NO glint)
- **Background:** disabled token
- **Border:** border-default-medium
- **Text:** fg-disabled color
- **Cursor:** not-allowed
- **No hover, no focus, no shadow, no glint**

## Icons in Buttons

- Icon size: 16x16px
- Spacing: 8px gap between icon and label
- Layout: inline-flex, vertically centered

---

## Source file: `cards.md`

# Cards

> Dependencies: `colors.md`, `radius.md`, `shadows.md`, `typography.md`

## Core Specs
- Background: exact same shade as the base canvas (`bg.panel` which is `#0a0a0a`)
- Border: 1px `border.default` (crisp, subtle line)
- Radius: 32px desktop, 20px mobile
- Shadow: none by default, rely on borders for a flat, premium look
- Padding: 28px desktop, 22px tablet, 18px mobile

## Bento Tiers
- Primary card: large headline, supporting proof, optional media.
- Secondary card: concise claim + icon/metric.
- Utility card: metadata, tags, mini CTA.

## Interactive State
- Hover: lift 4px, border to `border.strong`, glow increases slightly.
- Focus-visible: 2px accent outline with 3px offset.
- Disabled: no lift, reduced contrast, muted text.

## Rules
- Do not flatten all cards to identical visual weight.
- Keep card content vertically balanced with clear top and bottom anchors.

---

## Source file: `colors.md`

# Colors

## Intent
A premium, ultra-dark palette built on pure black bases, high-clarity white text, and selective accent warmth for call-to-action emphasis.

## Core Tokens
- `bg.base`: #0a0a0a
- `bg.elevated`: #0a0a0a
- `bg.panel`: #0a0a0a
- `bg.panel-soft`: rgba(10, 10, 10, 0.78)
- `text.primary`: #ffffff
- `text.secondary`: #a1a1aa
- `text.muted`: #71717a
- `border.default`: rgba(255, 255, 255, 0.10)
- `border.strong`: rgba(255, 255, 255, 0.20)
- `primary`: #F9A474
- `accent.primary`: #F9A474
- `accent.secondary`: #c3a3ff
- `accent.success`: #59d9a6
- `accent.warning`: #f4bf63
- `accent.danger`: #ff7d8b

## Usage Rules
- Large surfaces and cards must use the flat `#0a0a0a` background to create a seamless, premium look.
- Primary text must keep maximum contrast against all panel backgrounds.
- Accent colors should highlight interaction, stats, and key claims only.
- The primary website and brand CTA color must always resolve to `primary` (`#F9A474`).
- Avoid using more than two accent families in one viewport section.

## Gradients
- Hero ambient: radial accent bloom over `bg.base`.
- Card glow: cards share the exact same background as the canvas (`#0a0a0a`), relying entirely on crisp borders (`border.default`) and subtle hover glows for definition.

---

## Source file: `content.md`

# Content Grid

## Intent
Default to bento composition for feature communication and benefit storytelling.

## Desktop Grid
- 12-column grid, 24px gap.
- Common spans: 8/4, 7/5, 6/3/3, 4/4/4.
- Feature cards should vary height to create rhythm: S=220, M=300, L=420.

## Tablet Grid
- 8 columns, 16px gap.
- Collapse complex rows into 4/4 or 8 spans.

## Mobile Grid
- Single column stack with occasional horizontal scroller for compact stats only.
- Maintain 16px inter-card gap.

## Bento Rules
- Each grid block must include one primary tile and supporting secondary tiles.
- Avoid repeating identical card sizes more than three times in sequence.
- Place CTA cards at row boundaries for natural attention reset.

---

## Source file: `dropdown.md`

# Dropdown

## Intent
Dropdowns provide lightweight actions and selections over dark surfaces.

## Surface
- Background: `bg.panel-soft` with blur support fallback
- Border: 1px `border.strong`
- Radius: `radius-lg`
- Shadow: `shadow-sm`

## Items
- Height: 36-40px
- Hover: subtle accent tint
- Selected: persistent accent edge and label emphasis

## Rules
- Keep menu width tied to trigger unless content requires wider fit.
- Support keyboard navigation and typeahead for long lists.

---

## Source file: `hero.md`

# Hero

> Dependencies: `colors.md`, `layout.md`, `typography.md`

## Intent
The hero section must feel premium, technical, and visually striking, setting the tone for the entire landing page. It relies on deep contrast, subtle geometric patterns, and ambient light.

## Background & Ambient Light
- **Base Glow**: A massive, highly blurred radial element (e.g., 800x800px, 180px blur, 10% opacity) centered behind the text using the primary accent color (`#F9A474`).
- **Body Background**: The page body uses a dark `#0a0a0a` canvas with two low-opacity (3%) radial overlays in opposite corners (primary and secondary accents) to break up the solid black.

## Modern Geometric Patterns
The hero must include a complex, layered geometric pattern behind the main typography, masked by a radial gradient (`mask-image: radial-gradient(ellipse_at_center,black_40%,transparent_80%)`) so it fades smoothly into the background edges or other pattern in the same professional way.

**Pattern Elements:**
1. **Subtle Grid**: A 60x60px square grid overlay using a very faint stroke (`rgba(255, 255, 255, 0.02)`).
2. **Concentric Rings**: A series of 5+ perfectly centered circles ranging from 250px to 1400px.
   - Use very subtle white borders (2% to 8% opacity).
   - Introduce varied textures (e.g., one dashed ring) for a technical feel.
3. **Crosshairs**: Two intersecting 1px lines (horizontal and vertical) that run through the center, using a gradient that fades from transparent to `white/[0.08]` back to transparent at the edges.

## Typography & Badges
- **Badge**: A pill-shaped label above the H1. Uses a subtle glow (`shadow-[0_0_20px_rgba(249,164,116,0.1)]`), a 3% background fill, a 20% border, and a backdrop blur.
- **H1 Headline**: Uses `text-display-xl` with tight tracking. The text should have a subtle gradient clip (`from-white via-white to-[#a1a1aa]`) and a drop shadow for depth.
- **Subheadline**: Uses `text-body-l` in a muted secondary color (`#a1a1aa`), constrained to a readable max-width (e.g., `max-w-2xl`).

## Call to Action
- **Primary button**: Solid white background, dark text, with a subtle white glow (`shadow-[0_0_30px_rgba(255,255,255,0.15)]`).
- **Secondary button**: Transparent with a 10% white border, white text, and a backdrop blur (`backdrop-blur-sm`).

---

## Source file: `icon-shapes.md`

# Icon Shapes

## Intent
Icons should feel crafted and consistent across bento cards.

## Containers
- Sizes: 28, 36, 44
- Radius: `radius-md` for squircle feel
- Background: elevated tint with optional accent gradient
- Border: 1px `border.default`

## Rules
- Stroke icons should render at 1.5px to 2px for crispness.
- Keep icon metaphors simple and action-aligned.

---

## Source file: `inputs.md`

# Inputs

## Intent
Inputs should inherit the same premium card language while remaining highly legible.

## Base Field
- Height: 48px default, 56px large.
- Background: `bg.elevated`
- Border: 1px `border.default`
- Radius: `radius-md`
- Text: `text.primary`
- Placeholder: `text.muted`

## States
- Hover: border toward `border.strong`
- Focus-visible: accent ring + border emphasis
- Error: `accent.danger` border and helper text
- Disabled: lower contrast, no glow

## Rules
- Labels must remain visible; placeholders are not labels.
- Keep helper text concise and directly actionable.

---

## Source file: `layout.md`

# Layout

## Intent
Compose pages as a bento narrative: alternating dense and open zones with clear visual breathing room.

## Containers
- Max width: 1240px desktop, 100% with 24px gutters on tablet, 16px on mobile.
- Section vertical rhythm: 120px desktop, 88px tablet, 64px mobile.

## Section Pattern
- Alternate between: hero statement, bento feature matrix, proof strip, and CTA band.
- Use asymmetry intentionally: 2:1 and 3:2 visual weight ratios are preferred.

## Surface Layers
- Base canvas uses two low-opacity (3%) radial overlays in opposite corners (e.g., primary and secondary accents) to break up the solid `#0a0a0a` background.
- Section shells may include soft noise texture at <= 3% opacity.

## Motion
- Entrance motion should be subtle (12-20px translate, 220-320ms ease-out).
- Respect `prefers-reduced-motion` by removing translation and long fades.

---

## Source file: `lists.md`

# Lists

## Intent
Lists should improve scan speed in feature-heavy sections.

## Patterns
- Feature list: icon + one-line claim
- Metadata list: label/value pairs with muted labels
- Step list: numbered progression with clear state markers

## Spacing
- Item gap: 10px to 14px
- Section gap above list: at least 16px

## Rules
- Keep feature bullet text short and benefit-driven.
- Align icon baselines for tidy vertical rhythm.

---

## Source file: `modals.md`

# Modals

## Intent
Modals isolate high-priority tasks without breaking the bento visual language.

## Frame
- Max width: 560px standard, 760px wide
- Radius: `radius-xl`
- Background: layered panel with soft highlight
- Backdrop: dark blur at 60-72% opacity

## Behavior
- Trap focus while open.
- Close on Escape unless task is destructive-critical.
- Animate scale/opacity subtly, then stop.

## Rules
- Keep one primary action and at most one secondary action.
- Avoid long-form content that exceeds viewport height without internal scroll.

---

## Source file: `pagination.md`

# Pagination

## Intent
Pagination should feel minimal, predictable, and keyboard-friendly.

## Specs
- Item size: 36px square minimum hit area.
- Radius: `radius-md`
- Active item: accent tint with stronger border.
- Disabled controls: muted and non-interactive.

## Rules
- Always expose previous and next controls.
- Keep page jumps concise with ellipsis for large ranges.

---

## Source file: `radios-checkboxes-toggle.md`

# Radios, Checkboxes, Toggle

## Intent
Selection controls should be clear at a glance and easy to operate on touch and keyboard.

## Specs
- Minimum target: 20px control, 40px hit area.
- Border: 1px `border.default`
- Checked state uses accent fill + high-contrast indicator.

## Rules
- Pair each control with explicit label text.
- Focus-visible must be obvious on dark backgrounds.
- Use toggles only for immediate binary settings, not form submission choices.

---

## Source file: `radius.md`

# Radius

## Tokens
- `radius-xs`: 10px
- `radius-sm`: 14px
- `radius-md`: 18px
- `radius-lg`: 24px
- `radius-xl`: 32px
- `radius-pill`: 9999px

## Rules
- Bento cards default to `radius-xl` desktop and `radius-lg` mobile.
- Inputs and small controls should use `radius-md` and never drop below `radius-sm`.
- Keep adjacent grouped elements within one radius step difference.

---

## Source file: `shadows.md`

# Shadows

## Intent
Depth should feel atmospheric, not heavy.

## Tokens
- `shadow-xs`: 0 2px 10px rgba(0, 0, 0, 0.22)
- `shadow-sm`: 0 10px 24px rgba(4, 8, 15, 0.30)
- `shadow-md`: 0 18px 40px rgba(2, 6, 14, 0.42)
- `glow-accent`: 0 0 0 1px rgba(143, 180, 255, 0.25), 0 0 24px rgba(143, 180, 255, 0.16)

## Rules
- Combine one depth shadow with one soft highlight, never stack 3+ heavy shadows.
- Hover elevation must remain under 10px vertical offset to avoid floating artifacts.

---

## Source file: `sidebars.md`

# Sidebars

## Intent
Sidebars anchor navigation in data-heavy or multi-section experiences.

## Layout
- Width: 264px desktop, collapsible to icon rail.
- Surface: layered dark panel with right-side separator.
- Section groups separated by 16-20px.

## Item States
- Default: muted text
- Hover: elevated tint
- Active: accent marker + stronger label

## Rules
- Preserve icon alignment and label truncation behavior.
- Ensure collapsed mode remains fully keyboard accessible.

---

## Source file: `tables.md`

# Tables

## Intent
Tables should remain readable inside dark, premium dashboards and data cards.

## Specs
- Header background: slightly elevated from rows.
- Row height: 44px minimum.
- Cell padding: 14px horizontal, 10px vertical.
- Borders: hairline separators.

## States
- Hover row tint for scan tracking.
- Selected row with subtle accent rail.

## Rules
- Right-align numeric values; keep units consistent.
- Avoid stuffing dense tables into narrow cards on mobile; use stacked layout.

---

## Source file: `tabs.md`

# Tabs

## Intent
Tabs segment related content while preserving quick scan behavior.

## Structure
- Tab list as horizontal pills or underline segments.
- Active tab uses accent emphasis and stronger text.
- Inactive tabs remain high-contrast but subdued.

## Behavior
- Keyboard navigation with arrow keys and Home/End.
- Panel transitions should be subtle and instant-feeling.

## Rules
- Limit to 3-6 tabs in primary views.
- On mobile, allow horizontal scroll with clear active affordance.

---

## Source file: `tooltips-popovers.md`

# Tooltips and Popovers

## Intent
Contextual help should feel lightweight and non-disruptive.

## Tooltip
- Max width: 280px
- Background: elevated dark with strong text contrast
- Radius: `radius-sm`
- Delay: 150-250ms on hover; instant on focus

## Popover
- Supports richer content and actions
- Radius: `radius-lg`
- Border and shadow consistent with dropdown patterns

## Rules
- Tooltips are supplemental, never the only source of critical information.
- Keep copy concise and action-oriented.

---

## Source file: `typography.md`

# Typography

## Intent
Editorial and cinematic: oversized value statements, compact supporting copy, and clear scan hierarchy.

## Font Stack
- Display: `Inter Tight`, `Inter`, `system-ui`, sans-serif
- Body: `Inter`, `system-ui`, sans-serif
- Mono (metadata): `JetBrains Mono`, `ui-monospace`, monospace

## Scale
- Display XL: 72/76, weight 700, tracking -0.03em
- Display L: 56/60, weight 650, tracking -0.025em
- H1: 44/50, weight 600
- H2: 34/40, weight 600
- H3: 26/32, weight 560
- Body L: 20/31, weight 420
- Body M: 17/27, weight 420
- Body S: 15/24, weight 430
- Label: 12/16, weight 600, uppercase 0.08em

## Copy Style
- Text MUST be in the brand color. Never use neutral grays or creams for text unless explicitly requested.
- Lead with short high-impact claims.
- Prefer one clear promise per line.
- Keep paragraph blocks to 2-4 lines on desktop.