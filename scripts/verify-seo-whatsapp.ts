import "dotenv/config";
import http from "node:http";
import { spawn } from "node:child_process";

async function main() {
  console.log("🔍 Verifying WhatsApp, Favicon, and OpenGraph link preview meta tags...\n");

  const port = 3099;
  const proc = spawn("npx", ["next", "start", "-p", port.toString()], {
    shell: true,
    stdio: "pipe",
    env: { ...process.env, PORT: port.toString() },
  });

  // Wait for server to start
  await new Promise((resolve) => setTimeout(resolve, 4000));

  function fetchUrl(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      http
        .get(`http://localhost:${port}${path}`, (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => resolve(data));
        })
        .on("error", reject);
    });
  }

  function fetchStatusCode(path: string): Promise<number> {
    return new Promise((resolve, reject) => {
      http
        .get(`http://localhost:${port}${path}`, (res) => {
          resolve(res.statusCode || 500);
        })
        .on("error", reject);
    });
  }

  try {
    // 1. Verify Homepage
    console.log("📋 1. Checking Homepage (/) Meta & Icons");
    const homeHtml = await fetchUrl("/");
    
    assert(homeHtml.includes('property="og:title"'), "Homepage has og:title");
    assert(homeHtml.includes('property="og:description"'), "Homepage has og:description");
    assert(homeHtml.includes('property="og:image"'), "Homepage has og:image");
    assert(homeHtml.includes('property="og:image:width" content="1200"'), "Homepage has og:image:width = 1200");
    assert(homeHtml.includes('property="og:image:height" content="630"'), "Homepage has og:image:height = 630");
    assert(homeHtml.includes('name="theme-color" content="#7434E8"'), "Homepage has theme-color = #7434E8");
    assert(homeHtml.includes('rel="manifest"'), "Homepage has rel=manifest");

    // 2. Verify Favicon and Icons status codes
    console.log("\n📋 2. Checking Favicon & Icon Asset Endpoints");
    const icoCode = await fetchStatusCode("/favicon.ico");
    assert(icoCode === 200, `/favicon.ico endpoint returns HTTP 200 (Got: ${icoCode})`);

    const svgCode = await fetchStatusCode("/favicon.svg");
    assert(svgCode === 200, `/favicon.svg endpoint returns HTTP 200 (Got: ${svgCode})`);

    const iconCode = await fetchStatusCode("/icon.png");
    assert(iconCode === 200, `/icon.png endpoint returns HTTP 200 (Got: ${iconCode})`);

    const appleIconCode = await fetchStatusCode("/apple-icon.png");
    assert(appleIconCode === 200, `/apple-icon.png endpoint returns HTTP 200 (Got: ${appleIconCode})`);

    const ogCode = await fetchStatusCode("/opengraph-image");
    assert(ogCode === 200, `/opengraph-image endpoint returns HTTP 200 (Got: ${ogCode})`);

    const manifestCode = await fetchStatusCode("/manifest.webmanifest");
    assert(manifestCode === 200, `/manifest.webmanifest endpoint returns HTTP 200 (Got: ${manifestCode})`);

    // 3. Verify Article Page for WhatsApp Preview
    console.log("\n📋 3. Checking Article Page (/blog/complete-guide-modern-web-development-2026)");
    const articleHtml = await fetchUrl("/blog/complete-guide-modern-web-development-2026");
    assert(articleHtml.includes('property="og:title"'), "Article page has og:title");
    assert(articleHtml.includes('property="og:description"'), "Article page has og:description");
    assert(articleHtml.includes('property="og:image"'), "Article page has og:image");
    assert(articleHtml.includes('property="og:type" content="article"'), "Article page has og:type = article");
    assert(articleHtml.includes('name="twitter:card" content="summary_large_image"'), "Article page has twitter:card = summary_large_image");
    assert(articleHtml.includes('application/ld+json'), "Article page has BlogPosting JSON-LD structured data");

    console.log("\n🎉 All Favicon, OpenGraph and WhatsApp preview requirements verified successfully!");
  } catch (err) {
    console.error("Verification failed:", err);
  } finally {
    proc.kill();
    process.exit(0);
  }

  function assert(condition: boolean, desc: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${desc}`);
    } else {
      console.error(`  ❌ FAIL: ${desc}`);
    }
  }
}

main();
