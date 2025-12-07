import sharp from "sharp";
import fs from "fs";
import path from "path";

const heroImages = [
  "src/assets/hero-1.webp",
  "src/assets/hero-2.webp",
  "src/assets/hero-3.webp",
  "src/assets/hero-4.webp",
];

async function compressHeroImage(imagePath, targetSizeKB = 150) {
  try {
    const basename = path.basename(imagePath, '.webp');
    const tempPath = `src/assets/${basename}-compressed.webp`;
    const targetSizeBytes = targetSizeKB * 1024;

    // Start with high quality and reduce until under target size
    let quality = 80;
    let compressedSize = Infinity;

    while (compressedSize > targetSizeBytes && quality > 10) {
      await sharp(imagePath)
        .webp({ quality, effort: 6 })
        .toFile(tempPath);

      compressedSize = fs.statSync(tempPath).size;
      console.log(`${basename}: Quality ${quality} → ${(compressedSize / 1024).toFixed(2)} KB`);

      if (compressedSize > targetSizeBytes) {
        quality -= 5;
      }
    }

    // Replace original with compressed version
    fs.renameSync(tempPath, imagePath);

    const finalSize = fs.statSync(imagePath).size;
    const originalSize = fs.statSync(imagePath.replace('-compressed', '')).size;
    const savings = ((1 - finalSize / originalSize) * 100).toFixed(2);

    console.log(`✅ ${basename}.webp: ${(finalSize / 1024).toFixed(2)} KB (${savings}% savings)`);

    return {
      path: imagePath,
      originalSize,
      finalSize,
      savings,
    };
  } catch (error) {
    console.error(`❌ Error compressing ${imagePath}:`, error.message);
    return null;
  }
}

async function main() {
  console.log("🗜️  Compressing hero images below 150KB...\n");

  const results = [];

  for (const imagePath of heroImages) {
    if (!fs.existsSync(imagePath)) {
      console.log(`⚠️  ${imagePath} not found, skipping...`);
      continue;
    }

    const result = await compressHeroImage(imagePath);
    if (result) {
      results.push(result);
    }
  }

  console.log("\n🎉 Compression complete!");
  console.log("\nFinal sizes:");
  results.forEach(result => {
    console.log(`${path.basename(result.path)}: ${(result.finalSize / 1024).toFixed(2)} KB`);
  });
}

main().catch(console.error);
