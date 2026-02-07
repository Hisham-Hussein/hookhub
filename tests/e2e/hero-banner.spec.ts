import { test, expect } from '@playwright/test';

test.describe('HeroBanner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('content and visibility', () => {
    test('hero section is the first visible content on the page', async ({ page }) => {
      const section = page.locator('section').first();
      await expect(section).toBeVisible();

      // Hero should be near the top of the page
      const box = await section.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.y).toBeLessThan(200);
    });

    test('displays headline with site purpose text', async ({ page }) => {
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
      await expect(h1).toContainText('Claude Code Hooks');
    });

    test('displays subtitle describing the directory', async ({ page }) => {
      const subtitle = page.locator('section p').first();
      await expect(subtitle).toBeVisible();
      await expect(subtitle).toContainText('directory');
    });

    test('displays animated scroll cue chevron', async ({ page }) => {
      const heroSection = page.locator('section[aria-labelledby="hero-heading"]');
      const svg = heroSection.locator('svg');
      await expect(svg).toBeVisible();
    });

    test('hero content is centered horizontally', async ({ page }) => {
      const h1 = page.locator('h1');
      const h1Box = await h1.boundingBox();
      const viewportSize = page.viewportSize();
      expect(h1Box).not.toBeNull();
      expect(viewportSize).not.toBeNull();

      const h1Center = h1Box!.x + h1Box!.width / 2;
      const viewportCenter = viewportSize!.width / 2;
      // Allow 20px tolerance for centering
      expect(Math.abs(h1Center - viewportCenter)).toBeLessThan(20);
    });
  });

  test.describe('typography and styling', () => {
    test('headline uses Poppins font family', async ({ page }) => {
      const h1 = page.locator('h1');
      const fontFamily = await h1.evaluate(el =>
        window.getComputedStyle(el).fontFamily
      );
      expect(fontFamily.toLowerCase()).toContain('poppins');
    });

    test('body text uses Roboto font family', async ({ page }) => {
      const subtitle = page.locator('section p').first();
      const fontFamily = await subtitle.evaluate(el =>
        window.getComputedStyle(el).fontFamily
      );
      // next/font/google generates names like "__Roboto_xxxxxx"
      // The font-body utility resolves through CSS variables to the Roboto font
      const lower = fontFamily.toLowerCase();
      expect(lower.includes('roboto') || lower.includes('__roboto')).toBe(true);
    });

    test('page has dark background', async ({ page }) => {
      const bgColor = await page.locator('body').evaluate(el =>
        window.getComputedStyle(el).backgroundColor
      );
      // Should be black or very dark (rgb(0, 0, 0) or similar)
      expect(bgColor).toMatch(/rgb\(0,\s*0,\s*0\)/);
    });

    test('headline text is light colored on dark background', async ({ page }) => {
      const h1 = page.locator('h1');
      // Use canvas to get the actual rendered color as RGB regardless of CSS format
      const rgb = await h1.evaluate(el => {
        const color = window.getComputedStyle(el).color;
        // Create a canvas context to convert any CSS color format to RGB
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        return { r, g, b };
      });
      // Light text should have high RGB values (> 200)
      expect(rgb.r).toBeGreaterThan(200);
      expect(rgb.g).toBeGreaterThan(200);
      expect(rgb.b).toBeGreaterThan(200);
    });

    test('headline font weight is light (300)', async ({ page }) => {
      const h1 = page.locator('h1');
      const fontWeight = await h1.evaluate(el =>
        window.getComputedStyle(el).fontWeight
      );
      expect(fontWeight).toBe('300');
    });
  });

  test.describe('accessibility', () => {
    test('skip link is hidden by default and visible on focus', async ({ page }) => {
      const skipLink = page.locator('a[href="#main-content"]');

      // Should exist but not be visually visible (sr-only)
      await expect(skipLink).toBeAttached();

      // Tab to focus the skip link
      await page.keyboard.press('Tab');

      // After focus, it should become visible
      await expect(skipLink).toBeVisible();
      await expect(skipLink).toContainText('Skip');
    });

    test('section has accessible name via aria-labelledby', async ({ page }) => {
      const section = page.locator('section[aria-labelledby="hero-heading"]');
      await expect(section).toBeAttached();

      const h1 = page.locator('h1#hero-heading');
      await expect(h1).toBeAttached();
    });

    test('decorative scroll cue is hidden from screen readers', async ({ page }) => {
      const scrollCueContainer = page.locator('div[aria-hidden="true"]').filter({
        has: page.locator('svg')
      });
      await expect(scrollCueContainer).toBeAttached();
    });

    test('page has exactly one h1 element (correct heading hierarchy)', async ({ page }) => {
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);
    });

    test('skip link target #main-content exists on the page', async ({ page }) => {
      const target = page.locator('#main-content');
      await expect(target).toBeAttached();
    });
  });

  test.describe('responsive layout', () => {
    test('hero renders correctly at mobile viewport (375px)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/');

      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();

      const section = page.locator('section').first();
      const sectionBox = await section.boundingBox();
      expect(sectionBox).not.toBeNull();
      // Section should not overflow viewport width
      expect(sectionBox!.width).toBeLessThanOrEqual(375);
    });

    test('hero renders correctly at tablet viewport (768px)', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');

      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();

      const subtitle = page.locator('section p').first();
      await expect(subtitle).toBeVisible();
    });

    test('hero renders correctly at desktop viewport (1280px)', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/');

      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();

      // On desktop, headline font size should be larger
      const fontSize = await h1.evaluate(el =>
        parseFloat(window.getComputedStyle(el).fontSize)
      );
      // lg:text-5xl = 3rem = 48px
      expect(fontSize).toBeGreaterThanOrEqual(36);
    });

    test('headline text does not overflow its container', async ({ page }) => {
      const h1 = page.locator('h1');
      const h1Box = await h1.boundingBox();
      const container = page.locator('section').first();
      const containerBox = await container.boundingBox();

      expect(h1Box).not.toBeNull();
      expect(containerBox).not.toBeNull();
      expect(h1Box!.width).toBeLessThanOrEqual(containerBox!.width);
    });
  });

  test.describe('scroll cue animation', () => {
    test('scroll cue SVG has CSS animation applied', async ({ page }) => {
      const heroSection = page.locator('section[aria-labelledby="hero-heading"]');
      const svg = heroSection.locator('svg');
      const animation = await svg.evaluate(el =>
        window.getComputedStyle(el).animationName
      );
      // Should have the gentle-bounce animation (not "none")
      expect(animation).not.toBe('none');
    });

    test('scroll cue animation is infinite', async ({ page }) => {
      const heroSection = page.locator('section[aria-labelledby="hero-heading"]');
      const svg = heroSection.locator('svg');
      const iterationCount = await svg.evaluate(el =>
        window.getComputedStyle(el).animationIterationCount
      );
      expect(iterationCount).toBe('infinite');
    });
  });
});
