const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../src/data');

// Read all regional files
const files = [
  'destinations-bac-1.json',
  'destinations-bac-2.json',
  'destinations-trung-1.json',
  'destinations-trung-2.json',
  'destinations-nam.json'
];

let allDests = [];
for (const file of files) {
  const filePath = path.join(dataDir, file);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    allDests = allDests.concat(data);
    console.log(`  ${file}: ${data.length} destinations`);
  } else {
    console.error(`  MISSING: ${file}`);
  }
}

// Check for duplicate slugs
const slugs = allDests.map(d => d.slug);
const dupes = slugs.filter((s, i) => slugs.indexOf(s) !== i);
if (dupes.length > 0) {
  console.error(`WARNING: Duplicate slugs found: ${dupes.join(', ')}`);
}

// Write merged file
const outputPath = path.join(dataDir, 'destinations.json');
fs.writeFileSync(outputPath, JSON.stringify(allDests, null, 2), 'utf-8');
console.log(`\nTotal: ${allDests.length} destinations written to destinations.json`);

// Clean up temp files
for (const file of files) {
  const filePath = path.join(dataDir, file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
console.log('Cleaned up temporary files.');
