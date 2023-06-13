import * as ts from "typescript";
import * as vscode from "vscode";
import { mergeSection } from "./mergeSection";
import {
  styleModuleRegExp,
  externalModuleRegExp,
  localModuleRegExp,
} from "./moduleRegExp";
import {
  thirdPartyModuleImportCompareFn,
  localModuleImportCompareFn,
  styleModuleImportCompareFn,
  otherModuleImportCompareFn,
} from "./sortCompareFn";

class SortedImports {
  constructor(
    public range: vscode.Position | vscode.Range | vscode.Selection,
    public newValue: string
  ) {}
}

export function sortImports(document: vscode.TextDocument): SortedImports {
  const posArr: [number, number][] = [];
  const sourceFile = ts.createSourceFile(
    "example.ts",
    document.getText(),
    ts.ScriptTarget.Latest
  );
  // 样式资源导入
  const styleModuleImport: ts.ImportDeclaration[] = [];
  // 第三方导入
  const externalModuleImport: ts.ImportDeclaration[] = [];
  // 本地模块导入
  const localModuleImport: ts.ImportDeclaration[] = [];
  // 其他资源导入
  const otherModuleImport: ts.ImportDeclaration[] = [];
  ts.forEachChild(sourceFile, node => {
    if (ts.isImportDeclaration(node)) {
      posArr.push([node.pos, node.end]);
      const filename = node.moduleSpecifier.getText(sourceFile);
      if (styleModuleRegExp.test(filename)) {
        styleModuleImport.push(node);
      } else if (externalModuleRegExp.test(filename)) {
        externalModuleImport.push(node);
      } else if (localModuleRegExp.test(filename)) {
        localModuleImport.push(node);
      } else {
        otherModuleImport.push(node);
      }
    }
  });
  const newValue = [
    externalModuleImport.sort((a, b) =>
      thirdPartyModuleImportCompareFn(a, b, sourceFile)
    ),
    localModuleImport.sort((a, b) =>
      localModuleImportCompareFn(a, b, sourceFile)
    ),
    styleModuleImport.sort((a, b) =>
      styleModuleImportCompareFn(a, b, sourceFile)
    ),
    otherModuleImport.sort((a, b) =>
      otherModuleImportCompareFn(a, b, sourceFile)
    ),
  ]
    .filter(item => item.length)
    .map(arr => arr.map(item => item.getText(sourceFile)).join("\n"))
    .join("\n\n");

  const [startPos, endPos] = mergeSection(posArr);
  return new SortedImports(
    new vscode.Range(
      document.positionAt(startPos),
      document.positionAt(endPos)
    ),
    newValue
  );
}
