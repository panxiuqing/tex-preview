// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import { spawn } from 'child_process';
import * as fs from 'fs';
import { autoChooseEngine, parseScaffold } from './root';
import { getRootFileText } from './subpage';
import { getMinimalBlock } from './document';

function isTex(document: vscode.TextDocument) {
  const extname = path.extname(document.fileName);
  return (
    document.languageId === 'tex' || extname === '.ltx' || extname === '.tex'
  );
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "tex-preview" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('tex-preview.active', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage('Tex Preview Active!');
  });

  context.subscriptions.push(disposable);

  let busy = false;
  let start = new vscode.Position(Infinity, Infinity);
  let end = new vscode.Position(0, 0);

  function updateContentChangesRange(
    contentChanges: readonly vscode.TextDocumentContentChangeEvent[]
  ) {
    for (const event of contentChanges) {
      if (event.range.start.isBefore(start)) {
        start = event.range.start;
      }
      if (event.range.end.isAfter(end)) {
        end = event.range.end;
      }
    }
  }

  function findHeader(document: vscode.TextDocument) {
    let line = 0;
    while (
      document.getText(new vscode.Range(line, 0, line + 1, 0)) !==
      '\\begin{document}\n'
    ) {
      line += 1;
    }
    const header = document.getText(new vscode.Range(0, 0, line + 1, 0));
    return header;
  }

  function findChangedBlockText(
    document: vscode.TextDocument,
    startLine: number,
    endLine: number
  ) {
    while (startLine !== 0) {
      if (document.lineAt(startLine).isEmptyOrWhitespace) {
        break;
      }
      startLine -= 1;
    }
    while (endLine !== Infinity) {
      if (document.lineAt(endLine).isEmptyOrWhitespace) {
        break;
      }
      endLine += 1;
    }
    return document.getText(new vscode.Range(startLine, 0, endLine, 0));
  }

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(async (event) => {
      updateContentChangesRange(event.contentChanges);

      if (isTex(event.document)) {
        if (busy || event.document.isDirty) {
          return;
        }
        busy = true;

        process.chdir(path.dirname(event.document.fileName));

        // const header = findHeader(event.document);
        // const changedBlock = findChangedBlockText(
        //   event.document,
        //   start.line,
        //   end.line
        // );

        // const liveText = `${header}\n${changedBlock}\n\\end{document}\n`;

        const scaffold = parseScaffold(getRootFileText(event.document));
        const liveText = scaffold.build(
          getMinimalBlock(event.document, start.line, end.line)
        );

        console.log('liveBlock: ', liveText);
        const engine = autoChooseEngine(liveText);

        start = new vscode.Position(Infinity, Infinity);
        end = new vscode.Position(0, 0);

        const basename = `live.${path.basename(event.document.fileName)}`;
        fs.writeFileSync(basename, liveText);

        const ps = spawn(engine, [basename]);

        ps.stdout.on('data', (data) => {
          console.log(`${data}`);
        });
        ps.stderr.on('data', (data) => {
          console.log(`stderr: ${data}`);
        });
        ps.on('close', (code) => {
          busy = false;
          console.log(`child process exited with code ${code}`);
        });
      }
      //   vscode.window.showInformationMessage(event.document.getText());
    })
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
