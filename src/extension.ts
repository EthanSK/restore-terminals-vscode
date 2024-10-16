/* eslint-disable prettier/prettier */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { getConfiguration } from "./configuration";
import restoreTerminals from "./restoreTerminals";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

//do NOT make async and await the async functions in this func, or the command just doesn't work
export async function activate(context: vscode.ExtensionContext) {
    console.log("restore-terminals is now active!");

    const config = await getConfiguration(); //mast be done here so json config works for runOnStartup

    let disposable = vscode.commands.registerCommand(
        "restore-terminals.restoreTerminals",
        async () => {
            const args = await vscode.window.showInputBox({ prompt: 'Enter which terminals to restore' });
            if (args)
                restoreTerminals(await getConfiguration(), args); //get fresh config here
            else
                restoreTerminals(await getConfiguration()); //get fresh config here
        }
    );

    context.subscriptions.push(disposable);

    if (config.runOnStartup) {
        restoreTerminals(config); //run on startup
    }
}

// this method is called when your extension is deactivated
export function deactivate() { }
