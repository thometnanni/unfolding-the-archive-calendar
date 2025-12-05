import { read, readdirSync, writeFileSync } from "node:fs";
import { join, normalize } from "node:path";
import { ignore_files, file_types } from "./config.js";
import { getArgValue } from "./utils.js";
import { statSync } from "node:fs";

const options = {
  inputDir: getArgValue("-i", "Please specify an input directory"),
  outputDir: getArgValue("-o") ?? "./output",
  batch: getArgValue("--batch"),
};

function getDirectories(path) {
  const entries = readdirSync(path, {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
      parent: entry.parentPath,
      path: join(entry.parentPath, entry.name),
    }));

  return entries;
}

function getFiles(dir) {
  const files = readdirSync(dir, {
    withFileTypes: true,
    recursive: true,
  })
    .filter(
      (entry) =>
        entry.isFile() &&
        !ignore_files.includes(entry.name) &&
        !/^\./.test(entry.name)
    )
    .map(({ name, parentPath }) => {
      const path = join(parentPath, name);

      const ext = name.match(/.([^.]+)$/)?.[1].toLowerCase();

      return {
        name,
        path: normalize(path.replace(dir, ".")),
        fileSize: statSync(path).size,
        birthtime: statSync(path).birthtimeMs,
        type: file_types[ext],
      };
    });

  return files;
}

function preprocess() {
  const directories = normalizeInputDir(options.inputDir, options.batch).map(
    (dir) => {
      const files = getFiles(dir.path);
      return { dir, files };
    }
  );

  console.log(directories[0]);
}

function normalizeInputDir(path, batch = false) {
  if (batch) return getDirectories(path);
  return [
    {
      name: path.replace(/\/$/, "").replace(/^.*\//, ""),
      path,
    },
  ];
}

preprocess();
