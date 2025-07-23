import Playwright from "./Playwright";

const target = "";

class SinoTrade {
  public async main() {
    await Playwright.clickLatest深談總經();
    await Playwright.clickLatest獨家特輯("669f23dc8a27622f1cb451ed");
    if (target) await Playwright.click最新文章(target);
  }
}

export default new SinoTrade();
