// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as path from "path";
import * as cmd from "./cmd";

const OCAMLFORMAT_BIN_NAME = "ocamlformat";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "ocamlformat-vscode-extension" is now active!'
  );

  const makeOcamlformatPathUsingOpam = (dir: string): string => {
    const command =
      "eval $(opam env --readonly) > /dev/null 2>&1 && /bin/echo -n $OPAM_SWITCH_PREFIX";
    const res = cmd.execOnShell(command, dir);
    if (res.stdout === "" && res.error === undefined) {
      throw new Error(`OPAM_SWITCH_PREFIX is empty: ${cmd}`);
    }
    if (res.error !== undefined) {
      throw new Error(`the command occurs error: ${res.error.msg}`);
    }
    return `${res.stdout}/bin/${OCAMLFORMAT_BIN_NAME}`;
  };

  const format = (filename: string) => {
    const config = vscode.workspace.getConfiguration(
      "ocamlformat-vscode-extension"
    );

    const ocamlformatPath =
      (config.get("customOcamlformatPath") as string) ||
      makeOcamlformatPathUsingOpam(path.dirname(filename));

    const ocamlformatOptions = (config.get(
      "ocamlformatOption"
    ) as string).split(",");
    const args = ocamlformatOptions.concat(filename);

    // TODO: args uniq
    // TODO: delete --inplace, -o, --output

    return cmd.exec(ocamlformatPath, args, path.dirname(filename));
  };

  const getFullRange = (document: vscode.TextDocument): vscode.Range => {
    const firstLine = document.lineAt(0);
    const lastLine = document.lineAt(document.lineCount - 1);
    return new vscode.Range(firstLine.range.start, lastLine.range.end);
  };

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "ocamlformat-vscode-extension.ocamlformat",
      () => {
        // The code you place here will be executed every time your command is executed
        const { activeTextEditor } = vscode.window;
        if (!activeTextEditor) {
          return;
        }
        const { document } = activeTextEditor;

        try {
          const res = format(document.fileName);

          if (res.stdout !== undefined) {
            const edit = new vscode.WorkspaceEdit();
            const range = getFullRange(document);
            edit.replace(document.uri, range, res.stdout);
            return vscode.workspace.applyEdit(edit);
          }

          if (res.error !== undefined) {
            vscode.window.showErrorMessage(res.error.msg);
          }
        } catch (error) {
          vscode.window.showErrorMessage(error.message);
        }
      }
    )
  );

  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider("ocaml", {
      provideDocumentFormattingEdits(
        document: vscode.TextDocument
      ): vscode.TextEdit[] {
        try {
          const res = format(document.fileName);

          if (res.stdout !== undefined) {
            return [
              vscode.TextEdit.replace(
                getFullRange(document),
                res.stdout.toString()
              ),
            ];
          }
          if (res.error !== undefined) {
            vscode.window.showErrorMessage(res.error.msg);
          }
        } catch (error) {
          vscode.window.showErrorMessage(error.message);
        }

        // not change
        return [
          vscode.TextEdit.replace(getFullRange(document), document.getText()),
        ];
      },
    })
  );
}
