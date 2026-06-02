import { chromium } from "playwright";

const url = process.argv[2] || "http://localhost:3000/bg/table?id=5";
const out = process.argv[3] || "screenshots/table-newspaper.png";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
page.on("pageerror", (err) => console.log("[pageerror]", err.message));

try {
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
} catch (e) {
  console.log("[goto]", e.message);
}
await page.waitForTimeout(2500);

// viewport (above-the-fold)
await page.screenshot({ path: out.replace(".png", "-viewport.png"), fullPage: false });
// full
await page.screenshot({ path: out, fullPage: true });
console.log("saved", out);

await browser.close();
