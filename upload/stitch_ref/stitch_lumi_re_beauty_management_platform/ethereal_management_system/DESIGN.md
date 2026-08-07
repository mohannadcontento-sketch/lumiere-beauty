---
name: Ethereal Management System
colors:
  surface: '#fbf8fc'
  surface-dim: '#dcd9dd'
  surface-bright: '#fbf8fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f6'
  surface-container: '#f0edf1'
  surface-container-high: '#eae7eb'
  surface-container-highest: '#e4e1e5'
  on-surface: '#1b1b1e'
  on-surface-variant: '#404944'
  inverse-surface: '#303033'
  inverse-on-surface: '#f3f0f4'
  outline: '#707974'
  outline-variant: '#bfc9c3'
  surface-tint: '#2b6954'
  primary: '#003527'
  on-primary: '#ffffff'
  primary-container: '#064e3b'
  on-primary-container: '#80bea6'
  inverse-primary: '#95d3ba'
  secondary: '#5f5e5b'
  on-secondary: '#ffffff'
  secondary-container: '#e5e2dd'
  on-secondary-container: '#656461'
  tertiary: '#735c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#cca72f'
  on-tertiary-container: '#4e3d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b0f0d6'
  primary-fixed-dim: '#95d3ba'
  on-primary-fixed: '#002117'
  on-primary-fixed-variant: '#0b513d'
  secondary-fixed: '#e5e2dd'
  secondary-fixed-dim: '#c9c6c2'
  on-secondary-fixed: '#1c1c19'
  on-secondary-fixed-variant: '#474743'
  tertiary-fixed: '#ffe088'
  tertiary-fixed-dim: '#e9c349'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#574500'
  background: '#fbf8fc'
  on-background: '#1b1b1e'
  surface-variant: '#e4e1e5'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  xxl: 64px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style

The design system is rooted in **Modern Luxury**, blending the precision of high-end clinical management with the warmth of a wellness sanctuary. It avoids aggressive tech aesthetics in favor of a "Human-Centric Professionalism" that feels both authoritative and inviting.

The style leverages **Minimalism** with a **Tactile** edge. It uses expansive whitespace to reduce cognitive load for busy practitioners, while employing high-quality typography and a restrained color palette to communicate premium service. The UI should evoke a sense of calm, order, and curated beauty.

## Colors

The palette is anchored by **Deep Emerald Green**, representing growth and stability, and is balanced by **Soft Creams and Taupes** to prevent the interface from feeling cold.

- **Primary:** Deep Emerald is used for primary actions, active navigation states, and key brand moments.
- **Secondary:** Warm Creams provide the "canvas" for the UI, creating a softer alternative to stark white.
- **Accents:** Rose Gold/Metallic tones are reserved for subtle highlights, such as small badges or thin borders, to denote "premium" status without being gaudy.
- **Typography:** High-contrast Charcoal Gray (#27272A) is used instead of pure black to maintain a softer, more sophisticated look while ensuring AAA accessibility.

## Typography

This system employs a **Dual-Typeface Strategy** to balance editorial elegance with functional clarity.

- **Playfair Display:** Used for page titles, section headers, and "Hero" numbers (like total revenue or client name). Its high-contrast serifs evoke the feeling of a luxury magazine or high-end spa menu.
- **Public Sans:** A neutral, systematic sans-serif used for all functional UI elements, data tables, labels, and long-form body text. It ensures maximum readability for appointment notes and inventory lists.
- **Stylistic Note:** Use "Label-MD" (all-caps with tracking) for small subtitles or grouping headers to create a structured, architectural feel.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid** model. Content is contained within a max-width of 1440px on desktop to prevent eye strain across large monitors, while internal dashboard layouts utilize a fluid 12-column grid.

- **Rhythm:** An 8px base grid is strictly followed.
- **Generous Margins:** Use `xl` (40px) or `xxl` (64px) spacing between major sections to maintain a "breathable," calm atmosphere. 
- **Density:** Dashboard widgets should use `lg` (24px) internal padding to avoid the "cramped" feeling common in enterprise software.
- **Mobile:** On mobile devices, side margins should shrink to 16px, and vertical spacing between sections should reduce by one step (e.g., `xl` becomes `lg`).

## Elevation & Depth

This design system avoids heavy shadows, instead using **Tonal Layering** and **Micro-Borders** to communicate hierarchy.

- **Surface Tiers:** Backgrounds are the secondary Cream color. Main containers/cards are pure white. Secondary utility panels (like sidebars) use a slightly darker Taupe.
- **Borders:** Instead of shadows, use 1px solid borders in a very light neutral-gray (#E4E4E7). For "active" or "hovered" elements, increase the border weight slightly or change the border color to the primary Emerald.
- **Elevation:** Only use a shadow for transient elements like **Modals** or **Dropdowns**. These shadows should be extremely diffused (e.g., `box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05)`), appearing like a natural ambient light source.

## Shapes

The shape language is **Soft and Precise**. It uses a subtle corner radius (4px to 8px) to feel modern without becoming "bubbly" or juvenile.

- **Small Components:** Checkboxes and small buttons use a 4px (Soft) radius.
- **Cards & Modals:** Large containers use 8px (Rounded-LG) to create a gentle distinction from the background.
- **Interactive Elements:** Input fields should match the 4px radius for a clean, architectural look.
- **Exceptions:** Search bars or special "Call to Action" buttons may use a Pill-shape (3) to stand out as highly interactive, though this should be used sparingly.

## Components

- **Buttons:** Primary buttons are solid Deep Emerald with white text. Secondary buttons are outlined with a 1px Taupe border and primary text. State changes (hover/active) should be subtle shifts in color value, never aggressive glows.
- **Inputs:** Use "Floating Label" or "Top Aligned" labels. Inputs have a 1px border; on focus, the border changes to Emerald with a 2px offset "halo" of the same color at 10% opacity.
- **Cards:** White backgrounds, 1px light gray borders, and no shadows. Use `Playfair Display` for the card title to distinguish data segments.
- **Calendar:** The core of the platform. Use the secondary Cream color for weekends/empty states. Current day should be highlighted with a Deep Emerald circle. Events should be color-coded with muted, desaturated versions of the brand colors.
- **Tables:** No vertical lines. Use horizontal 1px light taupe lines to separate rows. Header row uses the `Label-MD` typography style (all-caps, tracked).
- **Navigation:** Vertical sidebar on desktop with thin-stroke (1.5pt) icons. The active state is indicated by a subtle Emerald vertical bar on the left edge and a shift in icon color.
- **Charts:** Use a refined palette of Emerald, Sage, Taupe, and Rose Gold. Lines should be thin and smooth (anti-aliased).