import { Range, TextDocument } from 'vscode';

const subparagraph = /\\subparagraph\{.*\}/;
const paragraph = /\\paragraph\{.*\}/;
const subsubsection = /\\subsubsection\{.*\}/;
const subsection = /\\subsection\{.*\}/;
const section = /\\section\{.*\}/;
const chapter = /\\chapter\{.*\}/;
const part = /\\part\{.*\}/;

const article = [subparagraph, paragraph, subsubsection, subsection, section];

const report = [...article, chapter];

const book = [...article, part];

const documentTypes = {
  article,
  report,
  book,
};

const ENV_REGEXP = /\\begin\{(.+)\}/;

/**
 * Get minimal complete block contains changed area
 * @param document
 * @param startLine
 * @param endLine
 * @param firstBlockStartLine
 * @returns
 */
export function getMinimalBlock(
  document: TextDocument,
  startLine: number,
  endLine: number,
  firstBlockStartLine: number = 0
) {
  let firstBlockStarted = false;
  let firstBlockEnded = false;
  let lastBlockStarted = false;
  let env = '';
  for (let line = 0; line < document.lineCount; line++) {
    if (!firstBlockStarted) {
      if (line > endLine) {
        return document.getText(new Range(startLine, 0, endLine + 1, 0));
      }

      const lineText = document.lineAt(line).text;
      if (lineText.startsWith('\\begin')) {
        firstBlockStarted = true;
        firstBlockStartLine = Math.min(line, startLine);
        env = lineText.match(ENV_REGEXP)?.[1] as string;
        continue;
      }
    } else if (!firstBlockEnded) {
      if (document.lineAt(line).text.startsWith(`\\end{${env}}`)) {
        if (line < startLine) {
          firstBlockStarted = false;
        } else if (line >= endLine) {
          return document.getText(
            new Range(firstBlockStartLine, 0, line + 1, 0)
          );
        } else {
          firstBlockEnded = true;
        }
      }
    } else if (!lastBlockStarted) {
      if (line > endLine) {
        return document.getText(new Range(firstBlockStartLine, 0, line, 0));
      }

      const lineText = document.lineAt(line).text;
      if (lineText.startsWith('\\begin')) {
        lastBlockStarted = true;
        env = lineText.match(ENV_REGEXP)?.[1] as string;
        continue;
      }
    } else {
      if (document.lineAt(line).text.startsWith(`\\end{${env}}`)) {
        if (line >= endLine) {
          return document.getText(
            new Range(firstBlockStartLine, 0, line + 1, 0)
          );
        } else {
          lastBlockStarted = false;
        }
      }
    }
  }

  return '';
}
