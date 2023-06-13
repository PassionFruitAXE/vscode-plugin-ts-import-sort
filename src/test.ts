import * as ts from "typescript";
import {
  externalModuleRegExp,
  styleModuleRegExp,
  localModuleRegExp,
} from "./moduleRegExp";

import {
  thirdPartyModuleImportCompareFn,
  localModuleImportCompareFn,
  styleModuleImportCompareFn,
  otherModuleImportCompareFn,
} from "./sortCompareFn";

const sourceCode = `
import chalk from "chalk";
import GitModule from "./gitModule.js";
import ReadmeModule from "./readmeModule.js";
import { createBuilder } from "./builder.js";
import { createFileModule, FileModule } from "./fileModule.js";
import { createTSModule, TSModule } from "./tsModule.js";
import { Package } from "./packages/package.js";
import { TConfig } from "../types/index.js";
import fs from "fs";
import { useCommand } from "../utils/command.js";
import "index.css"
import {
  createPackageJsonModule,
  PackageJsonModule,
} from "./packageJsonModule.js";
`;

export function sortImports(sourceCode: string) {
  let startPos = 0,
    endPos = 0;
  const sourceFile = ts.createSourceFile(
    "example.ts",
    sourceCode,
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
  console.log(newValue);
}

sortImports(sourceCode);
