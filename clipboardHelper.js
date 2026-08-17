const cp = require("child_process");
const process = require("process");

/**
 * Remove background-color & background properties from HTML on system clipboard.
 */
function removeClipboardBackground() {
  const platform = process.platform;
  if (platform === "darwin") {
    return removeBackgroundMacOS();
  } else if (platform === "win32") {
    return removeBackgroundWindows();
  } else if (platform === "linux") {
    return removeBackgroundLinux();
  }
  return false;
}

function removeBackgroundMacOS() {
  try {
    const raw = cp.execSync("osascript -e 'get the clipboard as «class HTML»'", { encoding: "utf8" }).trim();
    const hexMatch = raw.match(/«data HTML([0-9A-Fa-f]+)»/);
    if (!hexMatch) {
      return false;
    }
    const html = Buffer.from(hexMatch[1], "hex").toString("utf8");
    const cleanedHtml = html
      .replace(/background-color\s*:\s*[^;"]+;?/gi, "")
      .replace(/background\s*:\s*[^;"]+;?/gi, "");
    const newHex = Buffer.from(cleanedHtml, "utf8").toString("hex").toUpperCase();
    const script = "set the clipboard to {«class HTML»: «data HTML" + newHex + "»}";
    cp.execSync("osascript -e '" + script + "'");
    return true;
  } catch (err) {
    return false;
  }
}

function removeBackgroundWindows() {
  try {
    const psScript = "Add-Type -Assembly PresentationCore; $h = [System.Windows.Clipboard]::GetText([System.Windows.TextDataFormat]::Html); if ($h) { $c = $h -replace 'background-color\\s*:\\s*[^;]+;?', '' -replace 'background\\s*:\\s*[^;]+;?', ''; [System.Windows.Clipboard]::SetText($c, [System.Windows.TextDataFormat]::Html) }";
    cp.execSync("powershell -NoProfile -Command '" + psScript + "'");
    return true;
  } catch (err) {
    return false;
  }
}

function removeBackgroundLinux() {
  try {
    const html = cp.execSync("xclip -selection clipboard -t text/html -o", { encoding: "utf8" });
    if (html) {
      const cleanedHtml = html
        .replace(/background-color\s*:\s*[^;"]+;?/gi, "")
        .replace(/background\s*:\s*[^;"]+;?/gi, "");
      const proc = cp.spawn("xclip", ["-selection", "clipboard", "-t", "text/html"], { stdio: ["pipe", "ignore", "ignore"] });
      proc.stdin.write(cleanedHtml);
      proc.stdin.end();
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}

module.exports = {
  removeClipboardBackground,
  removeBackgroundMacOS,
  removeBackgroundWindows,
  removeBackgroundLinux
};
