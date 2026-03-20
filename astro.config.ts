import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function readConfig(key: string): string | undefined {
  const configPath = resolve(process.cwd(), ".site-config");
  if (!existsSync(configPath)) return undefined;
  const content = readFileSync(configPath, "utf-8");
  const match = content.match(new RegExp(`^${key}=(.+)$`, "m"));
  return match?.[1]?.trim();
}

const siteDomain = readConfig("SITE_DOMAIN") ?? "crontab.dwk.io";
const siteUrl = `https://${siteDomain}`;

export default defineConfig({
  site: siteUrl,
  devToolbar: { enabled: false },
  integrations: [sitemap()],
});
