import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "static",
  site: "https://sumanezhumalai.com",
  integrations: [
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: {
        themes: {
          light: "catppuccin-latte",
          dark: "catppuccin-frappe",
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
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
