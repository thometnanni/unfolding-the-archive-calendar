import { dwg } from "./dwg.js";
import { dxf } from "./dxf.js";
import { psd } from "./psd.js";

export async function parseLayers(file) {
  switch (file.match(/.([^.]+)$/)?.[1].toLowerCase()) {
    // case "dxf":
    //   return await dxf(file);
    // case "dwg":
    //   return await dwg(file);
    case "psd":
      return await psd(file);
    default:
      return null;
  }
}
