import { existsSync } from "node:fs";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const mediaExists = (name: string) =>
  existsSync(resolve(process.cwd(), "public", "media", name));

export default defineConfig({
  base: "./",
  plugins: [react(), viteSingleFile()],
  server: {
    watch: {
      ignored: ["**/.chrome-review/**"],
    },
  },
  define: {
    __MEDIA_OPENING__: JSON.stringify(mediaExists("opening.mp4")),
    __MEDIA_OFFLINE__: JSON.stringify(mediaExists("offline.mp4")),
    __MEDIA_JOURNEY__: JSON.stringify(mediaExists("journey.mp4")),
  },
  build: {
    assetsInlineLimit: 100_000_000,
    cssCodeSplit: false,
    target: "es2022",
    reportCompressedSize: false,
  },
});
