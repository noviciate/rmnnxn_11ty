const fs = require('fs');
const path = require('path');

// Category files to process
const categories = ['flowers', 'water', 'rural', 'village', 'urban', 'trails'];

const allPhotos = [];

categories.forEach(category => {
  const filepath = `./${category}.md`;
  
  if (!fs.existsSync(filepath)) {
    console.log(`Skipping ${filepath} - not found`);
    return;
  }

  const content = fs.readFileSync(filepath, 'utf8');
  
  // Extract front matter between --- markers
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontMatterMatch) {
    console.log(`No front matter found in ${filepath}`);
    return;
  }

  // Extract galleries block
  const galleriesMatch = frontMatterMatch[1].match(/galleries:([\s\S]*?)(?=\n\w|$)/);
  if (!galleriesMatch) {
    console.log(`No galleries found in ${filepath}`);
    return;
  }

  // Parse each item
  const itemRegex = /- filename: (.+)\n\s+title: (.+)/g;
  let match;
  while ((match = itemRegex.exec(galleriesMatch[1])) !== null) {
    allPhotos.push({
      filename: match[1].trim(),
      title: match[2].trim(),
      category: category
    });
  }

  console.log(`Processed ${category}`);
});

// Write output
const outputDir = './_data';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

fs.writeFileSync(
  path.join(outputDir, 'photos.json'),
  JSON.stringify(allPhotos, null, 2)
);

console.log(`\nDone. ${allPhotos.length} photos written to _data/photos.json`);
