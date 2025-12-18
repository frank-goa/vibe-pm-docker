# Style Guide

This document defines the visual design tokens and styling conventions for the project.

## Color Palette

### Base Colors (Dark Theme)

| Token | Value | Usage |
|-------|-------|-------|
| `background` | `#09090b` | Page background (zinc-950) |
| `foreground` | `#fafafa` | Primary text (zinc-50) |
| `muted` | `#a1a1aa` | Secondary/muted text (zinc-400) |

### Neutral Scale (Zinc)

| Token | Value | Usage |
|-------|-------|-------|
| `zinc-50` | `#fafafa` | Primary text, highlights |
| `zinc-100` | `#f4f4f5` | Light backgrounds (rare) |
| `zinc-200` | `#e4e4e7` | Borders on light elements |
| `zinc-300` | `#d4d4d8` | Disabled text |
| `zinc-400` | `#a1a1aa` | Muted/secondary text |
| `zinc-500` | `#71717a` | Placeholder text |
| `zinc-600` | `#52525b` | Hover states, focus outlines |
| `zinc-700` | `#3f3f46` | Borders, dividers, selection |
| `zinc-800` | `#27272a` | Card backgrounds, elevated surfaces |
| `zinc-900` | `#18181b` | Secondary backgrounds |
| `zinc-950` | `#09090b` | Page background |

### Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `success` | `#22c55e` | Success states (green-500) |
| `error` | `#ef4444` | Error states (red-500) |
| `warning` | `#f59e0b` | Warning states (amber-500) |
| `info` | `#3b82f6` | Informational states (blue-500) |

### Brand Colors

| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#ec4899` | Primary actions, links (pink-500) |
| `primary-hover` | `#db2777` | Primary hover state (pink-600) |

## Typography

### Font Family

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Font Sizes (Tailwind Defaults)

| Class | Size | Usage |
|-------|------|-------|
| `text-xs` | 12px | Captions, badges |
| `text-sm` | 14px | Secondary text, labels |
| `text-base` | 16px | Body text (default) |
| `text-lg` | 18px | Lead paragraphs |
| `text-xl` | 20px | H4, section titles |
| `text-2xl` | 24px | H3 |
| `text-3xl` | 30px | H2 |
| `text-4xl` | 36px | H1, page titles |

### Font Weights

| Class | Weight | Usage |
|-------|--------|-------|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Labels, emphasis |
| `font-semibold` | 600 | Subheadings |
| `font-bold` | 700 | Headings, strong emphasis |

## Spacing

Use Tailwind's default spacing scale (base unit: 4px):

| Class | Value | Common Usage |
|-------|-------|--------------|
| `p-1` / `m-1` | 4px | Tight spacing |
| `p-2` / `m-2` | 8px | Component padding |
| `p-3` / `m-3` | 12px | Card padding |
| `p-4` / `m-4` | 16px | Section spacing |
| `p-6` / `m-6` | 24px | Large section spacing |
| `p-8` / `m-8` | 32px | Page margins |
| `gap-2` | 8px | Flex/grid gaps |
| `gap-4` | 16px | Standard gaps |

## Border Radius

| Class | Value | Usage |
|-------|-------|-------|
| `rounded-sm` | 2px | Minimal rounding |
| `rounded` | 4px | Inputs, small buttons |
| `rounded-md` | 6px | Buttons, badges |
| `rounded-lg` | 8px | Cards, modals |
| `rounded-xl` | 12px | Large cards |
| `rounded-full` | 9999px | Avatars, pills |

## Shadows

| Class | Usage |
|-------|-------|
| `shadow-sm` | Subtle elevation |
| `shadow` | Cards, dropdowns |
| `shadow-md` | Modals, popovers |
| `shadow-lg` | Floating elements |

## Interactive States

### Focus

```css
:focus-visible {
  outline: 1px solid #52525b; /* zinc-600 */
  outline-offset: 2px;
}
```

### Hover

- Background: Lighten by one step (e.g., `zinc-800` → `zinc-700`)
- Text: Use `text-zinc-50` on hover for muted text

### Disabled

- Opacity: `opacity-50`
- Cursor: `cursor-not-allowed`

## Animations

### Durations

| Duration | Usage |
|----------|-------|
| `duration-150` | Micro-interactions (hovers, focus) |
| `duration-200` | Buttons, toggles |
| `duration-300` | Modals, page transitions |

### Easing

- Default: `ease-in-out`
- Enter: `ease-out`
- Exit: `ease-in`

## Scrollbar

```css
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #3f3f46; /* zinc-700 */
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #52525b; /* zinc-600 */
}
```

## Component Patterns

### Cards

```html
<div class="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
  <!-- content -->
</div>
```

### Buttons

```html
<!-- Primary -->
<button class="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-150">
  Action
</button>

<!-- Secondary -->
<button class="bg-zinc-700 hover:bg-zinc-600 text-zinc-50 px-4 py-2 rounded-md font-medium transition-colors duration-150">
  Secondary
</button>

<!-- Ghost -->
<button class="hover:bg-zinc-800 text-zinc-400 hover:text-zinc-50 px-4 py-2 rounded-md font-medium transition-colors duration-150">
  Ghost
</button>
```

### Inputs

```html
<input class="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-600" />
```

## Accessibility

- Maintain minimum contrast ratio of 4.5:1 for text
- All interactive elements must have visible focus states
- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigability
