import { importModule } from "./loadModule.js";
import { readFileSync } from "node:fs";
import { fork } from "node:child_process";
import path from "node:path";

export async function dwg(path) {
  const mod = await importModule(
    "../node_modules/@mlightcad/libdxfrw-web/dist/libdxfrw.js"
  );
  if (!mod) return null;

  try {
    const libdxfrw = await mod.default();
    const file = readFileSync(path);
    const database = new libdxfrw.DRW_Database();
    const fileHandler = new libdxfrw.DRW_FileHandler();
    fileHandler.database = database;
    const dwg = new libdxfrw.DRW_DwgR(file);
    dwg.read(fileHandler, false);
    dwg.delete();

    return namesFromList(database.layers);
  } catch (err) {
    console.log(err);
  }
}

function namesFromList(list) {
  const array = [];
  for (let i = 0; i < list.size(); ++i) {
    let item = list.get(i);

    array.push(item.name);
  }
  return array;
}
