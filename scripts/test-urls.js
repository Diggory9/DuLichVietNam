const fs = require('fs');
const path = require('path');
const https = require('https');

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
      resolve({ url, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 400 });
    });
    req.on('error', () => resolve({ url, status: 0, ok: false }));
    req.on('timeout', () => { req.destroy(); resolve({ url, status: 0, ok: false }); });
    req.end();
  });
}

async function main() {
  const provPath = path.join(__dirname, '../src/data/provinces.json');
  const provinces = JSON.parse(fs.readFileSync(provPath, 'utf-8'));

  console.log('Testing province thumbnails...');
  let good = 0, bad = 0;
  const badSlugs = [];

  for (const p of provinces) {
    const result = await checkUrl(p.thumbnail);
    if (result.ok) {
      good++;
    } else {
      bad++;
      badSlugs.push(p.slug);
      console.log(`  FAIL [${result.status}]: ${p.slug} - ${p.thumbnail.substring(0, 80)}`);
    }
  }

  console.log(`\nResults: ${good} OK, ${bad} FAILED`);
  console.log('Bad slugs:', JSON.stringify(badSlugs));
}

main();
