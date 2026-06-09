import sharp from 'sharp';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';


const folder = './public';// ← change si tes images sont ailleurs

if (!existsSync(folder)) {
  console.error('❌ Dossier introuvable :', folder);
  process.exit(1);
}

const files = readdirSync(folder);
for (const file of files) {
  if (file.match(/\.(jpg|jpeg|png)$/i)) {
    const input = join(folder, file);
    const output = join(folder, file.replace(/\.[^.]+$/, '.webp'));
    await sharp(input)
      .resize({ width: 600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(output);
    console.log(`✅ ${file} → ${file.replace(/\.[^.]+$/, '.webp')}`);
  }
}
console.log('🎉 Conversion terminée !');