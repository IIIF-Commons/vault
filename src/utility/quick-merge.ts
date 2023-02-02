export function quickMerge(a: any, b: any) {
  const newResource: any = {};
  const added: string[] = [];
  for (const [key, value] of Object.entries(a || {})) {
    added.push(key);
    const bValue = (b || {})[key];
    if (!bValue || bValue.length === 0) {
      newResource[key] = value;
      continue;
    }
    newResource[key] = bValue;
  }
  for (const [key, value] of Object.entries(b || {})) {
    if (added.indexOf(key) !== -1) {
      continue;
    }
    // merge.
    newResource[key] = value;
  }

  return newResource;
}
