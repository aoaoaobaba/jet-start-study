// myapp.js
import { JetApp, HashRouter, EmptyRouter } from "webix-jet";
import UserService from "./services/userService";
import AuthService from "./services/authService";

// Viewの動的インポート準備
const modules = import.meta.glob("./views/**/*.js");
const views = (name) => modules[`./views/${name}.js`]().then((x) => x.default);

export default class MyApp extends JetApp {
  constructor(config) {
    const defaults = {
      id: import.meta.env.VITE_APPNAME, // HTMLのどこに描画するか（デフォルト：body）
      version: import.meta.env.VITE_VERSION,
      router: import.meta.env.VITE_BUILD_AS_MODULE ? EmptyRouter : HashRouter, // ルーティング
      debug: !import.meta.env.PROD,
      start: "/app/users",
      views, // view
    };
    super({ ...defaults, ...config });
    this.setService("userService", new UserService());
    this.setService("auth", new AuthService());
  }
}

if (!import.meta.env.VITE_BUILD_AS_MODULE) {
  webix.ready(() => {
    new MyApp().render();
  });
}
