// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: "0.0.0.0", // コンテナの外部からアクセス可能にする
    port: 5173, // viteのデフォルトポート（変更も可）
    strictPort: true, // 5173が使用中なら失敗させる（falseにすると自動切替）
    watch: {
      // ファイル変更のポーリングを有効化
      usePolling: true,
    },
  },
  base: "./", // 相対パス読み込み（ビルド時に必要）
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
