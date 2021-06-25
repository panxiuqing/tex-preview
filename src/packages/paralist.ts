import { TextDocument } from 'vscode';
import { Package } from '../package';

export default class implements Package {
  detect(text: string) {
    return false;
  }

  extract(document: TextDocument) {
    return '';
  }
}
