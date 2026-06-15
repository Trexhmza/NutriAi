---
name: High-Performance Nutrition
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#dec0b6'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#a68b82'
  outline-variant: '#57423b'
  surface-tint: '#ffb59c'
  primary: '#ffb59c'
  on-primary: '#5c1a00'
  primary-container: '#ff7f50'
  on-primary-container: '#6c2000'
  inverse-primary: '#a43c12'
  secondary: '#44e2cd'
  on-secondary: '#003731'
  secondary-container: '#03c6b2'
  on-secondary-container: '#004d44'
  tertiary: '#c0c1ff'
  on-tertiary: '#1000a9'
  tertiary-container: '#979aff'
  on-tertiary-container: '#1e19b2'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59c'
  on-primary-fixed: '#380c00'
  on-primary-fixed-variant: '#822800'
  secondary-fixed: '#62fae3'
  secondary-fixed-dim: '#3cddc7'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 40px
  margin-mobile: 16px
---

## Brand & Style
The design system is built to evoke a sense of precision, vitality, and high-tech performance. It targets health-conscious individuals who view nutrition as a science rather than a chore. The brand personality is authoritative yet motivating—functioning like a high-end laboratory interface for the human body.

The visual style is **Modern Corporate** with a **Glassmorphic** twist. It utilizes a high-contrast dark environment to reduce eye strain during frequent logging while allowing the coral accents to pop with biometric urgency. The interface relies on clean lines, ample whitespace (macro-spacing), and a "dashboard-first" mentality that prioritizes data density without sacrificing clarity.

## Colors
The palette is anchored by a deep, midnight navy neutral to provide more depth than pure black. 

*   **Primary (Coral - #FF7F50):** Used for primary actions, active states, and goal achievements. It provides a warm, energetic contrast to the dark background.
*   **Secondary (Mint - #2DD4BF):** Representing health and "safe" ranges, used for positive nutritional trends and vitamins.
*   **Tertiary (Indigo - #6366F1):** Used for secondary data visualizations, such as hydration or supplement tracking.
*   **Neutral (#0F172A):** A sophisticated dark slate that forms the base of the application.

Backgrounds should use layered shades of the neutral color to define hierarchy, rather than relying on heavy lines. High-contrast white (#F8FAFC) is reserved for primary body text.

## Typography
This design system employs a tri-font strategy to balance editorial impact with technical utility. 

**Hanken Grotesk** is used for large displays and headlines to provide a sharp, contemporary professional look. **Inter** is the workhorse for all body content, chosen for its exceptional readability in dark mode environments. **JetBrains Mono** is introduced sparingly for "technical" data points—such as calorie counts, macro percentages, and timestamps—to lean into the high-tech, data-driven aesthetic.

Line heights are kept generous for body text (1.6) to prevent the high-contrast text from feeling "cramped" against the dark background.

## Layout & Spacing
The layout follows a **Fluid Grid** model based on an 8px square-grid system. 

On Desktop, a 12-column grid with 24px gutters is standard. Components should be grouped into cards that span 3, 4, 6, or 12 columns. On Mobile, the grid collapses to a single column with 16px side margins. 

The spacing philosophy emphasizes "Macro-spacing" between major sections (64px+) to create a clean, airy feel that counters the density of nutritional data. Component-internal spacing should remain tight (12px-20px) to keep related data points unified.

## Elevation & Depth
In this dark-themed system, depth is achieved through **Tonal Layers** and **Subtle Outlines** rather than traditional shadows. 

1.  **Level 0 (Background):** The base neutral color (#0F172A).
2.  **Level 1 (Cards/Surface):** A slightly lighter tint (#1E293B). These surfaces use a 1px solid border (#334155) to define their edges.
3.  **Level 2 (Popovers/Modals):** These use a backdrop-blur (12px) with a semi-transparent background to create a "glass" effect, signaling they are temporarily layered above the main interface.

Shadows, when used, are strictly "Ambient Glows"—very low opacity (10%) using the Primary Coral color to highlight active, high-priority elements.

## Shapes
The shape language is "Soft-Technical." We avoid the "bubbly" look of fully rounded pill shapes for containers to maintain a professional, scientific tone. 

Standard components (Cards, Inputs) use a 4px (0.25rem) radius. Buttons and decorative "chips" may scale up to 8px to feel more interactive. This subtle rounding maintains the "clean and modern" requirement while avoiding the harshness of 0px sharp corners.

## Components
Consistent component styling is vital for a high-tech feel:

*   **Buttons:** Primary buttons are solid Coral (#FF7F50) with black text for maximum legibility. Secondary buttons are "Ghost" style with a 1px Coral border.
*   **Input Fields:** Darker than the card surface with a subtle 1px bottom-border that glows Coral when focused. Labels always use the uppercase Monospaced style.
*   **Data Cards:** Must feature a 1px border. Use "Micro-charts" (sparklines) in the secondary Mint color to show 7-day trends within the card.
*   **Progress Circles:** For daily macro tracking, use thick stroke weights (12px) with rounded ends. The "track" should be a 10% opacity version of the "fill" color.
*   **Chips:** Used for food tags (e.g., "High Protein"). These are small, with a light gray background and no border, using the `label-caps` typography.
*   **Lists:** Items in a food log are separated by 1px dividers. Each row should have a subtle hover state that lightens the background slightly.