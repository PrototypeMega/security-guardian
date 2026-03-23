/**
 * Browser Manager
 * Handles Puppeteer browser instances and automation actions
 */

const puppeteer = require('puppeteer');
const chalk = require('chalk');

class BrowserManager {
  constructor() {
    this.browser = null;
    this.pages = new Map(); // Map of session IDs to page instances
  }

  /**
   * Initialize browser instance
   */
  async init() {
    try {
      console.log(chalk.blue('🌐 Launching browser...'));
      this.browser = await puppeteer.launch({
        headless: false, // Show browser window for demo/testing
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      console.log(chalk.green('✓ Browser launched successfully'));
      return true;
    } catch (error) {
      console.error(chalk.red(`✗ Failed to launch browser: ${error.message}`));
      return false;
    }
  }

  /**
   * Get or create a page for a session
   */
  async getPage(sessionId = 'default') {
    if (!this.pages.has(sessionId)) {
      const page = await this.browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      this.pages.set(sessionId, page);
    }
    return this.pages.get(sessionId);
  }

  /**
   * Navigate to URL
   */
  async navigate(url, sessionId = 'default') {
    try {
      const page = await this.getPage(sessionId);
      console.log(chalk.blue(`📍 Navigating to: ${url}`));
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      console.log(chalk.green(`✓ Navigated successfully`));
      return { success: true, url: page.url() };
    } catch (error) {
      console.error(chalk.red(`✗ Navigation failed: ${error.message}`));
      return { success: false, error: error.message };
    }
  }

  /**
   * Click an element
   */
  async click(selector, sessionId = 'default') {
    try {
      const page = await this.getPage(sessionId);
      console.log(chalk.blue(`🖱️  Clicking: ${selector}`));
      await page.click(selector);
      await page.waitForTimeout(500); // Small delay for page reaction
      console.log(chalk.green(`✓ Clicked successfully`));
      return { success: true };
    } catch (error) {
      console.error(chalk.red(`✗ Click failed: ${error.message}`));
      return { success: false, error: error.message };
    }
  }

  /**
   * Type text into element
   */
  async type(selector, text, sessionId = 'default') {
    try {
      const page = await this.getPage(sessionId);
      console.log(chalk.blue(`⌨️  Typing into ${selector}: "${text}"`));
      await page.type(selector, text);
      console.log(chalk.green(`✓ Typed successfully`));
      return { success: true };
    } catch (error) {
      console.error(chalk.red(`✗ Type failed: ${error.message}`));
      return { success: false, error: error.message };
    }
  }

  /**
   * Submit form
   */
  async submit(selector, sessionId = 'default') {
    try {
      const page = await this.getPage(sessionId);
      console.log(chalk.blue(`📤 Submitting form: ${selector}`));
      await page.click(selector);
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {});
      console.log(chalk.green(`✓ Form submitted`));
      return { success: true };
    } catch (error) {
      console.error(chalk.red(`✗ Submit failed: ${error.message}`));
      return { success: false, error: error.message };
    }
  }

  /**
   * Wait for element
   */
  async waitFor(selector, timeout = 5000, sessionId = 'default') {
    try {
      const page = await this.getPage(sessionId);
      console.log(chalk.blue(`⏳ Waiting for: ${selector}`));
      await page.waitForSelector(selector, { timeout });
      console.log(chalk.green(`✓ Element found`));
      return { success: true };
    } catch (error) {
      console.error(chalk.red(`✗ Wait failed: ${error.message}`));
      return { success: false, error: error.message };
    }
  }

  /**
   * Extract text from page
   */
  async extractText(selector = 'body', sessionId = 'default') {
    try {
      const page = await this.getPage(sessionId);
      console.log(chalk.blue(`📖 Extracting text from: ${selector}`));
      const text = await page.$eval(selector, el => el.innerText);
      console.log(chalk.green(`✓ Extracted ${text.length} characters`));
      return { success: true, text };
    } catch (error) {
      console.error(chalk.red(`✗ Extract failed: ${error.message}`));
      return { success: false, error: error.message };
    }
  }

  /**
   * Take screenshot
   */
  async screenshot(sessionId = 'default') {
    try {
      const page = await this.getPage(sessionId);
      console.log(chalk.blue(`📸 Taking screenshot...`));
      const buffer = await page.screenshot({ encoding: 'base64' });
      console.log(chalk.green(`✓ Screenshot captured`));
      return { success: true, screenshot: `data:image/png;base64,${buffer}` };
    } catch (error) {
      console.error(chalk.red(`✗ Screenshot failed: ${error.message}`));
      return { success: false, error: error.message };
    }
  }

  /**
   * Scroll page
   */
  async scroll(direction = 'down', amount = 3, sessionId = 'default') {
    try {
      const page = await this.getPage(sessionId);
      const scrollAmount = amount * 300; // Each unit = 300px
      const direction_map = { up: -scrollAmount, down: scrollAmount };

      console.log(chalk.blue(`⬇️  Scrolling ${direction} by ${scrollAmount}px`));
      await page.evaluate((distance) => {
        window.scrollBy(0, distance);
      }, direction_map[direction]);

      console.log(chalk.green(`✓ Scrolled successfully`));
      return { success: true };
    } catch (error) {
      console.error(chalk.red(`✗ Scroll failed: ${error.message}`));
      return { success: false, error: error.message };
    }
  }

  /**
   * Get page HTML
   */
  async getHTML(sessionId = 'default') {
    try {
      const page = await this.getPage(sessionId);
      const html = await page.content();
      console.log(chalk.green(`✓ Retrieved page HTML (${html.length} bytes)`));
      return { success: true, html };
    } catch (error) {
      console.error(chalk.red(`✗ Get HTML failed: ${error.message}`));
      return { success: false, error: error.message };
    }
  }

  /**
   * Close a page
   */
  async closePage(sessionId) {
    try {
      if (this.pages.has(sessionId)) {
        const page = this.pages.get(sessionId);
        await page.close();
        this.pages.delete(sessionId);
        console.log(chalk.green(`✓ Page closed`));
      }
      return { success: true };
    } catch (error) {
      console.error(chalk.red(`✗ Close failed: ${error.message}`));
      return { success: false, error: error.message };
    }
  }

  /**
   * Close browser
   */
  async close() {
    try {
      // Close all pages
      for (const [sessionId] of this.pages) {
        await this.closePage(sessionId);
      }
      // Close browser
      if (this.browser) {
        await this.browser.close();
        console.log(chalk.green('✓ Browser closed'));
      }
      return true;
    } catch (error) {
      console.error(chalk.red(`✗ Browser close failed: ${error.message}`));
      return false;
    }
  }
}

module.exports = BrowserManager;
