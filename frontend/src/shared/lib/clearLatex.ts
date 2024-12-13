export function clearLatex(latexString: string) {
  if (latexString.startsWith("$$") && latexString.endsWith("$$")) {
    return latexString
      .slice(2, -2)
      .trim()
      .replace(/\\{2,}/g, "\\");
  }
  if (latexString.startsWith("$") && latexString.endsWith("$")) {
    return latexString
      .slice(1, -1)
      .trim()
      .replace(/\\{2,}/g, "\\");
  }
  if (latexString.startsWith("\\[") && latexString.endsWith("\\]")) {
    return latexString
      .slice(2, -2)
      .trim()
      .replace(/\\{2,}/g, "\\");
  }
  return latexString.replace(/\\{2,}/g, "\\");
}
