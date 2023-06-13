import * as ts from "typescript";

export const thirdPartyModuleImportCompareFn = (
  a: ts.ImportDeclaration,
  b: ts.ImportDeclaration,
  sourceFile: ts.SourceFile
): number => {
  return a.getText(sourceFile).length - b.getText(sourceFile).length;
};

export const localModuleImportCompareFn = (
  a: ts.ImportDeclaration,
  b: ts.ImportDeclaration,
  sourceFile: ts.SourceFile
): number => {
  return a.getText(sourceFile).length - b.getText(sourceFile).length;
};

export const styleModuleImportCompareFn = (
  a: ts.ImportDeclaration,
  b: ts.ImportDeclaration,
  sourceFile: ts.SourceFile
): number => {
  return a.getText(sourceFile).length - b.getText(sourceFile).length;
};

export const otherModuleImportCompareFn = (
  a: ts.ImportDeclaration,
  b: ts.ImportDeclaration,
  sourceFile: ts.SourceFile
): number => {
  return a.getText(sourceFile).length - b.getText(sourceFile).length;
};
