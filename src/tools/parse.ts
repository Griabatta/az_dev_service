
// todo: Вся логика по гугл табличкам должны быть внутри googleSHeetsService

export function extractSheetId(url: string): string | null {
  const regex = /\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
  