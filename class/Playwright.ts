import Logger from "./Logger";
import { BrowserContext, chromium } from "playwright";
import config from "../constants/config";

class Playwright {
  private context?: BrowserContext;
  private browser?: any;

  private async checkPage() {
    if (this.context) return;

    try {
      this.browser = await chromium.launch({
        headless: true, // Required for container environments
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-accelerated-2d-canvas",
          "--no-first-run",
          "--no-zygote",
          "--disable-gpu",
        ],
      });
      this.context = await this.browser.newContext({
        locale: "en-US",
        viewport: { width: 1280, height: 720 },
      });
      Logger.info("Browser context created successfully");
    } catch (error) {
      Logger.error(`Failed to create browser context: ${error}`);
      throw error;
    }
  }

  /**
   * Cleanup browser resources
   */
  public async cleanup(): Promise<void> {
    try {
      if (this.context) {
        await this.context.close();
        this.context = undefined;
      }
      if (this.browser) {
        await this.browser.close();
        this.browser = undefined;
      }
      Logger.info("Browser resources cleaned up successfully");
    } catch (error) {
      Logger.error(`Error during cleanup: ${error}`);
    }
  }

  /**
   * Reset browser context (useful for recovery)
   */
  public async resetContext(): Promise<void> {
    await this.cleanup();
    await this.checkPage();
  }

  public async click最新文章(title: string) {
    await this.checkPage();

    const page = await this.context!.newPage();
    const url = "https://www.sinotrade.com.tw/richclub";
    const target = page.locator(`text=${title}`);

    const maxRetries = config.maxRetries;
    let retries = 0;

    await page.goto(url);

    while (!(await target.isVisible()) && retries < maxRetries) {
      try {
        await page.getByRole("button", { name: "看更多" }).click();
        retries++;
        Logger.info(`clicked 看更多. Attempt #${retries}`);
        await page.waitForTimeout(500);
      } catch (error) {
        Logger.error("Button not found or could not be clicked.");
        break;
      }
    }

    await target.click();
    await page
      .getByText("研究小編 更新於")
      .waitFor({ timeout: config.browserTimeout });
    Logger.success(`clicked ${title}`);
  }

  public async clickLatest深談總經() {
    await this.checkPage();

    const url = "https://www.sinotrade.com.tw/richclub/MacroExpert";
    const page = await this.context!.newPage();

    try {
      await page.goto(url);
      await page.locator(".first-content-col").click();

      const title = await page
        .locator(".post-detail-wrapper")
        .getAttribute("title");

      await page
        .getByText("研究小編 更新於")
        .waitFor({ timeout: config.browserTimeout });
      Logger.success(`clicked ${title}`);
    } finally {
      await page.close();
    }
  }

  public async clickLatest獨家特輯(id: string) {
    await this.checkPage();

    const url = `https://www.sinotrade.com.tw/richclub/features/${id}`;
    const page = await this.context!.newPage();

    try {
      await page.goto(url);
      await page.locator(".pagination-content-list .col").first().click();
      await page
        .getByText("研究小編 更新於")
        .waitFor({ timeout: config.browserTimeout });

      const title = await page
        .locator(".post-detail-wrapper")
        .getAttribute("title");

      Logger.success(`clicked ${title}`);
    } finally {
      await page.close();
    }
  }
}

export default new Playwright();
