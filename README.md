# Restore Terminals

Automatically spawn integrated terminal windows and split terminals, and run any shell commands when VSCode starts up!

**Requires VS Code 1.75.0 or higher.**

## How to use

Simply configure your VSCode settings JSON file to look something like this:

```
 "restoreTerminals.runOnStartup": true,
 "restoreTerminals.terminals": [
    {
      "splitTerminals": [
        {
          "name": "server",
          "color": "terminal.ansiGreen",
          "icon": "server",
          "commands": ["npm i", "npm run dev"]
        },
        {
          "name": "client",
          "commands": ["npm run dev:client"]
        },
        {
          "name": "test",
          "commands": ["jest --watch"]
        }
      ]
    },
    {
      "splitTerminals": [
        {
          "name": "build & e2e",
          "color": "terminal.ansiYellow",
          "icon": "tools",
          "commands": ["npm run eslint", "npm run build", "npm run e2e"],
          "shouldRunCommands": false
        },
        {
          "name": "worker",
          "commands": ["npm-run-all --parallel redis tsc-watch-start worker"]
        }
      ]
    }
  ]
```

The outer array represents a integrated VSCode terminal window, and the `splitTerminals` array contains the information about how each terminal window should be split up.

## Terminal Colors and Icons

You can customize the appearance of your terminals by setting `color` and `icon` properties. These work for standalone terminals. For split terminals, `color` and `icon` are only applied to the first terminal in the group.

### Available Colors

- `terminal.ansiBlack`, `terminal.ansiRed`, `terminal.ansiGreen`, `terminal.ansiYellow`
- `terminal.ansiBlue`, `terminal.ansiMagenta`, `terminal.ansiCyan`, `terminal.ansiWhite`

### Available Icons

You can use any icon from VS Code's built-in icons. Some popular ones:

- `terminal`, `server`, `database`, `cloud`, `globe`
- `rocket`, `flame`, `bug`, `beaker`, `zap`
- `tools`, `gear`, `wrench`, `play`, `debug`

For a full list of available icons, see the [VS Code Icon Reference](https://code.visualstudio.com/api/references/icons-in-labels).

You can also use a custom config file under. The file should be at `.vscode/restore-terminals.json` in any workspace you want. A sample config file is [here](https://github.com/EthanSK/restore-terminals-vscode/blob/master/sample-test-project/.vscode/restore-terminals.json). If this config file is present, Restore Terminals will try and load settings from it first, then use `settings.json` as a fallback.

## Extra info

The order of split terminals from left to right is the order in the array.

You can manually trigger the restoration of terminals by running `Restore Terminals` in the command palette.

If you find the extension glitching out, try increasing the `restoreTerminals.artificialDelayMilliseconds` setting to a higher number, such as `1000`.

If you do not want this extension to close the currently open terminal windows, you can simply set `restoreTerminals.keepExistingTerminalsOpen` to `true`.

If you do not want it to restore terminals on VSCode startup, but instead only run when you trigger it manually from the command palette, then set `restoreTerminals.runOnStartup` to `false`.

If you don't want the commands to actually run, just be pasted in the terminal, then set `shouldRunCommands` to `false` in each `splitTerminals` object.

If you don't like using split terminals, then just provide one object in each split terminal array, which should be the intuitive thing to do.

### Contributions

Unless you can 100% prove your contribution fully works with a video, and the code is clean and makes sense, I am no longer accepting contributions. Too many contributions have been submitted that don't work, and the VSCode official API doesn't work in many cases, and this extension already uses a couple hacks to get around it.

**Enjoy!**
