import "./styles/app.css";
import { JetApp, EmptyRouter, HashRouter, plugins } from "webix-jet";

// Viewの動的インポート
const modules = import.meta.glob("./views/**/*.js");
const views = (name) => modules[`./views/${name}.js`]().then((x) => x.default);

// 多言語対応
const locales = import.meta.glob("./locales/*.js");
const words = (name) =>
  locales[`./locales/${name}.js`]().then((x) => x.default);

export default class MyApp extends JetApp {
  constructor(config) {
    const defaults = {
      id: import.meta.env.VITE_APPNAME,
      name: import.meta.env.VITE_APPNAME,
      version: import.meta.env.VITE_VERSION,
      router: import.meta.env.VITE_BUILD_AS_MODULE ? EmptyRouter : HashRouter,
      debug: !import.meta.env.PROD,
      start: "/top/start",
      views,
    };

    super({ ...defaults, ...config });

    // 多言語対応プラグイン
    this.use(plugins.Locale, {
      path: words,
      storage: this.webix.storage.session,
      lang: "ja",
    });
  }
}

if (!import.meta.env.VITE_BUILD_AS_MODULE) {
  webix.ready(() => new MyApp().render());
}
