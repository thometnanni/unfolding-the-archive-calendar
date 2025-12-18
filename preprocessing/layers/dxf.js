import { importModule } from "./loadModule.js";
import { readFileSync } from "node:fs";
// import DxfParser from "dxf-parser";

export async function dxf(path) {
  const mod = await importModule("dxf-parser");
  if (!mod) return null;

  try {
    const DxfParser = mod.default;
    const file = readFileSync(path).toString("utf8");
    const parsed = new DxfParser().parseSync(file);

    const layers = parsed.tables?.layer?.layers ?? {};
    return Object.values(layers).map(({ name }) => name);
  } catch (err) {
    console.log(err);
  }
}
