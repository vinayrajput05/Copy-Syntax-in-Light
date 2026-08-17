const vscode = require("vscode");
const { removeClipboardBackground } = require("./clipboardHelper");

/**
 * Helper to get all installed color theme names in VS Code.
 * @returns {string[]} List of theme label names
 */
function getInstalledThemes() {
  const themes = new Set();
  for (const ext of vscode.extensions.all) {
    const contributes = ext.packageJSON && ext.packageJSON.contributes;
    if (contributes && Array.isArray(contributes.themes)) {
      for (const theme of contributes.themes) {
        if (theme.label) {
          themes.add(theme.label);
        } else if (theme.id) {
          themes.add(theme.id);
        }
      }
    }
  }
  return Array.from(themes).sort();
}

/**
 * Helper to handle post-copy operations (e.g. background stripping)
 */
function handlePostCopy(config) {
  const removeBackground = config.get("copySyntaxInLight.removeBackground") !== false;
  if (removeBackground) {
    removeClipboardBackground();
  }
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Command 1: Copy Syntax
  let copyDisposable = vscode.commands.registerCommand(
    "copy-syntax-in-light.copySyntaxInLight",
    async function () {
      try {
        const config = vscode.workspace.getConfiguration();

        // Get configured custom theme (defaults to "current")
        const customThemeSetting = config.get("copySyntaxInLight.customTheme");
        const customTheme = customThemeSetting || "current";

        // Get the current color theme
        const currentTheme = config.get("workbench.colorTheme");

        // If configured to use "current" theme or target theme matches current theme, copy directly without changing theme
        if (customTheme === "current" || customTheme === currentTheme) {
          await vscode.commands.executeCommand(
            "editor.action.clipboardCopyAction"
          );
          handlePostCopy(config);
          vscode.window.showInformationMessage("Text copied using current theme syntax (highlights only)");
          return;
        }

        // Otherwise, temporarily switch to configured custom theme
        await config.update(
          "workbench.colorTheme",
          customTheme,
          vscode.ConfigurationTarget.Global
        );

        // Copy Selected Text
        await vscode.commands.executeCommand(
          "editor.action.clipboardCopyAction"
        );
        handlePostCopy(config);

        // Show success message
        vscode.window.showInformationMessage(`Text copied in ${customTheme} (highlights only)`);

        // Switch back to original theme
        await config.update(
          "workbench.colorTheme",
          currentTheme,
          vscode.ConfigurationTarget.Global
        );
      } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error.message || error}`);
      }
    }
  );

  // Command 2: Select Custom Theme
  let selectThemeDisposable = vscode.commands.registerCommand(
    "copy-syntax-in-light.selectTheme",
    async function () {
      try {
        const installedThemes = getInstalledThemes();

        // QuickPick options: Current Theme first, then installed themes
        const items = [
          {
            label: "Current Theme (Do not change theme when copying)",
            description: "Default: copies using active theme without theme changes",
            value: "current"
          },
          ...installedThemes.map(theme => ({
            label: theme,
            description: "Theme",
            value: theme
          }))
        ];

        const selected = await vscode.window.showQuickPick(items, {
          placeHolder: "Select theme for Copy Syntax in Light"
        });

        if (selected) {
          const config = vscode.workspace.getConfiguration();
          await config.update(
            "copySyntaxInLight.customTheme",
            selected.value,
            vscode.ConfigurationTarget.Global
          );
          vscode.window.showInformationMessage(
            `Copy Syntax in Light theme set to: ${selected.label}`
          );
        }
      } catch (error) {
        vscode.window.showErrorMessage(`Error selecting theme: ${error.message || error}`);
      }
    }
  );

  context.subscriptions.push(copyDisposable, selectThemeDisposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
  getInstalledThemes
};
