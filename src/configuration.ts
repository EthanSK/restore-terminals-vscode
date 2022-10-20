import * as vscode from "vscode";
import { Configuration, JsonConfiguration, TerminalWindow } from "./model";
import { TextDecoder } from "text-encoding";
import * as path from "path";

export async function getConfiguration(): Promise<Configuration> {
  const keepExistingTerminalsOpen: boolean | undefined = vscode.workspace
    .getConfiguration("restoreTerminals")
    .get("keepExistingTerminalsOpen");

  const artificialDelayMilliseconds: number | undefined = vscode.workspace
    .getConfiguration("restoreTerminals")
    .get("artificialDelayMilliseconds");

  const terminalWindows: TerminalWindow[] | undefined = vscode.workspace
    .getConfiguration("restoreTerminals")
    .get("terminals");

  const runOnStartup: boolean | undefined = vscode.workspace
    .getConfiguration("restoreTerminals")
    .get("runOnStartup");

  const configFromFile = await getConfigurationFromJsonFile();
  return {
    keepExistingTerminalsOpen:
      configFromFile?.keepExistingTerminalsOpen ?? keepExistingTerminalsOpen,
    artificialDelayMilliseconds:
      configFromFile?.artificialDelayMilliseconds ??
      artificialDelayMilliseconds,
    terminalWindows: configFromFile?.terminalWindows ?? terminalWindows,
    runOnStartup: configFromFile?.runOnStartup ?? runOnStartup,
  };
}

async function getConfigurationFromJsonFile(): Promise<
  Configuration | undefined
> {
  const { workspaceFolders } = vscode.workspace;

  if (!workspaceFolders) {
    return undefined;
  }
  let configData: JsonConfiguration | undefined;
  //find any workspace with the config
  for (const folder of workspaceFolders) {
    try {
      const configFilePath = vscode.Uri.file(
        path.join(folder.uri.fsPath, ".vscode", "restore-terminals.json")
      );
      const fileData = await vscode.workspace.fs.readFile(configFilePath);
      const fileDataString = new TextDecoder("utf-8").decode(fileData);
      configData = JSON.parse(fileDataString);
    } catch (error) {
      console.log("No config in workspace", folder, error.Message);
    }
  }
  if (!configData) return undefined;
  return {
    ...configData,
    terminalWindows: configData?.terminals, //shim
  };
}
