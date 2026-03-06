const fs = require('fs');
const path = require('path');
const https = require('https');

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.end();
  });
}

async function main() {
  const destPath = path.join(__dirname, '../src/data/destinations.json');
  const dests = JSON.parse(fs.readFileSync(destPath, 'utf-8'));

  // Collect unique image URLs
  const urlSet = new Set();
  dests.forEach(d => {
    d.images.forEach(img => urlSet.add(img.src));
  });

  const urls = [...urlSet];
  console.log(`Testing ${urls.length} unique image URLs...`);

  const broken = [];
  // Test in batches of 10
  for (let i = 0; i < urls.length; i += 10) {
    const batch = urls.slice(i, i + 10);
    const results = await Promise.all(batch.map(async u => ({ url: u, ok: await checkUrl(u) })));
    results.forEach(r => {
      if (!r.ok) {
        broken.push(r.url);
      }
    });
    process.stdout.write(`  ${Math.min(i + 10, urls.length)}/${urls.length}\r`);
  }

  console.log(`\nBroken URLs: ${broken.length}/${urls.length}`);
  if (broken.length > 0) {
    // Extract the photo IDs that are broken
    const brokenIds = broken.map(u => {
      const m = u.match(/photo-([^?]+)/);
      return m ? m[1] : u;
    });
    console.log('Broken photo IDs:', JSON.stringify([...new Set(brokenIds)]));
  }
}

main();
