import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Low, JSONFile } from 'lowdb';
import { readFileSync } from 'node:fs';
import { Data } from 'types/model';

let db: Low<Data>;

function initDb() {
  if (!db) {
    // File path
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const file = join(__dirname, `db.json`);

    let data = {
      categories: [],
      images: [],
      ingredients: [],
      receipes: [],
      receipeIngredients: [],
      units: [],
    };
    try {
      const rawdata = readFileSync(file);
      data = JSON.parse(rawdata.toString());
    } catch (error) {
      console.warn(`Create new db file.`);
    }

    // Configure lowdb to write to JSONFile
    const adapter = new JSONFile<Data>(file);
    db = new Low(adapter);
    // If db.json doesn't exist, db.data will be null
    // Use the code below to set default data
    db.data = data;
  }
}

// async function readData(query) {
//   // Read data from JSON file, this will set db.data content
//   await db.read();
// }

// async function writeData(content) {
//   const { posts } = db.data;
//   posts.push(content);

//   await db.write();
// }

export { initDb, db };
