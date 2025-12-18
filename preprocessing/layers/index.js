import { dwg } from "./dwg.js";
import { dxf } from "./dxf.js";

export async function parseLayers(file) {
  switch (file.match(/.([^.]+)$/)?.[1].toLowerCase()) {
    case "dxf":
      return await dxf(file);
    case "dwg":
      return await dwg(file);
    default:
      return null;
  }
}
