// 全体用CSSをimport
import "./styles/app.css";
import {JetApp, EmptyRouter, HashRouter, plugins } from "webix-jet";

// 各Viewの動的インポート準備
// （import.meta.globはViteの機能）
const modules = import.meta.glob("./views/**/*.js");
const views = name => modules[`./views/${name}.js`]().then(x => x.default);

// 各言語ファイルの動的インポート準備
const locales = import.meta.glob("./locales/*.js");
const words = name => locales[`./locales/${name}.js`]().then(x => x.default);

// APPクラス
export default class MyApp extends JetApp{
	constructor(config){
		// デフォルト設定
		const defaults = {
			id 		: import.meta.env.VITE_APPNAME,	// HTMLのどこに描画するか（デフォルト：body）
			version : import.meta.env.VITE_VERSION,
			router 	: import.meta.env.VITE_BUILD_AS_MODULE ? EmptyRouter : HashRouter,	// ルーティング
			debug 	: !import.meta.env.PROD,
			start 	: "/top/start",	// 初期画面（/top/start を指定 → views/top/start.jsを探す）
			views	// 動的 import を定義
		};

		// 引数の設定で上書き
		super({ ...defaults, ...config });

		// 多言語対応のためi18n対応のプラグイン（plugins.Locale）を設定
		this.use(plugins.Locale, {
			path: words,
			storage: this.webix.storage.session
		});
	}
}

// 直接HTMLから実行される場合のみ、Jetアプリ（APPクラス）を起動
// （VITE_ で始まる環境変数は、Vite のビルド時に埋め込まれる）
if (!import.meta.env.VITE_BUILD_AS_MODULE){
	webix.ready(() => new MyApp().render() );
}
