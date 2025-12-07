import sharp from "sharp";
import fs from "fs";
import path from "path";

const largeImages = [
  "src/assets/ace-2.png",
  "src/assets/ace-3.png",
  "src/assets/ace-4.png",
  "src/assets/ace-pro-ev-inner-banner.jpg",
  "src/assets/contact_page.png",
  "src/assets/hero-1.jpg",
  "src/assets/hero-2.jpg",
  "src/assets/hero-3.jpg",
  "src/assets/hero-4.jpg",
  "src/assets/image(1).png",
  "src/assets/image(2).png",
  "src/assets/image(4).png",
  "src/assets/image.png",
  "src/assets/service-page-banner.png",
];

async function getImageInfo(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      size: fs.statSync(imagePath).size,
    };
  } catch (error) {
    console.error(`Error reading ${imagePath}:`, error.message);
    return null;
  }
}

async function convertToWebP(imagePath) {
  try {
    const ext = path.extname(imagePath);
    const webpPath = imagePath.replace(ext, ".webp");

    await sharp(imagePath).webp({ quality: 85 }).toFile(webpPath);

    const originalSize = fs.statSync(imagePath).size;
    const webpSize = fs.statSync(webpPath).size;
    const savings = ((1 - webpSize / originalSize) * 100).toFixed(2);

    return {
      webpPath,
      originalSize,
      webpSize,
      savings,
    };
  } catch (error) {
    console.error(`Error converting ${imagePath}:`, error.message);
    return null;
  }
}

async function main() {
  console.log("Getting image dimensions and converting to WebP...\n");

  const results = [];

  for (const imagePath of largeImages) {
    if (!fs.existsSync(imagePath)) {
      console.log(`⚠️  ${imagePath} not found, skipping...`);
      continue;
    }

    const info = await getImageInfo(imagePath);
    if (!info) continue;

    console.log(
      `📐 ${path.basename(imagePath)}: ${info.width}x${info.height} (${(
        info.size / 1024
      ).toFixed(2)} KB)`
    );

    const conversion = await convertToWebP(imagePath);
    if (conversion) {
      console.log(
        `✅ Converted to ${path.basename(conversion.webpPath)}: ${(
          conversion.webpSize / 1024
        ).toFixed(2)} KB (${conversion.savings}% smaller)\n`
      );
      results.push({
        original: imagePath,
        webp: conversion.webpPath,
        width: info.width,
        height: info.height,
      });
    }
  }

  // Write results to JSON file for reference
  fs.writeFileSync("image-conversions.json", JSON.stringify(results, null, 2));
  console.log(
    "✅ Conversion complete! Results saved to image-conversions.json"
  );
}

main().catch(console.error);
