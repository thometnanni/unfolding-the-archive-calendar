import { importModule } from "./loadModule.js";
import { readFileSync } from "node:fs";
// import DxfParser from "dxf-parser";

export async function psd(path) {
  const mod = await importModule("ag-psd");

  if (!mod) return null;
  try {
    const readPsd = mod.readPsd;

    const buffer = readFileSync(path);

    const psd = readPsd(buffer, {
      skipLayerImageData: true,
      skipCompositeImageData: true,
      skipThumbnail: true,
    });

    return psd.children?.map(({ name }) => name);
  } catch (err) {
    console.log(err);
  }
}
