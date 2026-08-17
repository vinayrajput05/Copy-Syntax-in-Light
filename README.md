# Copy Syntax in Light

Copy code syntax cleanly with **highlights only (no background color)** and without unnecessary theme changes.

## Features

- **Highlights Only (No Background)**: Automatically strips background colors from copied HTML syntax highlighting so only text highlights are pasted (no background blocks in Notion, Google Docs, Slack, emails, etc.).
- **No Theme Changing**: Copy code directly with current theme style syntax without modifying your VS Code color theme or causing UI flickering.
- **Custom Theme Support**: Choose a specific custom light theme (or any installed VS Code theme) to apply when copying text if desired.
- **Interactive Theme Picker**: Use the Command Palette to easily select your preferred theme.
- **Keyboard Shortcut**: Quick syntax copying via `Ctrl`+`Shift`+`C` (Windows/Linux) or `Cmd`+`Shift`+`C` (macOS).

## How to Use

1. Select the code you want to copy.
2. Use **`Ctrl`+`Shift`+`C`** (Windows / Linux) or **`Cmd`+`Shift`+`C`** (macOS) to copy with syntax formatting.
3. Or right-click and select **"Copy Syntax In Light"** from the context menu.
4. Paste anywhere with text highlights intact and no background rectangle!

## Configuration

- `copySyntaxInLight.customTheme`: `"current"` (default) or any installed theme name.
- `copySyntaxInLight.removeBackground`: `true` (default) to strip background colors, or `false` to retain theme background colors.

## License

This project is open source and available under the MIT License.
