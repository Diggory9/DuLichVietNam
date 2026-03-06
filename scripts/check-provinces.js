const p = require('../src/data/provinces.json');
const bad = p.filter(x => x.thumbnail && x.thumbnail.includes('160059'));
console.log('Fake thumbnails:', bad.length);
bad.slice(0,3).forEach(x => console.log(' ', x.slug, x.thumbnail.substring(0,70)));
const noImg = p.filter(x => !x.thumbnail);
console.log('No thumbnail:', noImg.length);
const good = p.filter(x => x.thumbnail && !x.thumbnail.includes('160059'));
console.log('Good thumbnails:', good.length);
good.slice(0,3).forEach(x => console.log(' ', x.slug, x.thumbnail.substring(0,70)));
