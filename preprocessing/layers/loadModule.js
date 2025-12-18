export async function importModule(name) {
  try {
    // `import()` is evaluated at runtime, so a missing package throws.
    const mod = await import(name);
    return mod; // the module’s default export or named exports
  } catch (err) {
    // If the error is “MODULE_NOT_FOUND”, the optional dep isn’t installed.
    // Any other error (syntax error, runtime error inside the module) should be re‑thrown.
    if (
      err.code === "ERR_MODULE_NOT_FOUND" ||
      err.message.includes("Cannot find module")
    ) {
      return null; // feature is simply unavailable
    }
    throw err; // unexpected problem – let it surface
  }
}
