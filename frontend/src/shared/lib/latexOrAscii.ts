export function latexOrAscii(input: string) {
  const latexRegex = /\$.*?\$|\\[a-zA-Z]+/;
  const asciiMathRegex = /`.*?`|\s*([a-zA-Z]+|[0-9]+|[+\-*/=()^]|[{}])\s*/;
  return latexRegex.test(input)
    ? "latex"
    : asciiMathRegex.test(input)
    ? "ascii"
    : undefined;
}
