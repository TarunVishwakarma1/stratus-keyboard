
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

async function convertImages() {
  console.log('Starting image conversion...');
  
  // Find all jpg/jpeg files in public folder
  // Using recursive glob to find everything
  const files = await glob('public/**/*.+(jpg|jpeg)', { ignore: 'node_modules/**' });
  
  console.log(`Found ${files.length} images to convert.`);
  
  if (files.length === 0) {
    console.log('No images found.');
    return;
  }

  let convertedCount = 0;
  let errors = 0;

  for (const file of files) {
    try {
      const dir = path.dirname(file);
      const ext = path.extname(file);
      const name = path.basename(file, ext);
      const newFile = path.join(dir, `${name}.webp`);

      console.log(`Converting: ${file} -> ${newFile}`);

      await sharp(file)
        .webp({ quality: 80 })
        .toFile(newFile);

      // Verify the new file exists before deleting
      if (fs.existsSync(newFile)) {
          // Delete the original file
          fs.unlinkSync(file);
          console.log(`Deleted original: ${file}`);
      } else {
          console.error(`Failed to verify new file for ${file}, skipping deletion.`);
          errors++;
          continue;
      }
      
      convertedCount++;
    } catch (err) {
      console.error(`Error converting ${file}:`, err);
      errors++;
    }
  }

  console.log('-----------------------------------');
  console.log(`Conversion complete.`);
  console.log(`Converted: ${convertedCount}`);
  console.log(`Errors: ${errors}`);
}

convertImages().catch(err => console.error(err));
