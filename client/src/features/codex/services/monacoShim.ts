// Lightweight browser/Vite shim for y-monaco peer dependency
export class Selection {
  public startLineNumber: number;
  public startColumn: number;
  public endLineNumber: number;
  public endColumn: number;
  public selectionStartLineNumber: number;
  public selectionStartColumn: number;
  public positionLineNumber: number;
  public positionColumn: number;

  constructor(
    selectionStartLineNumber: number,
    selectionStartColumn: number,
    positionLineNumber: number,
    positionColumn: number
  ) {
    this.startLineNumber = Math.min(selectionStartLineNumber, positionLineNumber);
    this.startColumn =
      selectionStartLineNumber === positionLineNumber
        ? Math.min(selectionStartColumn, positionColumn)
        : selectionStartLineNumber < positionLineNumber
        ? selectionStartColumn
        : positionColumn;
    this.endLineNumber = Math.max(selectionStartLineNumber, positionLineNumber);
    this.endColumn =
      selectionStartLineNumber === positionLineNumber
        ? Math.max(selectionStartColumn, positionColumn)
        : selectionStartLineNumber > positionLineNumber
        ? selectionStartColumn
        : positionColumn;
    this.selectionStartLineNumber = selectionStartLineNumber;
    this.selectionStartColumn = selectionStartColumn;
    this.positionLineNumber = positionLineNumber;
    this.positionColumn = positionColumn;
  }

  static createWithDirection(
    startLineNumber: number,
    startColumn: number,
    endLineNumber: number,
    endColumn: number,
    _direction?: any
  ) {
    return new Selection(startLineNumber, startColumn, endLineNumber, endColumn);
  }

  getDirection() {
    return 0;
  }

  isEmpty() {
    return (
      this.selectionStartLineNumber === this.positionLineNumber &&
      this.selectionStartColumn === this.positionColumn
    );
  }
}

export class Range {
  public startLineNumber: number;
  public startColumn: number;
  public endLineNumber: number;
  public endColumn: number;

  constructor(
    startLineNumber: number,
    startColumn: number,
    endLineNumber: number,
    endColumn: number
  ) {
    this.startLineNumber = startLineNumber;
    this.startColumn = startColumn;
    this.endLineNumber = endLineNumber;
    this.endColumn = endColumn;
  }
}

export class Position {
  public lineNumber: number;
  public column: number;

  constructor(lineNumber: number, column: number) {
    this.lineNumber = lineNumber;
    this.column = column;
  }
}

export const SelectionDirection = {
  LTR: 0,
  RTL: 1,
};

export const MarkerSeverity = {
  Hint: 1,
  Info: 2,
  Warning: 4,
  Error: 8,
};

export const KeyCode = {
  Enter: 3,
  Escape: 9,
  Space: 10,
  Tab: 2,
};

export const KeyMod = {
  CtrlCmd: 2048,
  Shift: 1024,
  Alt: 512,
  WinCtrl: 256,
};

export const editor = {
  defineTheme: () => {},
  setTheme: () => {},
  create: () => ({}),
  createModel: () => ({}),
  getModel: () => null,
  getModels: () => [],
};

export const languages = {
  register: () => {},
  setMonarchTokensProvider: () => {},
  registerCompletionItemProvider: () => ({ dispose: () => {} }),
  registerHoverProvider: () => ({ dispose: () => {} }),
};

export const Uri = {
  parse: (u: string) => ({ toString: () => u, path: u }),
  file: (f: string) => ({ toString: () => f, fsPath: f, path: f }),
};

export default {
  Selection,
  Range,
  Position,
  SelectionDirection,
  MarkerSeverity,
  KeyCode,
  KeyMod,
  editor,
  languages,
  Uri,
};
