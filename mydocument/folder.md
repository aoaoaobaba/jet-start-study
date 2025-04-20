# Webix Jet のフォルダ構成に関する設計ガイド

## 🎯 目的
Webix Jet アプリケーションの構成において、標準的なフォルダ構成（慣習）と、機能ドメイン分割（Feature-based Structure）の考え方と使い分けを整理する。

---

## ✅ 1. Webix Jet サンプルの標準構成（jet-start など）

以下は Webix 公式の `jet-start` サンプルにおける慣習的な構成です：

```plaintext
sources/
├── myapp.js          ← JetApp 初期化
├── views/            ← ルーティングに対応する View クラス群
│   ├── top.js
│   ├── dashboard.js
│   └── ...
├── models/           ← API呼び出しやデータ操作ロジック
├── styles/           ← CSSファイル
├── locales/          ← 多言語辞書ファイル
└── index.html        ← アプリ起点HTML
```

### 🔹 特徴
- 各種コンポーネントが「役割別」に整理されており、小〜中規模では見通しが良い
- `views/` 配下にルーティング対応の View を定義
- `models/` にビジネスロジックやデータ取得処理を分離
- `locales/` や `styles/` なども用途別に配置

### 🔸 注意点
- 機能横断的な整理になるため、機能単位の変更影響が分散しやすい
- 大規模開発や複数人開発では管理が煩雑になる可能性あり

---

## ✅ 2. 機能ドメイン分割（Feature-based Folder Structure）

アプリを「機能・画面単位」で分割し、関連するロジック・UI・辞書などを1つのディレクトリにまとめる方式。

### 🔹 例：
```plaintext
src/
└── features/
    ├── dashboard/
    │   ├── view.js
    │   ├── model.js
    │   ├── style.css
    │   └── locale.js
    ├── users/
    │   ├── list/
    │   │   ├── view.js
    │   │   ├── model.js
    │   │   └── style.css
    │   ├── edit/
    │   │   └── view.js
    │   └── locale.js
    ├── settings/
    │   ├── general/
    │   │   └── view.js
    │   ├── notifications/
    │   │   └── view.js
    │   └── apikeys/
    │       └── view.js
```

### 🔹 Jetでのルーティング対応
```js
const modules = import.meta.glob("./features/**/view.js");
const views = name => modules[`./features/${name}/view.js`]?.().then(x => x.default);
```

### 🔹 実際のView例：`features/users/edit/view.js`
```js
import { JetView } from "webix-jet";
import formStyle from "./style.css";
import { getUserById } from "../model";

export default class UserEditView extends JetView {
  async config() {
    const id = this.getParam("id");
    const user = await getUserById(id);

    return {
      view: "form",
      elements: [
        { view: "text", label: "Name", value: user.name },
        { view: "button", value: "Save" }
      ]
    };
  }
}
```

---

## ✅ 機能ドメイン分割の利点と注意点

| 項目 | 内容 |
|------|------|
| ✅ 見通しの良さ | 機能単位にすべてまとまっているため、把握しやすい |
| ✅ 保守性 | 変更やバグ修正の影響が局所化する |
| ✅ 拡張性 | 新機能追加も既存構成と干渉せずにできる |
| ❗ 検索性の工夫 | `view.js` が複数存在するため、命名工夫が必要（`users.view.js` など） |
| ❗ 命名・ルート設計の一貫性が必要 | URL とフォルダの対応関係をルール化すると迷いが減る |

---

## ✅ 3. ハイブリッド構成の提案

実務では以下のような構成も効果的です：

```plaintext
src/
├── features/         ← 各画面・機能単位での定義（上記構成）
├── shared/           ← 汎用UIコンポーネント（ボタン群など）
├── services/         ← API通信・認証処理など
├── themes/           ← 全体スタイル・カラースキーム
├── locales/          ← グローバル辞書（またはマージ機構）
└── main.js           ← JetApp 起動スクリプト
```

### 🔹 特徴
- **局所最適化と全体最適化の両立**
- **共通処理は shared/services に、個別処理は features に集約**
- **初学者にもわかりやすく、上級者にも柔軟性がある**

---

## ✅ まとめ

| 構成方式 | 適した規模・目的 |
|------------|-----------------|
| 役割別（views/models/styles） | 小〜中規模、学習用、直感的な整理 |
| 機能ドメイン分割（features/xxx） | 中〜大規模、チーム開発、再利用・移植性重視 |
| ハイブリッド型 | 実務向け、共通ロジック・見通しのバランス型構成 |

> プロジェクトの規模・開発体制に応じて最適な構成を選択・カスタマイズすることが重要です。

