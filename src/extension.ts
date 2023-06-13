import * as vscode from "vscode";
import { sortImports } from "./sortImports";

export function activate(context: vscode.ExtensionContext) {
  const sortOnCommandDisposer = vscode.commands.registerCommand(
    "extension.typescriptSortImport",
    () => {
      if (isFileTypescript()) {
        const editor = vscode.window.activeTextEditor!;
        const sortedImports = sortImports(editor.document);
        editor.edit(editBuilder => {
          editBuilder.replace(sortedImports.range, sortedImports.newValue);
        });
      }
    }
  );
  context.subscriptions.push(sortOnCommandDisposer);
}

function isFileTypescript() {
  return (
    vscode.window.activeTextEditor?.document.languageId === "typescript" ||
    vscode.window.activeTextEditor?.document.languageId === "typescriptreact"
  );
}

export function deactivate() {}
