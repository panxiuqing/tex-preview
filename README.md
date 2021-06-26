# tex-preview README

<img src="./logo.png" width="200px">

Tex file partially live preview.

## How to use

`Command+Shift+P` and choose `Tex Preview`. When `.live_dir/temp.pdf` generated, preview it.

## Features

Partially live preview help you see recently input in milliseconds.

### How it works

- When save file, split changes block to file `.live_dir/temp.tex`.
- Compile `live.[FILENAME].tex` to a pdf file named `.live_dir/temp.pdf`.

## Requirements

Only tested on macOS

- Install MacTex
- Install a pdf preview extension like _vscode-pdf_.

## Extension Settings

no

## Known Issues

## Release Notes

### 0.0.3

Features

- Support `\input`
- Support `\begin{env}` `\end{env}` block

Break changes

- Currently only support `\input` file preview

### 0.0.2

Add Logo

### 0.0.1

Initial release
