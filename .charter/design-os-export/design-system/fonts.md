# Typography Configuration

## Google Fonts Import

Add to your HTML `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400&family=Poppins:wght@300;400;500&family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">
```

## Font Usage

| Role | Font | Weight | Tailwind Class |
|------|------|--------|----------------|
| Headings | Poppins | Light (300) | `font-headline font-light` |
| Body text | Roboto | Light (300) | `font-body font-light` |
| Code/technical | JetBrains Mono | Regular (400) | `font-mono` |

## Tailwind Font Family Configuration

Add custom font families to your Tailwind config:

```css
@theme {
  --font-headline: 'Poppins', sans-serif;
  --font-body: 'Roboto', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
}
```

## Design Notes

- HookHub uses exclusively light-weight (300) fonts for headings and body, giving a clean, modern aesthetic
- Font weight increases to medium (500) only for selected filter chips to provide a visual weight contrast between active and inactive states
- JetBrains Mono is used sparingly — primarily for code snippets if/when hook implementation details are shown
