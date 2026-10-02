// Converts public/og-image.svg (the editable source) into public/og-image.png,
// the 1200x630 picture LinkedIn, X, Facebook, Slack etc. show when a link is shared.
// Those sites don't accept SVG, so the PNG is what the pages point to.
//
// Run after editing the SVG:   npm run og-image
// Then commit both files.
import sharp from 'sharp';

const src = 'public/og-image.svg';
const out = 'public/og-image.png';

const info = await sharp(src, { density: 144 })
  .resize(1200, 630, { fit: 'cover' })
  .png({ compressionLevel: 9 })
  .toFile(out);

console.log(`${out}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(0)} KB`);
