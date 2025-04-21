# Webix Jet 複数画面テンプレートと状態管理の統一設計ガイド

## 🎯 目的
複数画面に共通するレイアウト（検索欄＋一覧）を再利用可能にし、状態（検索条件・ページネーションなど）を一元管理する構成を Webix Jet 上で実現する方法をまとめる。

---

## ✅ 1. 複数画面テンプレート構成（GenericListPage）

複数の画面（例：ユーザー一覧、製品一覧、案件一覧）で、以下のような構成を共通化：

```
[ 検索エリア ]
[ 一覧データ表示 ]
```

### 🔹 GenericListPage テンプレート
```js
// shared/layouts/GenericListPage.js
import { JetView } from "webix-jet";

export default class GenericListPage extends JetView {
  constructor(searchView, listView) {
    super();
    this._searchView = searchView;
    this._listView = listView;
  }

  config() {
    return {
      rows: [
        { view: this._searchView },
        { view: "resizer" },
        { view: this._listView }
      ];
    };
  }
}
```

### 🔹 利用例（ユーザー一覧画面）
```js
import GenericListPage from "../../shared/layouts/GenericListPage";

export default class UsersPage extends GenericListPage {
  constructor() {
    super(
      {
        view: "form",
        elements: [
          { view: "text", name: "name", label: "ユーザー名" },
          { view: "button", value: "検索" }
        ]
      },
      {
        view: "datatable",
        columns: [
          { id: "id", header: "ID" },
          { id: "name", header: "名前" }
        ],
        url: "/api/users"
      }
    );
  }
}
```

---

## ✅ 2. 状態管理の一体化（ストアの活用）

画面ごとの状態（検索条件・ページネーションなど）を `store` モジュールで管理する。

### 🔹 ストア定義（例：userStore）
```js
// stores/userStore.js
let state = {
  filters: {
    name: "",
    status: ""
  },
  pagination: {
    page: 1,
    pageSize: 20
  }
};

export const getUserState = () => ({ ...state });
export const updateUserState = (updates) => {
  state = { ...state, ...updates };
};
```

### 🔹 検索フォームで使用
```js
import { getUserState, updateUserState } from "../../stores/userStore";

export default {
  view: "form",
  elements: [
    {
      view: "text",
      name: "name",
      label: "ユーザー名",
      value: getUserState().filters.name
    },
    {
      view: "button",
      value: "検索",
      click() {
        const filters = this.getFormView().getValues();
        updateUserState({ filters });
        this.$scope.app.callEvent("user:searchUpdated");
      }
    }
  ]
};
```

### 🔹 一覧表示ビューで使用
```js
import { getUserState } from "../../stores/userStore";

export default class UsersList extends JetView {
  config() {
    return {
      view: "datatable",
      columns: [...],
      url: () => this.loadData()
    };
  }

  init(view) {
    this.on(this.app, "user:searchUpdated", () => {
      view.clearAll();
      view.load(() => this.loadData());
    });
  }

  loadData() {
    const { filters } = getUserState();
    return webix.ajax().get("/api/users", filters);
  }
}
```

---

## ✅ 3. 状態をページ遷移後にも保持する

`webix.storage.local` または `session` を用いることで、アプリ内のページ遷移後にも状態を維持可能。

```js
webix.storage.session.put("userFilters", filters);
const filters = webix.storage.session.get("userFilters") || {};
```

---

## ✅ 4. 状態管理の応用パターン例

### 🔸 ログイン状態（セッション管理）
```js
// stores/authStore.js
let auth = { user: null };
export const setUser = (u) => { auth.user = u; webix.storage.local.put("user", u); };
export const getUser = () => auth.user || webix.storage.local.get("user");
```

### 🔸 タブの選択状態
```js
let tabState = { active: "summary" };
export const setTab = tab => tabState.active = tab;
export const getTab = () => tabState.active;
```

### 🔸 カート情報（配列型）
```js
let cart = [];
export const addToCart = item => cart.push(item);
export const getCart = () => [...cart];
export const clearCart = () => cart = [];
```

### 🔸 ページネーション
```js
let paging = { page: 1, size: 20 };
export const setPage = p => paging.page = p;
export const getPage = () => paging.page;
export const getPaging = () => ({ ...paging });
```

---

## ✅ まとめ

| 実現内容 | 方法 |
|----------|------|
| 検索＋一覧レイアウトを共通テンプレート化 | `GenericListPage` を継承して構成差し替え |
| 検索状態などを一元管理 | ストアモジュール（get/set）による外部管理 |
| 状態更新→画面更新の連携 | `app.callEvent()` / `this.on(...)` でビュー間通信 |
| 遷移後の状態維持 | `webix.storage` を活用し保存・再利用 |
| 応用（ログイン・カート等） | 状況に応じた store の分割と永続化設計 |

> この構成により、Webix Jet アプリをより再利用性・拡張性・保守性の高い設計へと進化させることができます。

