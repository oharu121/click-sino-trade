import OhMyLogo from "../class/OhMyLogo";
import fs from "fs";
import dayjs from "dayjs";

const logoText = OhMyLogo.setText("wonderful script").addFontStyle().getText();
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf-8"));
const timestamp = dayjs().format("YYYY年MM月DD日 HH:mm:ss");
const appVersion = packageJson.version;
const banner = [
  "=============================================================================",
  logoText,
  `実行時刻：${timestamp}`,
  `バージョン：${appVersion}`,
  "=============================================================================",
].join("\n");

console.log(OhMyLogo.setText(banner).addRandomGradient());