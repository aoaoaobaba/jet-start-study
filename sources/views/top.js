import {JetView, plugins} from "webix-jet";

// アプリケーションのトップレベルのビュー
// メニューやナビゲーションバーなどの共通部分を含む
export default class TopView extends JetView{

	// レイアウトを返す
	config(){
		const { _, getLang, setLang } = this.app.getService("locale");

		// ツールバー（多言語対応用）
		var locales = {
			view:"toolbar",
			cols:[
				{ view:"button", value:_("hello"), width: 200 },
				{},
				{ view:"segmented", options:["en", "de"], value: getLang(), width: 200, on:{
					onChange: (value) => setLang(value)
				}}
			]
		};

		var header = {
			type:"header", template:this.app.config.name, css:"webix_header app_header"
		};

		// メニュー（id:"top:menu"）
		var menu = {
			view:"menu", id:"top:menu", 
			css:"app_menu",
			width:180, layout:"y", select:true,
			template:"<span class='webix_icon #icon#'></span> #value# ",
			data:[
				{ value:"Dashboard", id:"start", icon:"wxi-columns" },
				{ value:"Data",		 id:"data",  icon:"wxi-pencil" }
			]
		};

		var ui = {
			type:"clean", paddingX:5, css:"app_layout", cols:[
				{ paddingX:5, paddingY:10, rows: [ {css:"webix_shadow_medium", rows:[header, menu]} ]},
				{ type:"wide", paddingY:10, paddingX:5, rows:[
					{ $subview:true }	// サブビューのプレースホルダー（次のURLセグメントに対応するビューがここに挿入される）
				]}
			]
		};

		return {
			rows:[ locales, ui ]
		};
	}

	// ビュー初期化時
	init(){
		// メニュー（id:"top:menu"）にルーティング機能を自動適用
		this.use(plugins.Menu, "top:menu");
	}
}