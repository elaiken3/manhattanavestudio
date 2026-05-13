#!/usr/bin/env node
/**
 * Image optimization pipeline.
 *
 * Run:   npm install sharp && npm run optimize:images
 *
 * - Re-encodes large JPGs in /public to a sensible max width and quality.
 * - Emits a WebP alongside each JPG/PNG.
 * - Rasterizes /public/og-image.svg to /public/og-image.jpg (1200x630, ~85q)
 *   and /public/apple-touch-icon.png (180x180).
 *
 * Sharp is declared as an optionalDependency so the project still installs
 * without the native binary in restricted CI environments.
 */
import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '..', 'public');

let sharp;
try {
  ({ default: sharp } = await import('sharp'));
} catch (err) {
  console.error('sharp is not installed. Run: npm install sharp');
  process.exit(1);
}

const MAX_WIDTH = 1600;
const JPG_QUALITY = 82;
const WEBP_QUALITY = 80;

async function processRaster(file) {
  const full = path.join(PUBLIC_DIR, file);
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

  const info = await stat(full);
  if (info.size < 200 * 1024) return; // skip already-small files

  const img = sharp(full).rotate();
  const meta = await img.metadata();
  const width = Math.min(meta.width || MAX_WIDTH, MAX_WIDTH);

  // Re-encode in place
  if (ext === '.png') {
    await img.resize({ width, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(full + '.tmp');
  } else {
    await img.resize({ width, withoutEnlargement: true }).jpeg({ quality: JPG_QUALITY, mozjpeg: true }).toFile(full + '.tmp');
  }
  await writeFile(full, await readFile(full + '.tmp'));

  // WebP sibling
  const webpPath = full.replace(/\.(jpe?g|png)$/i, '.webp');
  await sharp(full).resize({ width, withoutEnlargement: true }).webp({ quality: WEBP_QUALITY }).toFile(webpPath);

  console.log(`✓ ${file} → optimized + ${path.basename(webpPath)}`);
}

async function generateOgImage() {
  const svg = path.join(PUBLIC_DIR, 'og-image.svg');
  try {
    await stat(svg);
  } catch { return; }

  const jpg = path.join(PUBLIC_DIR, 'og-image.jpg');
  await sharp(svg, { density: 192 }).resize(1200, 630).jpeg({ quality: 88, mozjpeg: true }).toFile(jpg);
  console.log('✓ og-image.svg → og-image.jpg (1200x630)');

  const apple = path.join(PUBLIC_DIR, 'apple-touch-icon.png');
  await sharp(path.join(PUBLIC_DIR, 'favicon.svg'), { density: 384 })
    .resize(180, 180)
    .png()
    .toFile(apple);
  console.log('✓ favicon.svg → apple-touch-icon.png (180x180)');
}

const entries = await readdir(PUBLIC_DIR);
for (const f of entries) await processRaster(f);
await generateOgImage();

console.log('Done.');
