import * as vscode from "vscode";
import { Configuration, JsonConfiguration, TerminalWindow } from "./model";
import { TextDecoder } from "text-encoding";
import * as path from "path";

export async function getConfiguration(): Promise<Configuration> {
  const keepExistingTerminalsOpen:
    | boolean
    | undefined = vscode.workspace
    .getConfiguration("restoreTerminals")
    .get("keepExistingTerminalsOpen");

  const artificialDelayMilliseconds:
    | number
    | undefined = vscode.workspace
    .getConfiguration("restoreTerminals")
    .get("artificialDelayMilliseconds");

  const terminalWindows:
    | TerminalWindow[]
    | undefined = vscode.workspace
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
  
  // Collect all configs from all workspace folders
  const allTerminalWindows: TerminalWindow[] = [];
  let mergedConfig: Partial<Configuration> = {};

  // Load config from each workspace folder
  for (const folder of workspaceFolders) {
    try {
      const configFilePath = vscode.Uri.file(
        path.join(folder.uri.fsPath, ".vscode", "restore-terminals.json")
      );
      const fileData = await vscode.workspace.fs.readFile(configFilePath);
      const fileDataString = new TextDecoder("utf-8").decode(fileData);
      const configData: JsonConfiguration = JSON.parse(fileDataString);
      
      // Merge global settings (last file wins when multiple workspaces define them)
      if (configData.keepExistingTerminalsOpen !== undefined) {
        mergedConfig.keepExistingTerminalsOpen = configData.keepExistingTerminalsOpen;
      }
      if (configData.artificialDelayMilliseconds !== undefined) {
        mergedConfig.artificialDelayMilliseconds = configData.artificialDelayMilliseconds;
      }
      if (configData.runOnStartup !== undefined) {
        mergedConfig.runOnStartup = configData.runOnStartup;
      }
      
      // Add terminal windows with workspace folder path
      if (configData.terminals) {
        const terminalWindowsWithWorkspace = configData.terminals.map((tw) => ({
          ...tw,
          workspaceFolderPath: folder.uri.fsPath,
        }));
        allTerminalWindows.push(...terminalWindowsWithWorkspace);
      }
    } catch (error) {
      console.log("No config in workspace", folder, error);
    }
  }
  
  if (allTerminalWindows.length === 0 && Object.keys(mergedConfig).length === 0) {
    return undefined;
  }
  
  return {
    ...mergedConfig,
    terminalWindows: allTerminalWindows.length > 0 ? allTerminalWindows : undefined,
  };
}
