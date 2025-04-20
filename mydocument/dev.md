# Webix Pro + Webix Jet 開発環境セットアップ手順（Vite + npm構成）

## 🎯 目的
Webix Pro と Webix Jet を組み合わせた SPA 開発環境を、Vite + npm 構成で効率的に構築できるようにする。
Webix Pro は CDN や npm で配布されていないため、zip 展開と `<script>` タグ読み込みによる構成で、Jet アプリと連携する方法をまとめる。

---

## ✅ 前提条件

- Vite（最新版）
- Node.js / npm インストール済
- Webix Pro ライセンスを取得済（zipファイルをダウンロードできる状態）
- Webix Jet アプリを npm ベースで構成（例： [webix-hub/jet-start](https://github.com/webix-hub/jet-start) のサンプルに準拠）

---

## ✅ 推奨フォルダ構成

```plaintext
project-root/
├── frontend/
│   ├── index.html
│   ├── sources/
│   │   ├── myapp.js
│   │   ├── views/
│   │   └── styles/
│   ├── webix/              ← ★ Webix Pro を展開する場所
│   │   ├── webix.js
│   │   ├── webix.css
│   │   └── locale/
│   ├── vite.config.js
│   └── package.json
└── ...
```

---

## ✅ Webix Pro の配置手順

1. Webix Pro をダウンロード（zip形式）
2. 解凍し、中身（`webix.js`, `webix.css`, `locale/` など）を `frontend/webix/` に配置

---

## ✅ `index.html`（jet-start に準拠）

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Webix Jet App</title>

  <!-- Webix Pro Library -->
  <script type="text/javascript" src="./webix/webix.js"></script>
  <link rel="stylesheet" href="./webix/webix.css">

  <!-- App Entry -->
  <script type="module" src="./sources/myapp.js"></script>
  <link rel="stylesheet" href="./sources/styles/app.css">
</head>
<body></body>
</html>
```

※ Webix Jet の公式サンプルと同じく、CDNではなくローカルの webix.js を `<script>` で読み込む形式です。

---

## ✅ `myapp.js` の構成（jet-start 準拠）

```js
import { JetApp, HashRouter } from "webix-jet";

export default class MyApp extends JetApp {
  constructor(config) {
    const defaults = {
      id: "app",
      version: "1.0",
      router: HashRouter,
      start: "/top/start"
    };
    super({ ...defaults, ...config });
  }
}

// Webix グローバルに登録されている前提で実行
webix.ready(() => new MyApp().render());
```

---

## ✅ `vite.config.js` の設定（基本構成）

```js
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: path.resolve(__dirname),
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: "dist",
    emptyOutDir: true
  }
});
```

---

## ✅ npm インストール

```bash
cd frontend
npm install webix-jet
```

- `webix-jet` は npm で管理
- `webix.js`（Pro版）は npm では管理しない（ライセンスの都合で手動展開）

---

## ✅ 起動

```bash
npx vite
```

---

## ✅ 多言語対応（plugins.Locale の使用）

```js
import { plugins } from "webix-jet";
import ja from "../webix/locale/ja.js";

this.use(plugins.Locale, {
  lang: "ja",
  webix: ja,
  storage: webix.storage.local
});
```

---

## ✅ 注意点まとめ

| 項目 | 内容 |
|------|------|
| Webix Pro の配布形態 | zip ファイルで配布。CDNなし、npm提供なし |
| 読み込み方法 | `<script>` タグで `webix.js` を読み込む（CDNと同様） |
| `window.webix = webix;` の必要性 | ❌ 不要（読み込み時に自動で登録される） |
| JetApp との連携 | ✅ 問題なく動作する |

---

## ✅ まとめ

- Webix Pro は zip 展開 + `<script>` タグ読み込みで利用
- Webix Jet は npm 管理・モジュールとして利用
- `webix` は自動でグローバル登録されるため追加コード不要
- Jet公式サンプル（[webix-hub/jet-start](https://github.com/webix-hub/jet-start)）と同等の構成で安定運用可能

> この構成であれば、Webix Pro + Jet のシンプルかつ信頼性のある SPA 開発環境をすぐに立ち上げられます。

## 参考

### Webix変数をグローバルコンテキストで利用できるようにする必要について
https://forum.webix.com/t/importing-webix-into-js-file-cant-find-variable-webix/37981