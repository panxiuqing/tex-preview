import { Range, TextDocument } from 'vscode';

export function getFirstLine(document: TextDocument) {
  return getLine(document, 0);
}

export function getLine(document: TextDocument, line: number) {
  return document.getText(new Range(line, 0, line + 1, 0));
}
