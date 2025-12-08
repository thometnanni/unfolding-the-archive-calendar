import { read, readdirSync, promises, existsSync, mkdirSync } from "node:fs";
import { join, normalize } from "node:path";
import { ignore_files, file_types } from "./config.js";
import { getArgValue } from "./utils.js";
import { statSync } from "node:fs";

const options = {
  inputDir: getArgValue("-i", "Please specify an input directory"),
  outputDir: getArgValue("-o") ?? "../prototype/static/projects",
  batch: getArgValue("--batch"),
};

function getDirectories(path) {
  const entries = readdirSync(path, {
    withFileTypes: true,
  })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({
      name: entry.name,
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
      const birthtime = statSync(path).birthtimeMs;

      const date = new Date(birthtime);
      return {
        name,
        path: normalize(path.replace(dir, ".")),
        fileSize: statSync(path).size,
        birthtime,
        type: file_types[ext],
        hour: date.getHours(),
        date: date.toISOString().replace(/T.*/, ""),
      };
    })
    .sort((a, b) => a.birthtime - b.birthtime);

  return files;
}

async function preprocess() {
  const directories = normalizeInputDir(options.inputDir, options.batch).map(
    ({ name, path }) => {
      const files = getFiles(path);
      return { name, files };
    }
  );

  if (!existsSync(options.outputDir)) {
    mkdirSync(options.outputDir, { recursive: true });
  }

  await Promise.all(
    directories.map((dir) =>
      promises.writeFile(
        join(options.outputDir, `${dir.name}.json`),
        JSON.stringify(dir)
      )
    )
  );
  console.log(`preprocessing completed`);
  console.log(
    `exported ${
      options.batch
        ? `${directories.length} files`
        : `${directories[0].name}.json`
    }`
  );
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
