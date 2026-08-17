const assert = require("assert");
const vscode = require("vscode");
const myExtension = require("../extension");

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("getInstalledThemes returns an array", () => {
    const themes = myExtension.getInstalledThemes();
    assert.strictEqual(Array.isArray(themes), true);
  });

  test("Commands are registered", async () => {
    const commands = await vscode.commands.getCommands(true);
    assert.strictEqual(
      commands.includes("copy-syntax-in-light.copySyntaxInLight"),
      true
    );
    assert.strictEqual(
      commands.includes("copy-syntax-in-light.selectTheme"),
      true
    );
  });

  test("Configuration property defaults to current", () => {
    const config = vscode.workspace.getConfiguration();
    const customTheme = config.get("copySyntaxInLight.customTheme");
    assert.strictEqual(customTheme, "current");
  });
});
