import { expect, test } from "@playwright/test";

test("primary routes, mocked data, and rename", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Build from a solid foundation" })).toBeVisible();

  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Sample records" })
    .click();
  await expect(page.getByRole("heading", { name: "Sample records" })).toBeVisible();
  await expect(page.getByRole("link", { name: "First sample" })).toBeVisible();

  await page.getByRole("link", { name: "First sample" }).click();
  await expect(page.getByRole("heading", { name: "First sample" })).toBeVisible();
  await page.getByRole("textbox", { name: "Rename this sample" }).fill("Renamed sample");
  await page.getByRole("button", { name: "Save name" }).click();
  await expect(page.getByRole("heading", { name: "Renamed sample" })).toBeVisible();

  await page.getByRole("link", { name: "All sample records" }).click();
  await expect(page.getByRole("link", { name: "Renamed sample" })).toBeVisible();
});

test("empty, recoverable error, and unknown route", async ({ page }) => {
  await page.goto("/records?mock=empty");
  await expect(page.getByText("No sample records")).toBeVisible();

  await page.goto("/records?mock=retry-once");
  await expect(page.getByRole("heading", { name: "This page could not load" })).toBeVisible();
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("link", { name: "First sample" })).toBeVisible();

  await page.goto("/missing");
  await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
});

test("mobile navigation and theme are keyboard-operable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open navigation menu" });
  await menu.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("menuitem", { name: "Sample records" }).click();
  await expect(page.getByRole("heading", { name: "Sample records" })).toBeVisible();

  const theme = page.getByRole("button", { name: "Theme: System" });
  await theme.click();
  await expect(page.getByRole("button", { name: "Theme: Light" })).toBeVisible();
});
