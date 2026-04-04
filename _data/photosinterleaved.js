module.exports = function() {
  // Clear require cache to ensure fresh data on each build
  delete require.cache[require.resolve('./photos.json')];
  const photos = require('./photos.json');
  
  const groups = {};
  photos.forEach(photo => {
    if (!groups[photo.category]) groups[photo.category] = [];
    groups[photo.category].push(photo);
  });

  const result = [];
  const maxLength = Math.max(...Object.values(groups).map(g => g.length));
  for (let i = 0; i < maxLength; i++) {
    Object.values(groups).forEach(group => {
      if (group[i]) result.push(group[i]);
    });
  }
  return result;
};
