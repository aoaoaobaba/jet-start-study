# Webix Jet におけるパンくずリスト実装ガイド

## 🎯 目的
Webix Jet を用いたシングルページアプリケーションにおいて、現在のルーティングに基づいたパンくずリスト（breadcrumb）を表示する方法を整理する。最小構成から段階的に応用する方法までをまとめる。

---

## ✅ パンくずの基本構成

Webix Jet では `this.getUrl()` により現在のルーティングパスが取得可能。これを用いてパンくずを構築する。

### 最小構成例（ラベルをマッピング）
```js
// views/breadcrumb.js
import { JetView } from "webix-jet";

const labels = {
  top: "トップ",
  dashboard: "ダッシュボード",
  settings: "設定",
  users: "ユーザー管理"
};

export default class BreadcrumbView extends JetView {
  config() {
    return {
      view: "template",
      localId: "bc",
      css: "webix_breadcrumb",
      template: obj => obj.label || ""
    };
  }

  init() {
    this.app.attachEvent("app:urlchange", () => this.update());
  }

  update() {
    const path = this.getUrl().map(p => p.page);
    const trail = path.map(p => labels[p] || p);
    const html = trail.join(" > ");
    this.$$("bc").setHTML(html);
  }
}
```

### 使用方法（TopViewや共通レイアウト内）
```js
cols: [
  { $subview: "breadcrumb" },
  { $subview: true }
]
```

---

## ✅ 改良ポイントと実現方法

### 1. 📌 多言語対応（i18n）

```js
// ラベルを _(key) に変換
const html = path.map(p => _("label." + p)).join(" > ");
```

辞書には：
```js
label: {
  top: "トップ",
  dashboard: "ダッシュボード"
}
```
のように定義。

---

### 2. 🔗 クリック可能なリンク付きパンくず

`template` をHTML構築に変えて以下のように：
```js
const html = path.map((p, i) => {
  const link = "#" + path.slice(0, i + 1).join("/");
  return `<a href='${link}'>${labels[p] || p}</a>`;
}).join(" &gt; ");
```

---

### 3. 🧩 JetView 側でタイトルを持たせて管理（責務の分離）

各ビューに以下を追加：
```js
export default class SettingsView extends JetView {
  getTitle() {
    return "設定";
  }
}
```

パンくず取得側：
```js
async update() {
  const path = this.getUrl();
  const titles = [];
  for (let i = 0; i < path.length; i++) {
    const segment = path.slice(0, i + 1);
    const view = await this.app.getRouter().resolve(segment).then(r => r.view);
    titles.push(view.getTitle?.() || segment.at(-1).page);
  }
  const html = titles.map((t, i) => `<a href='#${path.slice(0, i + 1).map(p => p.page).join("/") }'>${t}</a>`).join(" &gt; ");
  this.$$("bc").setHTML(html);
}
```

---

### 4. 🎨 UIとして Webix の list や toolbar で表示する（非template型）

```js
return {
  view: "toolbar",
  elements: [
    {
      view: "list",
      localId: "bcList",
      autoheight: true,
      borderless: true,
      template: obj => obj.label,
      data: []
    }
  ]
};
```
→ `update()` 時に `this.$$("bcList").parse([...])` でデータ差し替え可能。

---

## ✅ その他考慮点

| 項目 | 説明 |
|------|------|
| パンくずの選択状態 | メニュー連動が不要な場合は選択処理なしでOK |
| ルートが一致しないとき | 存在しないビューには fallback を設けるか、非表示に |
| JetApp の `start` と連携 | 初期ルートに応じてパンくず初期化を忘れずに |
| 深い階層で動的タイトルがある場合 | URLパラメータなどで動的取得が必要な場面も（例：`/project/123`） |

---

## ✅ まとめ

| 実現したいこと | 方法 |
|----------------|------|
| パンくずを表示する | `this.getUrl()` でURLを取得し、ラベルに変換して表示 |
| 多言語対応にしたい | `_()` や i18n辞書を使用 |
| クリック可能にしたい | `<a href>` を組み合わせてHTMLを生成 |
| 各Viewがタイトルを持つ構成にしたい | `getTitle()` を定義してパンくずに活用 |
| listやtoolbar表示にしたい | Webixコンポーネントで構成し、データバインド |

> Webix Jet は URLベースで画面構成が明確なため、パンくずリストも構造的に実装しやすいのが特徴です。用途に応じて柔軟に構成を変えていくことができます。

