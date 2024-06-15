const fs = require('fs');
const path = require('path');

function storeData(data) {
  const dataPath = path.resolve(__dirname, '../../data/bali_final.json');
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

module.exports = storeData;
