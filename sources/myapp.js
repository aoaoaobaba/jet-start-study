// 全体用CSSをimport
import "./styles/app.css";
import { JetApp, EmptyRouter, HashRouter, plugins } from "webix-jet";

// 言語ファイルの動的インポート準備（import.meta.globはViteの機能）
const locales = import.meta.glob("./locales/*.js");
const words = (name) =>
  locales[`./locales/${name}.js`]().then((x) => x.default);

// Viewの動的インポート準備
const modules = import.meta.glob("./views/**/*.js");
const views = (name) => modules[`./views/${name}.js`]().then((x) => x.default);

/**
 * APPクラス
 */
export default class MyApp extends JetApp {
  /**
   * コンストラクタ
   * @param {*} config アプリケーション設定
   */
  constructor(config) {
    // デフォルト設定
    const defaults = {
      id: import.meta.env.VITE_APPNAME, // HTMLのどこに描画するか（デフォルト：body）
      version: import.meta.env.VITE_VERSION,
      router: import.meta.env.VITE_BUILD_AS_MODULE ? EmptyRouter : HashRouter, // ルーティング
      debug: !import.meta.env.PROD,
      start: "/users", // 初期画面
      views, // view
    };

    // インスタンス生成（引数のアプリケーション設定を優先）
    super({ ...defaults, ...config });

    // 多言語対応プラグイン（plugins.Locale）を、appに設定
    this.use(plugins.Locale, {
      path: words,
      storage: this.webix.storage.session,
    });
  }
}

// 直接HTMLから実行される場合のみ、Jetアプリ（APPクラス）を起動
// （VITE_ で始まる環境変数は、Vite のビルド時に埋め込まれる）
if (!import.meta.env.VITE_BUILD_AS_MODULE) {
  webix.ready(() => {
    new MyApp().render();
  });
}
