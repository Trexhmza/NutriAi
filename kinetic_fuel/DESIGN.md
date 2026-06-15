---
name: Kinetic Fuel
colors:
  surface: '#121414'
  surface-dim: '#121414'
  surface-bright: '#383939'
  surface-container-lowest: '#0d0f0f'
  surface-container-low: '#1a1c1c'
  surface-container: '#1e2020'
  surface-container-high: '#282a2a'
  surface-container-highest: '#333535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#dec0b6'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#2f3131'
  outline: '#a68b82'
  outline-variant: '#57423b'
  surface-tint: '#ffb59c'
  primary: '#ffb59c'
  on-primary: '#5c1a00'
  primary-container: '#ff7f50'
  on-primary-container: '#6c2000'
  inverse-primary: '#a43c12'
  secondary: '#c1c8ca'
  on-secondary: '#2b3234'
  secondary-container: '#434a4c'
  on-secondary-container: '#b2babc'
  tertiary: '#4dd9e4'
  on-tertiary: '#00363a'
  tertiary-container: '#00b5c0'
  on-tertiary-container: '#004145'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59c'
  on-primary-fixed: '#380c00'
  on-primary-fixed-variant: '#822800'
  secondary-fixed: '#dde4e6'
  secondary-fixed-dim: '#c1c8ca'
  on-secondary-fixed: '#161d1f'
  on-secondary-fixed-variant: '#41484a'
  tertiary-fixed: '#7af4ff'
  tertiary-fixed-dim: '#4dd9e4'
  on-tertiary-fixed: '#002022'
  on-tertiary-fixed-variant: '#004f54'
  background: '#121414'
  on-background: '#e2e2e2'
  surface-variant: '#333535'
typography:
  h1:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h2-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
  body-large:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.5'
  body-regular:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  metric-display:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.0'
  button:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.01em
  navigation:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.01em
  label-small:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.02em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered for the "High-Performance Nutrition" sector, targeting athletes and biohackers who view nutrition as a precision science. The brand personality is **technical, high-energy, and futuristic**. It evokes the feeling of a high-tech laboratory or a performance dashboard.

The aesthetic leans into **Modern Minimalism** with a **Technical Edge**. It utilizes deep dark surfaces to minimize eye strain during tracking, punctuated by vibrant accents that signify vital energy and action. The interface should feel fast, responsive, and uncompromisingly functional.

## Colors

This design system utilizes a high-contrast dark mode palette to emphasize data visualization and performance metrics.

- **Primary (Coral - #FF7F50):** Used sparingly for calls-to-action, active progress bars, and critical health indicators. It provides a warm, energetic contrast against the cool dark background.
- **Surface/Background:** The base is a deep, near-black neutral (#0F1111). Secondary surfaces use a slightly lighter grey (#2D3436) to create depth without relying on heavy shadows.
- **Functional Colors:** Use pure white (#FFFFFF) for primary text and a muted silver for secondary descriptions to maintain a clear visual hierarchy.

## Typography

The typography strategy is built on a "Dual-Engine" approach. **Space Grotesk** provides the technical, futuristic "header" feel, while **Inter** ensures maximum readability for complex nutritional data.

- **Data & Metrics:** All numerical data—including calorie counts, macronutrient grams, and weights—must be set in **Space Grotesk (700)**. This gives the numbers a geometric, "instrument-panel" appearance.
- **Headings:** Use Space Grotesk for all H1-H3 levels. On mobile devices, H1 and H2 scale down to maintain layout integrity.
- **UI & Navigation:** Use Inter for all functional elements. Navigation items should be rendered in uppercase to differentiate them from body content.
- **Hierarchy:** Use weight over color to establish hierarchy; avoid using grey for body text to maintain high legibility against the dark background.

## Layout & Spacing

The design system employs a **Fluid Grid** based on an 8px square system. This ensures that all components, paddings, and margins are multiples of 8, creating a rhythmic and structured layout.

- **Desktop:** A 12-column grid with a 24px gutter. Content is centered with a maximum width of 1200px.
- **Mobile:** A 4-column grid with 16px side margins. 
- **Spacing Logic:** Use larger gaps (32px-48px) to separate logical sections of the nutrition dashboard, and tighter gaps (8px-16px) for related data points like macro breakdowns.

## Elevation & Depth

To maintain the futuristic aesthetic, depth is created through **Tonal Layering** and **Subtle Outlines** rather than traditional shadows.

- **Base Layer:** The darkest background (#0F1111).
- **Component Layer:** Cards and containers use a subtle lift with the secondary color (#2D3436). 
- **Borders:** Instead of heavy shadows, use 1px borders in a slightly lighter grey or a very low-opacity primary coral to define boundaries between data sets.
- **Glassmorphism:** For overlays and sticky headers, use a 20px backdrop blur with a 60% opacity fill of the base color to maintain context behind the overlay.

## Shapes

The shape language is **precision-focused**. Corners are kept relatively sharp to maintain a technical, professional feel.

- **Standard Elements:** Buttons and input fields use a 4px (0.25rem) radius.
- **Containers:** Large cards use an 8px (0.5rem) radius to provide a slight softness to the overall UI.
- **Data Visuals:** Charts and progress bars should have square ends (0px radius) to emphasize the grid-based, engineered nature of the data.

## Components

- **Buttons:** Solid primary coral background with white text (Inter 500). Hover states should involve a slight increase in brightness or a thin outer glow.
- **Inputs:** Dark backgrounds with a 1px secondary border. On focus, the border transitions to primary coral.
- **Cards:** Used for meal tracking and macro summaries. Cards should have no shadow, defined only by their slightly lighter background color and subtle border.
- **Chips/Badges:** Use for nutritional tags (e.g., "High Protein", "Vegan"). These use a ghost style (border only) or a very dark fill with primary-colored text.
- **Progress Bars:** Thin, high-contrast tracks. The "filled" portion should use the primary coral for current progress, with secondary grey for the remaining goal.