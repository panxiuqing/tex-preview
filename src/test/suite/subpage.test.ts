import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { parseRootFile } from '../../subpage';
// import * as myExtension from '../../extension';

suite('SubPage Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('root file parse test', () => {
    assert.strictEqual(
      parseRootFile('% !TEX root = ../main.tex\n'),
      '../main.tex'
    );
  });
});
