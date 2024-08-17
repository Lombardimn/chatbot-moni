export const pillValidator = (pill: string[], bodyText: string) => {
  const flag = pill.some( p => bodyText.includes(p))

  return flag
}
