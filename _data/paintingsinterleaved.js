module.exports = function() {
  // Clear require cache to ensure fresh data on each build
  delete require.cache[require.resolve('./paintings.json')];
  const paintings = require('./paintings.json');
  
  const groups = {};
  paintings.forEach(painting => {
    if (!groups[painting.category]) groups[painting.category] = [];
    groups[painting.category].push(painting);
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
