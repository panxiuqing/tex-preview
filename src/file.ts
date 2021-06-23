import { readFileSync, statSync } from 'fs';

const fileCache: Record<string, { mtime: number; content: string }> = {};

export function getFileText(path: string) {
  const mtime = statSync(path).mtime;
  const cache = fileCache[path];
  if (cache && cache.mtime === mtime.getTime()) {
    return cache.content;
  } else {
    const content = readFileSync(path, 'utf-8');
    fileCache[path] = {
      mtime: mtime.getTime(),
      content,
    };
    return content;
  }
}
