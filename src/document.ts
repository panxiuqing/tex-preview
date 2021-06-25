import { TextDocument } from 'vscode';

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

export function getMinimalBlock(
  document: TextDocument,
  startLine: number,
  endLine: number,
  type: 'article'
) {
  const documentType = documentTypes[type];
  const stack = [];
  while (true) {
    if (document.lineAt(startLine).text.startsWith('\\begin')) {
      stack.push(startLine);
    }
  }
}
