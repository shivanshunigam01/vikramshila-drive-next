import sharp from 'sharp';
import fs from 'fs';

const images = [
  'src/assets/image(3).png',
  'src/assets/fleet-care_new_banner.jpg',
  'src/assets/vehicle.png',
  'src/assets/acepro.png',
  'src/assets/cat-scv.jpg',
  'src/assets/cat-pickup.jpg',
  'src/assets/cat-lcv.jpg',
  'src/assets/cat-icv.jpg',
  'src/assets/cat-mcv.jpg',
  'src/assets/cat-winger.jpg',
  'src/assets/cat-bus.jpg'
];

async function main() {
  const results = [];
  for (const img of images) {
    if (fs.existsSync(img)) {
      try {
        const meta = await sharp(img).metadata();
        results.push({ path: img, width: meta.width, height: meta.height });
      } catch (e) {
        console.error(`Error reading ${img}:`, e.message);
      }
    }
  }
  console.log(JSON.stringify(results, null, 2));
}

main();

