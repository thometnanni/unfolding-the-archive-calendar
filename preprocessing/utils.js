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
