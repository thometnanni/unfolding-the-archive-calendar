export function getArgValue(flag, requiredMessage = null) {
  const index = process.argv.indexOf(flag);
  if (index === -1) {
    if (requiredMessage != null) {
      console.error(`missing argument: ${flag}`);
      console.error(requiredMessage);
      process.exit(1);
    }
    return;
  }
  const value = process.argv[index + 1];
  if (value == null || /^-/.test(value)) return true;
  return value;
}

/**
 * Convert a file name to a safe, ASCII‑only version.
 *
 * - Normalises Unicode (so accented letters become their base letter)
 * - Removes any character that isn’t a‑z, 0‑9, dash, underscore or dot
 * - Collapses consecutive dashes/underscores
 * - Trims leading/trailing punctuation
 *
 * @param {string} name   Original file name (with or without extension)
 * @returns {string}      Sanitised file name
 */
export function sanitiseFileName(name) {
  // 1️⃣ Split the name from its extension (if any)
  const lastDot = name.lastIndexOf(".");
  const base = lastDot > 0 ? name.slice(0, lastDot) : name;
  const ext = lastDot > 0 ? name.slice(lastDot) : "";

  // 2️⃣ Normalise Unicode → decompose accents (é → é)
  //    Then drop the diacritic marks (the combining characters)
  const normalised = base.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // 3️⃣ Replace anything that isn’t a‑z, 0‑9, dash, underscore or space
  //    (space is kept temporarily so we can turn groups of spaces into a single dash)
  const cleaned = normalised
    .toLowerCase()
    .replace(/[^a-z0-9 _-]+/g, "") // drop unwanted symbols
    .trim();

  // 4️⃣ Collapse whitespace & underscores into a single dash
  const slug = cleaned
    .replace(/[\s_]+/g, "-") // spaces/underscores → dash
    .replace(/-+/g, "-"); // multiple dashes → single dash

  // 5️⃣ Re‑attach the original extension (lower‑cased, no leading spaces)
  return slug + ext.toLowerCase();
}
