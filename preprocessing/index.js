import { read, readdirSync, promises, existsSync, mkdirSync } from "node:fs";
import { join, normalize } from "node:path";
import { ignore_files, file_types } from "./config.js";
import { getArgValue, sanitiseFileName } from "./utils.js";
import { statSync } from "node:fs";
import { parseLayers } from "./layers/index.js";

const options = {
  inputDir: getArgValue("-i", "Please specify an input directory"),
  outputDir: getArgValue("-o") ?? "../prototype/static/projects",
  batch: getArgValue("--batch"),
  layers: getArgValue("--layers"),
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

async function getFiles(dir) {
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
        path,
        fileSize: statSync(path).size,
        birthtime,
        type: file_types[ext],
        hour: date.getHours(),
        date: formatDate(date),
      };
    })
    .sort((a, b) => a.birthtime - b.birthtime)
    .map(async (file) => {
      const layers = options.layers && (await parseLayers(file.path));
      return {
        ...file,
        path: normalize(file.path.replace(dir, ".")),
        ...(layers && layers.length && { layers }),
      };
    });

  return Promise.all(files);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0‑based
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function preprocess() {
  const directories = await Promise.all(
    normalizeInputDir(options.inputDir, options.batch).map(
      async ({ name, path }) => {
        const files = await getFiles(path);
        return { name, files };
      }
    )
  );

  if (!existsSync(options.outputDir)) {
    mkdirSync(options.outputDir, { recursive: true });
  }

  await Promise.all(
    directories.map((dir) =>
      promises.writeFile(
        join(options.outputDir, `${sanitiseFileName(dir.name)}.json`),
        JSON.stringify(dir)
      )
    )
  );

  await promises.writeFile(
    join(options.outputDir, `directories.json`),
    JSON.stringify(
      directories.map((dir) => ({
        name: dir.name,
        file: `${sanitiseFileName(dir.name)}`,
      }))
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
