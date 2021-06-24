const XELATEX_REGEXP = /\\usepackage\{xeCJK\}/;

export function autoChooseEngine(rootFileText: string) {
  if (XELATEX_REGEXP.test(rootFileText)) {
    return 'xelatex';
  }
  return 'pdflatex';
}

const DOCUMENT_SCAFFOLD_REGEXP =
  /^([\s\S]*\\begin\{document\}\n)[\s\S]*(\\end\{document\}\n)/;

class Scaffold {
  constructor(private begin: string, private end: string) {}

  build(content: string): string {
    return `${this.begin}\n${content}\n${this.end}`;
  }
}

export function parseScaffold(text: string) {
  const matches = text.match(DOCUMENT_SCAFFOLD_REGEXP);
  return new Scaffold(matches?.[1] as string, matches?.[2] as string);
}
