# Restore Terminals

Automatically spawn terminal windows and split terminals with any shell commands when VSCode starts up!

## How to use

Simply configure your VSCode settings JSON file to look something like this:

```
 "restoreTerminals.terminals": [
    {
      "splitTerminals": [
        {
          "commands": ["npm i", "npm run dev"]
        },
        {
          "commands": ["npm run dev:client"]
        },
        {
          "commands": ["jest --watch"]
        }
      ]
    },
    {
      "splitTerminals": [
        {
          "commands": ["npm run eslint", "npm run build", "npm run e2e", "npm run deploy"]
        },
        {
          "commands": ["npm-run-all --parallel redis tsc-watch-start worker"]
        }
      ]
    }
  ]
```

The outer array represents a integrated VSCode terminal window, and the `splitTerminals` array contains the information about how each terminal window should be split up.

## Extra info

The order of split terminals from left to right is the order in the array.

You can manually trigger the restoration of terminals by running `Restore Terminals` in the command palette.

If you find the extension glitching out, try increasing the `restoreTerminals.artificialDelayMilliseconds` setting to a higher number, such as `1000`.

If you do not want this extension to close the currently open terminal windows, you can simply set `restoreTerminals.keepExistingTerminalsOpen` to `true`.

If you do not want it to restore terminals on VSCode startup, but instead only run when you trigger it manually from the command palette, then set `restoreTerminals.runOnStartup` to `false`.

Contributions to the [code](https://github.com/EthanSK/restore-terminals-vscode) are very welcome and much appreciated!

**Enjoy!**
