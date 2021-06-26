import * as path from 'path';
import { TextDocument } from 'vscode';
import { getFileText } from './file';
import { getFirstLine } from './utils';

const ROOT_FILE_REGEXP = /^%\s!TEX\sroot\s=\s(.+)\n/;

export function parseRootFile(lineText: string) {
  return lineText.match(ROOT_FILE_REGEXP)?.[1];
}

export function getRootFileText(document: TextDocument) {
  const firstLine = getFirstLine(document);
  const rootFilePath = parseRootFile(firstLine);
  if (!rootFilePath) {
    return document.getText();
  }
  return getFileText(path.join(process.cwd(), rootFilePath));
}
