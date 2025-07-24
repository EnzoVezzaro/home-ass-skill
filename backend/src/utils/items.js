const path = require('path');
const fs = require('fs');
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Utility to read data (intentionally sync to highlight blocking issue)
async function readData() {
  console.log('this: ', DATA_PATH);
  const raw = await fs.promises.readFile(DATA_PATH, 'utf-8');
  console.log('raw: ', raw);
  return JSON.parse(raw);
}

// Utility to write data asynchronously
async function writeData(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { readData, writeData };