# ocamlformat-vscode-extension README

![](https://github.com/hoddy3190/ocamlformat-vscode-extension/workflows/test/badge.svg)

This extension wraps `ocamlformat` command.  
I tested only on OSX, so I don't know it will work on other operating systems.

## Features

It enables you to execute `ocamlformat` from Command Palette.

And also enables it on save and on paste if you add the following settings to `settings.json`

```
"editor.formatOnSave": true
"editor.formatOnPaste": true
```

## Extension Settings

This extension has the following settings:

- `ocamlformat-vscode-extension.customOcamlformatPath`
  - set path to `ocamlformat` command
  - if empty, `${OPAM_SWITCH_PREFIX}/bin/ocamlformat` is used. In that case, you have to set path to `opam` command
- `ocamlformat-vscode-extension.ocamlformatOption`
  - If multiple, use a comma as delimited string (e.g. ----enable-outside-detected-project,--ocp-indent-config)
  - I recommend that you only put options here that you can't put in .ocamlformat
  - Note:
    - This extension executes ocamlformat and replace file text with its "stdout". So it won't work if you set the following options
      - options to change the output destination
        - e.g. `--inplace`, `-o` etc.
      - options to output something other than formatted code
        - e.g. `--help` etc.
