#!/usr/bin/env node

/**
 * Version Bump Script
 * Updates version in package.json, App.jsx, and README.md
 *
 * Usage: node scripts/bump-version.js <version> [--force]
 * Example: node scripts/bump-version.js 1.1.0
 *
 * Use --force to allow version downgrades
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createInterface } from "readline";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// Get args
const args = process.argv.slice(2);
const forceFlag = args.includes("--force") || args.includes("-f");
const newVersion = args.find((arg) => !arg.startsWith("-"));

if (!newVersion) {
  console.error("❌ Error: Please provide a version number");
  console.log("Usage: npm run bump <version> [--force]");
  console.log("Example: npm run bump 1.1.0");
  console.log("         npm run bump 1.0.0 --force  (to downgrade)");
  process.exit(1);
}

// Validate version format (semver)
const semverRegex = /^\d+\.\d+\.\d+(-[\w.]+)?$/;
if (!semverRegex.test(newVersion)) {
  console.error(
    "❌ Error: Invalid version format. Use semver (e.g., 1.0.0, 1.2.3-beta)",
  );
  process.exit(1);
}

/**
 * Compare two semver versions
 * Returns: 1 if v1 > v2, -1 if v1 < v2, 0 if equal
 */
function compareVersions(v1, v2) {
  const parts1 = v1.split("-")[0].split(".").map(Number);
  const parts2 = v2.split("-")[0].split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }
  return 0;
}

/**
 * Prompt user for confirmation
 */
async function confirm(question) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
}

/**
 * Main function
 */
async function main() {
  // Get current version from package.json
  const packagePath = join(rootDir, "package.json");
  let currentVersion;

  try {
    const packageJson = JSON.parse(readFileSync(packagePath, "utf-8"));
    currentVersion = packageJson.version;
  } catch (error) {
    console.error("❌ Failed to read package.json:", error.message);
    process.exit(1);
  }

  // Check for downgrade
  const comparison = compareVersions(newVersion, currentVersion);

  if (comparison < 0 && !forceFlag) {
    console.log(`\n⚠️  Warning: You are about to DOWNGRADE the version`);
    console.log(`   Current: ${currentVersion}`);
    console.log(`   New:     ${newVersion}\n`);

    const confirmed = await confirm(
      "Are you sure you want to downgrade? (y/N): ",
    );

    if (!confirmed) {
      console.log("\n❌ Version bump cancelled.\n");
      process.exit(0);
    }
  }

  if (comparison === 0) {
    console.log(
      `\nℹ️  Version is already ${currentVersion}. No changes made.\n`,
    );
    process.exit(0);
  }

  console.log(`\n🔄 Bumping version to ${newVersion}...\n`);

  // Track updates
  const updates = [];

  // Update package.json
  try {
    const packageJson = JSON.parse(readFileSync(packagePath, "utf-8"));
    const oldVersion = packageJson.version;
    packageJson.version = newVersion;
    writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + "\n");
    updates.push(`✅ package.json: ${oldVersion} → ${newVersion}`);
  } catch (error) {
    console.error("❌ Failed to update package.json:", error.message);
    process.exit(1);
  }

  // Update App.jsx
  const appPath = join(rootDir, "src", "App.jsx");
  try {
    let appContent = readFileSync(appPath, "utf-8");

    const versionRegex = /const APP_VERSION = ["']([^"']+)["'];?/;
    const match = appContent.match(versionRegex);

    if (match) {
      const oldVersion = match[1];
      appContent = appContent.replace(
        versionRegex,
        `const APP_VERSION = "${newVersion}";`,
      );
      writeFileSync(appPath, appContent);
      updates.push(`✅ App.jsx: ${oldVersion} → ${newVersion}`);
    } else {
      updates.push("⚠️  App.jsx: APP_VERSION not found");
    }
  } catch (error) {
    console.error("❌ Failed to update App.jsx:", error.message);
    process.exit(1);
  }

  // Update README.md version badge
  const readmePath = join(rootDir, "README.md");
  try {
    let readmeContent = readFileSync(readmePath, "utf-8");

    // Match: ![Version](https://img.shields.io/badge/version-X.X.X-pink)
    const badgeRegex =
      /(!\[Version\]\(https:\/\/img\.shields\.io\/badge\/version-)([^-]+)(-[^)]+\))/;
    const match = readmeContent.match(badgeRegex);

    if (match) {
      const oldVersion = match[2];
      readmeContent = readmeContent.replace(badgeRegex, `$1${newVersion}$3`);
      writeFileSync(readmePath, readmeContent);
      updates.push(`✅ README.md: ${oldVersion} → ${newVersion}`);
    } else {
      updates.push("⚠️  README.md: Version badge not found");
    }
  } catch (error) {
    // README is optional, don't fail
    updates.push("⚠️  README.md: Could not update");
  }

  // Print results
  updates.forEach((u) => console.log(u));

  console.log(`\n🎉 Version bumped to ${newVersion}!\n`);
  console.log("Next steps:");
  console.log("  1. npm run build");
  console.log("  2. git add .");
  console.log(`  3. git commit -m "Bump version to ${newVersion}"`);
  console.log("  4. git push\n");
}

main();
