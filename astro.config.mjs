import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: "static",
  site: "https://sumanezhumalai.com",
  redirects: {
    "/articles": "/",
  },
  adapter: cloudflare(),
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      optimizeDeps: {
        exclude: ["resend"],
      },
    },
  },
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: {
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-frappe",
      },
    },
  },
});
