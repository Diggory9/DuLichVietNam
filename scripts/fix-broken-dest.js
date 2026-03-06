const fs = require('fs');
const path = require('path');

const destPath = path.join(__dirname, '../src/data/destinations.json');
const dests = JSON.parse(fs.readFileSync(destPath, 'utf-8'));

const brokenId = '1694153366631-a36d2c2409d1';
// Replace with a known working nature photo
const replaceId = '1565834009162-792910c3b46a';

let count = 0;
dests.forEach(d => {
  d.images.forEach(img => {
    if (img.src.includes(brokenId)) {
      img.src = img.src.replace(brokenId, replaceId);
      count++;
    }
  });
});

fs.writeFileSync(destPath, JSON.stringify(dests, null, 2), 'utf-8');
console.log(`Fixed ${count} broken image(s)`);
