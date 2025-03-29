import {
  JSONFile, Low,
} from "lowdb";
import { readFileSync } from "node:fs";
import {
  dirname, join,
} from "node:path";
import { fileURLToPath } from "node:url";
import { Data } from "types/model";

let db: Low<Data>;

function initDb(): void {
  if (!db) {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const file = join(__dirname, "db.json");

    let data = {
      categories: [],
      images: [],
      ingredients: [],
      recipes: [],
      recipeIngredients: [],
      units: [],
    };
    try {
      const rawdata = readFileSync(file);
      data = JSON.parse(rawdata.toString());
    } catch (error) {
      console.warn("Create new db file.");
    }

    // Configure lowdb to write to JSONFile
    const adapter = new JSONFile<Data>(file);
    db = new Low(adapter);
    // If db.json doesn't exist, db.data will be null
    // Use the code below to set default data
    db.data = data;
  }
}

export { db, initDb };
