export function isKeyMissed(data: any, keys: string[]): boolean {
  for (let key of keys) {
    if (data[key] === undefined) return true
  }
  return false
}
