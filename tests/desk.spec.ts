import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('About opens, moves, and stays put', async ({ page, isMobile }) => {
  test.skip(isMobile, 'nothing drags on a phone');
  await page.goto('/');
  await expect(page.locator('#welcome')).toBeVisible();
  await page.getByRole('link', { name: 'About.exe' }).click();
  const about = page.locator('#about');
  await expect(about).toBeVisible();

  const bar = about.locator('.titlebar');
  const box = (await bar.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + 8);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 200, box.y + 108, { steps: 5 });
  await page.mouse.up();
  const moved = await about.evaluate((el) => [el.style.left, el.style.top]);

  await page.reload();
  await expect(about).toBeVisible();
  expect(await about.evaluate((el) => [el.style.left, el.style.top])).toEqual(moved);
});

test('F6 hops between windows, and Esc takes a nudge back', async ({ page, isMobile }) => {
  test.skip(isMobile, 'no keyboard on a phone');
  await page.goto('/');
  await expect(page.locator('#welcome')).toBeVisible();
  await page.getByRole('link', { name: 'About.exe' }).press('Enter');
  const aboutBar = page.locator('#about .titlebar');
  await expect(aboutBar).toBeFocused();

  await page.keyboard.press('F6');
  await expect(aboutBar).not.toBeFocused();
  await expect(page.locator('.titlebar:focus')).toHaveCount(1);

  const win = page.locator('.window:has(.titlebar:focus)');
  const before = await win.evaluate((el) => el.style.left);
  await page.keyboard.press('ArrowRight');
  await expect(win).not.toHaveCSS('left', before);
  await page.keyboard.press('Escape');
  expect(await win.evaluate((el) => el.style.left)).toBe(before);
});

for (const path of ['/', '/works/testwork0/']) {
  test('nothing the scanner can find on ' + path, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations.map((v) => v.id + ': ' + v.nodes[0].target)).toEqual([]);
  });
}

test('Access is denied, then it restores anyway', async ({ page, isMobile }) => {
  test.skip(isMobile, 'once is enough');
  await page.goto('/');
  await expect(page.locator('#welcome')).toBeVisible();
  await page.getByRole('link', { name: 'About.exe' }).click();
  await page.getByRole('button', { name: 'start' }).click();
  await page.getByRole('button', { name: 'Restore Default Desktop' }).click();
  await expect(page.getByText('Access is denied')).toBeVisible();
  await page.getByRole('button', { name: 'Retry' }).click();
  await expect(page.locator('#welcome')).toBeVisible();
  await expect(page.locator('#about')).toBeHidden();
});

test('the newest window opens on top', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'a phone thing');
  await page.goto('/');
  await expect(page.locator('#welcome')).toBeVisible();
  await page.getByRole('link', { name: 'About.exe' }).click();
  await expect(page.locator('.icons + .window')).toHaveId('about');
  await page.getByRole('link', { name: 'All Works' }).click();
  await expect(page.locator('.icons + .window')).toHaveId('my-works');
});