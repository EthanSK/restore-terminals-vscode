import * as vscode from "vscode";
import { delay } from "./utils";
import { Configuration } from "./model";

const DEFAULT_ARTIFICAL_DELAY = 500;

/**
 * Waits for a terminal to be fully registered in VSCode's terminal list.
 * This ensures the terminal is ready before creating split terminals from it.
 */
async function waitForTerminal(
  terminal: vscode.Terminal,
  timeoutMs: number = 5000,
): Promise<void> {
  return new Promise((resolve) => {
    // If terminal is already in the list, resolve immediately
    if (vscode.window.terminals.includes(terminal)) {
      resolve();
      return;
    }

    // Set up a timeout to avoid waiting forever
    const timeout = setTimeout(() => {
      disposable.dispose();
      resolve(); // Resolve anyway after timeout, let the delay handle any remaining issues
    }, timeoutMs);

    // Listen for terminal open events
    const disposable = vscode.window.onDidOpenTerminal((t) => {
      if (t === terminal) {
        clearTimeout(timeout);
        disposable.dispose();
        resolve();
      }
    });
  });
}

export default async function restoreTerminals(configuration: Configuration) {
  console.log("restoring terminals", configuration);
  const {
    keepExistingTerminalsOpen,
    artificialDelayMilliseconds,
    terminalWindows,
  } = configuration;

  if (!terminalWindows) {
    // vscode.window.showInformationMessage("No terminal window configuration provided to restore terminals with.") //this might be annoying
    return;
  }

  if (vscode.window.activeTerminal && !keepExistingTerminalsOpen) {
    vscode.window.terminals.forEach((terminal) => {
      //i think calling terminal.dispose before creating the new termials causes error because the terminal has disappeard and it fux up. we can do it after, and check that the terminal we are deleting is not in the list of terminals we just created
      console.log(`Disposing terminal ${terminal.name}`);
      terminal.dispose();
    });
  }
  await delay(artificialDelayMilliseconds ?? DEFAULT_ARTIFICAL_DELAY); //without delay it starts bugging out

  const commandsToRunInTerms: {
    commands: string[];
    shouldRunCommands: boolean;
    terminal: vscode.Terminal;
  }[] = [];
  //create the terminals sequentially so theres no glitches, but run the commands in parallel
  for (const terminalWindow of terminalWindows) {
    if (!terminalWindow.splitTerminals) {
      // vscode.window.showInformationMessage("No split terminal configuration provided to restore terminals with.") //this might be annoying
      return;
    }

    const name = terminalWindow.splitTerminals[0]?.name;
    const color = terminalWindow.splitTerminals[0]?.color;
    const icon = terminalWindow.splitTerminals[0]?.icon;

    const term = vscode.window.createTerminal({
      name: name,
      color: color ? new vscode.ThemeColor(color) : undefined,
      iconPath: icon ? new vscode.ThemeIcon(icon) : undefined,
      // cwd: vscode.window.activeTextEditor?.document.uri.fsPath, //i think this happens by default
    });

    term.show();

    // Wait for the terminal to be fully registered before creating splits
    await waitForTerminal(term);

    //the first terminal split is already created from when we called createTerminal
    if (terminalWindow.splitTerminals.length > 0) {
      const { commands, shouldRunCommands } = terminalWindow.splitTerminals[0];
      commands &&
        commandsToRunInTerms.push({
          commands,
          shouldRunCommands: shouldRunCommands ?? true,
          terminal: term,
        });
    }
    await delay(artificialDelayMilliseconds ?? DEFAULT_ARTIFICAL_DELAY);

    for (let i = 1; i < terminalWindow.splitTerminals.length; i++) {
      const splitTerminal = terminalWindow.splitTerminals[i];
      const createdSplitTerm = await createNewSplitTerminal(
        term,
        splitTerminal.name,
      );

      const { commands, shouldRunCommands } = splitTerminal;
      commands &&
        commandsToRunInTerms.push({
          commands,
          shouldRunCommands: shouldRunCommands ?? true,
          terminal: createdSplitTerm,
        });
      await delay(artificialDelayMilliseconds ?? DEFAULT_ARTIFICAL_DELAY);
    }
  }
  await delay(artificialDelayMilliseconds ?? DEFAULT_ARTIFICAL_DELAY);
  //we run the actual commands in parallel
  commandsToRunInTerms.forEach(async (el) => {
    await runCommands(el.commands, el.terminal, el.shouldRunCommands);
  });
}

async function runCommands(
  commands: string[],
  terminal: vscode.Terminal,
  shouldRunCommands: boolean = true,
) {
  for (let j = 0; j < commands?.length; j++) {
    const command = commands[j] + (shouldRunCommands ? "" : ";"); //add semicolon so all commands can run properly after user presses enter
    terminal.sendText(command, shouldRunCommands);
  }
}

async function createNewSplitTerminal(
  parentTerminal: vscode.Terminal,
  name: string | undefined,
): Promise<vscode.Terminal> {
  // Ensure parent is shown and focused
  parentTerminal.show(false);
  await delay(200);

  // Get count before
  const countBefore = vscode.window.terminals.length;

  // Use command to split - this definitely works
  await vscode.commands.executeCommand("workbench.action.terminal.split");

  // Wait for new terminal
  let newTerminal: vscode.Terminal | undefined;
  for (let i = 0; i < 50; i++) {
    await delay(100);
    if (vscode.window.terminals.length > countBefore) {
      newTerminal = vscode.window.terminals[vscode.window.terminals.length - 1];
      break;
    }
  }

  if (!newTerminal) {
    console.error("Failed to create split terminal via command");
    // Fallback to regular terminal
    newTerminal = vscode.window.createTerminal({ name });
  }

  // Rename the terminal
  if (name) {
    // Make sure the new terminal is focused
    newTerminal.show(false);
    await delay(100);
    await vscode.commands.executeCommand(
      "workbench.action.terminal.renameWithArg",
      { name },
    );
  }

  return newTerminal;
}
