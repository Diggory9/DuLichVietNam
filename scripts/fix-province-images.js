const fs = require('fs');
const path = require('path');

const provPath = path.join(__dirname, '../src/data/provinces.json');
const destPath = path.join(__dirname, '../src/data/destinations.json');

const provinces = JSON.parse(fs.readFileSync(provPath, 'utf-8'));
const destinations = JSON.parse(fs.readFileSync(destPath, 'utf-8'));

// Build a map: provinceSlug -> first destination's image
const destByProv = {};
destinations.forEach(d => {
  if (!destByProv[d.provinceSlug]) {
    destByProv[d.provinceSlug] = d;
  }
});

// Curated real Unsplash photo IDs for major provinces
const curatedPhotos = {
  'ha-noi': '1583531579927-24eb1e2a0b3c',
  'ho-chi-minh': '1583417319070-4a69db38a482',
  'da-nang': '1559592413-7cec4d0cae2b',
  'quang-ninh': '1528127269322-539152af8e65',
  'lao-cai': '1694152491540-235884fe8761',
  'ha-giang': '1681350351313-fa88f209607a',
  'ninh-binh': '1632753561897-964f1408b48e',
  'thua-thien-hue': '1576749428523-01f843010bd2',
  'quang-nam': '1679033932050-831ace7a226f',
  'khanh-hoa': '1577695184496-f87ebc9b6072',
  'lam-dong': '1668000018482-a02acf02b22a',
  'kien-giang': '1759063242648-d074cfdf9675',
  'can-tho': '1553851919-596510268b99',
  'hai-phong': '1547024842-7c86b2226ef5',
};

let updated = 0;

provinces.forEach(prov => {
  // Use curated photo if available
  if (curatedPhotos[prov.slug]) {
    const id = curatedPhotos[prov.slug];
    prov.heroImage = `https://images.unsplash.com/photo-${id}?w=1200&h=800&fit=crop&auto=format`;
    prov.thumbnail = `https://images.unsplash.com/photo-${id}?w=400&h=300&fit=crop&auto=format`;
    updated++;
    return;
  }

  // For other provinces, use the first destination's image from that province
  const dest = destByProv[prov.slug];
  if (dest && dest.images && dest.images[0]) {
    const imgSrc = dest.images[0].src;
    // Create hero (larger) and thumbnail (smaller) versions
    prov.heroImage = imgSrc.replace('w=800&h=600', 'w=1200&h=800');
    prov.thumbnail = imgSrc.replace('w=800&h=600', 'w=400&h=300');
    updated++;
    return;
  }

  console.log('  WARNING: No image for', prov.slug);
});

fs.writeFileSync(provPath, JSON.stringify(provinces, null, 2), 'utf-8');
console.log(`Updated images for ${updated}/${provinces.length} provinces`);
