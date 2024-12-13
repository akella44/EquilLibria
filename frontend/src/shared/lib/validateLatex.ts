export function validateLatex(latexString: string) {
  // Проверка на наличие открывающих и закрывающих фигурных скобок
  const openBraces = (latexString.match(/{/g) || []).length;
  const closeBraces = (latexString.match(/}/g) || []).length;

  if (openBraces !== closeBraces) {
    return false; // Неверное количество фигурных скобок
  }

  // Простейшая проверка на наличие команд
  const latexCommandsPattern = /\\[a-zA-Z]+/g;
  const commands = latexString.match(latexCommandsPattern);

  if (commands) {
    // Здесь можно добавить дополнительные проверки для команд
    // Например, проверка на наличие команд, которые не существуют
  }

  return true; // Валидация пройдена
}
