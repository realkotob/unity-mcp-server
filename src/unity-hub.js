// Unity Hub CLI wrapper
import { execFile } from "child_process";
import { promisify } from "util";
import { CONFIG } from "./config.js";

const execFileAsync = promisify(execFile);

/**
 * Execute a Unity Hub CLI command
 */
async function runHubCommand(args, timeoutMs = 30000) {
  const hubPath = CONFIG.unityHubPath;

  // Try modern syntax first (no '--' prefix, works with Unity Hub 3.x+)
  const modernArgs = ["--headless", ...args];
  try {
    const { stdout, stderr } = await execFileAsync(hubPath, modernArgs, {
      timeout: timeoutMs,
      windowsHide: true,
    });
    return { success: true, stdout: stdout.trim(), stderr: stderr.trim() };
  } catch (error) {
    // If modern syntax fails, try legacy syntax with '--' prefix (Unity Hub 2.x)
    const legacyArgs = ["--", "--headless", ...args];
    try {
      const { stdout, stderr } = await execFileAsync(hubPath, legacyArgs, {
        timeout: timeoutMs,
        windowsHide: true,
      });
      return { success: true, stdout: stdout.trim(), stderr: stderr.trim() };
    } catch (legacyError) {
      const msg = error.message || legacyError.message;
      const hint = msg.includes("ENOENT")
        ? ` Unity Hub not found at "${hubPath}". Set UNITY_HUB_PATH environment variable to the correct path.`
        : "";
      return {
        success: false,
        error: msg + hint,
        stdout: error.stdout?.trim() || legacyError.stdout?.trim() || "",
        stderr: error.stderr?.trim() || legacyError.stderr?.trim() || "",
      };
    }
  }
}

/**
 * List installed Unity Editor versions
 */
export async function listInstalledEditors() {
  const result = await runHubCommand(["editors", "--installed"]);
  if (!result.success) return { error: result.error, raw: result.stderr };

  const editors = [];
  const lines = result.stdout.split("\n").filter((l) => l.trim());
  for (const line of lines) {
    // Parse lines like: "2022.3.0f1 , installed at C:\Program Files\Unity\..."
    const match = line.match(/^([\d.]+\w+)\s*,?\s*installed at\s+(.+)$/i);
    if (match) {
      editors.push({ version: match[1].trim(), path: match[2].trim() });
    }
  }
  return { editors, raw: result.stdout };
}

/**
 * List available Unity Editor releases
 */
export async function listAvailableReleases() {
  const result = await runHubCommand(["editors", "--releases"]);
  if (!result.success) return { error: result.error };
  return { raw: result.stdout };
}

/**
 * Install a Unity Editor version with optional modules
 */
export async function installEditor(version, modules = []) {
  const args = ["install", "--version", version];
  for (const mod of modules) {
    args.push("--module", mod);
  }
  const result = await runHubCommand(args, 600000); // 10min timeout for installs
  return result;
}

/**
 * Install modules to an existing editor
 */
export async function installModules(version, modules) {
  const args = ["install-modules", "--version", version];
  for (const mod of modules) {
    args.push("--module", mod);
  }
  const result = await runHubCommand(args, 300000);
  return result;
}

/**
 * Get or set the editor installation path
 */
export async function getInstallPath() {
  const result = await runHubCommand(["install-path"]);
  return result;
}

export async function setInstallPath(path) {
  const result = await runHubCommand(["install-path", "--set", path]);
  return result;
}
