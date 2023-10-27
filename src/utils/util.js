export const deepClone = function(origin) {
  if (origin === undefined) {
    return undefined
  }

  return JSON.parse(JSON.stringify(origin))
}
