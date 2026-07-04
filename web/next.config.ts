import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { parseChangelog } from "@/lib/release";

const webDir = dirname(fileURLToPath(import.meta.url));
const localVersion = readFileSync(resolve(webDir, "../VERSION"), "utf8").trim() || "dev";
const localChangelog = readFileSync(resolve(webDir, "../CHANGELOG.md"), "utf8");

export default function nextConfig(phase: string): NextConfig {
    const isDev = phase === PHASE_DEVELOPMENT_SERVER;
    const isGitHubPages = process.env.GITHUB_PAGES === "true";
    const releases = parseChangelog(localChangelog);

    return {
        output: isGitHubPages ? "export" : "standalone",
        basePath: isGitHubPages ? "/infinite-canvas" : undefined,
        assetPrefix: isGitHubPages ? "/infinite-canvas" : undefined,
        images: {
            unoptimized: isGitHubPages,
        },
        allowedDevOrigins: isDev ? ["*.*.*.*"] : [],
        typescript: {
            ignoreBuildErrors: true,
        },
        env: {
            NEXT_PUBLIC_APP_VERSION: localVersion,
            NEXT_PUBLIC_APP_RELEASES: JSON.stringify(releases),
            NEXT_PUBLIC_STATIC_EXPORT: isGitHubPages ? "true" : "false",
            NEXT_PUBLIC_BASE_PATH: isGitHubPages ? "/infinite-canvas" : "",
        },
    };
}
