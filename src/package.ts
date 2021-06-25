import { TextDocument } from 'vscode';

export interface Package {
  /**
   * Detect if under package control.
   * @param text
   */
  detect(text: string): boolean;

  extract(document: TextDocument): string;
}
