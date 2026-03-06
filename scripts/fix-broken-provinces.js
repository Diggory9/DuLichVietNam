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

// Candidate photo IDs to try for each broken province
const candidates = {
  'ha-noi': [
    '1595444813498-71ea1e0f4f85',
    '1509030450996-dd1a26dda07a',
    '1555921015-5532091f6026',
    '1580838017504-aef28a3a8dfe',
    '1562789031-c8f98c541b52',
  ],
  'quang-ninh': [
    '1573790387438-4da905039392',
    '1508115413172-d24e2808e7fc',
    '1487548919775-a7a460f3cbe6',
    '1560113781-cb0bddd6772b',
    '1588109181654-82035e0ead9b',
  ],
};

async function main() {
  const provPath = path.join(__dirname, '../src/data/provinces.json');
  const provinces = JSON.parse(fs.readFileSync(provPath, 'utf-8'));

  for (const slug of Object.keys(candidates)) {
    const prov = provinces.find(p => p.slug === slug);
    if (!prov) continue;

    console.log(`Fixing ${slug}...`);
    let found = false;

    for (const id of candidates[slug]) {
      const url = `https://images.unsplash.com/photo-${id}?w=400&h=300&fit=crop&auto=format`;
      const ok = await checkUrl(url);
      if (ok) {
        prov.heroImage = `https://images.unsplash.com/photo-${id}?w=1200&h=800&fit=crop&auto=format`;
        prov.thumbnail = `https://images.unsplash.com/photo-${id}?w=400&h=300&fit=crop&auto=format`;
        console.log(`  OK: photo-${id}`);
        found = true;
        break;
      } else {
        console.log(`  FAIL: photo-${id}`);
      }
    }

    if (!found) {
      console.log(`  WARNING: No working image found for ${slug}`);
    }
  }

  fs.writeFileSync(provPath, JSON.stringify(provinces, null, 2), 'utf-8');
  console.log('Done!');
}

main();
