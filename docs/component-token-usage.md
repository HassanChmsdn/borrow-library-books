# Component Token Usage

Use [design-tokens.md](./design-tokens.md) as the visual source of truth. This file explains how to apply that token system in code.

## Core Rule

Prefer semantic utilities over raw values. Reach for classes like `bg-card`, `text-text-secondary`, `border-input`, `rounded-input`, and `shadow-card` before using arbitrary colors, spacing, or radii.

## Color Tokens

- Page and section surfaces: `bg-background`, `bg-card`, `bg-elevated`, `bg-muted`, `bg-secondary`
- Text hierarchy: `text-foreground`, `text-text-secondary`, `text-text-tertiary`, `text-placeholder`
- Actions: `bg-primary`, `bg-primary-hover`, `text-primary-foreground`
- Borders and focus: `border-border`, `border-border-subtle`, `border-border-strong`, `border-input`, `ring-ring`
- Status colors: `bg-success`, `bg-success-surface`, `border-success-border`, `text-success`, and the same pattern for `warning`, `danger`, and `info`

## Typography Tokens

- Body copy: `text-body`, `text-body-sm`, `text-body-lg`
- Labels and metadata: `text-label`, `text-caption`
- Section headings: `text-title-sm`, `text-title`, `text-title-lg`
- Brand or display accents: `text-brand` with `font-heading`
- Default fonts: `font-sans` for UI copy, `font-heading` for editorial headings, `font-mono` for code or system data

## Spacing And Radius

- Use the spacing scale first: `p-4`, `px-5`, `gap-3`, `space-y-6`
- Use layout aliases for page composition when needed: `px-gutter`, `gap-stack`, `py-section`
- Use semantic radius tokens for component types: `rounded-input`, `rounded-card`, `rounded-pill`

## Shadows

- Small interactive controls: `shadow-xs` or `shadow-sm`
- Standard surfaces: `shadow-card` or `shadow-md`
- Large overlays or featured panels: `shadow-lg` or `shadow-xl`
- Focus treatments should use `ring-ring`; do not create one-off focus colors

## Mobile-First Responsive Pattern

Set the smallest layout first, then scale up only where the component changes materially.

```tsx
<Card className="gap-4 p-5 sm:p-6 lg:p-8">
  <CardTitle className="text-title-sm lg:text-title" />
</Card>
```

Keep the token names stable across breakpoints. Change the utility usage, not the design language.

## Avoid

- Raw hex colors in component classes
- Arbitrary radii like `rounded-[22px]` when a token exists
- One-off shadows that bypass `shadow-*` tokens
- Component-specific hard-coded typography that duplicates the scale
