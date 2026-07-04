import { copyFileSync, existsSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const webDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const disabledRoutes = [
    ["src/app/api", "src/app/_api"],
    ["src/app/webdav-proxy", "src/app/_webdav-proxy"],
].map(([from, to]) => [join(webDir, from), join(webDir, to)]);

function move(from, to) {
    if (!existsSync(from)) return false;
    if (existsSync(to)) throw new Error(`Cannot move ${from}; target already exists: ${to}`);
    renameSync(from, to);
    return true;
}

const moved = [];
let buildStatus = 0;

try {
    for (const [from, to] of disabledRoutes) {
        if (move(from, to)) moved.push([to, from]);
    }

    const npm = process.platform === "win32" ? "npm.cmd" : "npm";
    const result = spawnSync(npm, ["run", "build"], {
        cwd: webDir,
        stdio: "inherit",
        env: { ...process.env, GITHUB_PAGES: "true" },
        shell: process.platform === "win32",
    });

    if (result.error) {
        throw result.error;
    }

    if (result.status !== 0) {
        buildStatus = result.status || 1;
    } else {
        const outDir = join(webDir, "out");
        if (!existsSync(outDir)) throw new Error("Next.js did not create web/out");
        copyFileSync(join(outDir, "index.html"), join(outDir, "404.html"));
        writeFileSync(join(outDir, ".nojekyll"), "");
    }
} finally {
    for (const [from, to] of moved.reverse()) {
        if (existsSync(from)) renameSync(from, to);
    }
}

if (buildStatus !== 0) process.exit(buildStatus);
