import { defineConfig } from "vite";

export default defineConfig({
  server: {
    // Ensure proper MIME types for video files
    headers: {
      "Content-Type": "video/mp4",
    },
  },
  assetsInclude: ["**/*.mp4", "**/*.glb", "**/*.gltf"],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Keep videos in textures folder
          if (assetInfo.name.endsWith(".mp4")) {
            return "textures/[name][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
      },
    },
  },
});
