import { JetView, plugins } from "webix-jet";
import menuData from "../models/menu.js";

export default class TopView extends JetView {
  config() {
    // ユーザメニュー
    const userPanel = webix.ui({
      view: "sidemenu",
      id: "menu",
      width: 300,
      position: "right",
      // modal: true,
      state: function (state) {
        const toolbarHeight = 64;
        state.top = toolbarHeight;
        state.height -= toolbarHeight;
      },
      css: "user_menu",
      body: {
        view: "list",
        borderless: true,
        scroll: false,
        template: "<span class='webix_icon mdi mdi-#icon#'></span> #value#",
        data: [
          { id: "lang", value: "言語切替", icon: "mdi mdi-translate" },
          { id: "logout", value: "ログアウト", icon: "mdi mdi-logout" },
        ],
        select: true,
        on: {
          onItemClick: function (id) {
            if (id === "lang") {
              webix.message("言語切替処理を実行");
              // this.$scope.app.callEvent("locale:switch");
            } else if (id === "logout") {
              webix.message("ログアウト処理を実行");
              // this.$scope.app.callEvent("user:logout");
            }
            // メニューを閉じる
            this.getTopParentView().hide();
          },
        },
      },
    });

    // ヘッダー
    const pageHeader = {
      height: 64,
      paddingX: 8,
      css: "page_header",
      cols: [
        // ────────────────────── 左エリア ──────────────────────
        {
          rows: [
            // ────────────────────── 左エリア：上段 ──────────────────────
            {
              height: 32,
              cols: [
                // システム情報
                {
                  view: "icon",
                  icon: "mdi mdi-candelabra-fire",
                  css: "app_icon",
                },
                {
                  view: "label",
                  label: "サンプル管理システム",
                  width: 200,
                  css: "app_info",
                },
                {},
                // 日時
                {
                  view: "template",
                  id: "clock",
                  width: 300,
                  css: "datetime",
                  borderless: true,
                  template: () => {
                    const now = webix.Date.dateToStr("%Y/%m/%d %H:%i")(
                      new Date()
                    );
                    return (
                      "<div style='text-align: right; line-height: 20px; margin-top: 8px'><span class='webix_icon wxi-clock'></span>&nbsp;" +
                      now
                    );
                  },
                },
              ],
            },
            // ────────────────────── 左エリア：下段 ──────────────────────
            {
              height: 32,
              cols: [
                {
                  view: "template",
                  id: "screenInfo",
                  template: "ID: NAME",
                  css: "screen_info",
                  width: 400,
                  borderless: true,
                },
                // メニュー
                {
                  view: "menu",
                  id: "top:menu",
                  css: "top_menu",
                  layout: "x",
                  autoWidth: true,
                  select: true,
                  data: menuData,
                  submenuConfig: {
                    width: 200,
                  },
                  template:
                    "<span class='webix_icon #icon#'></span>&nbsp;#value#",
                  type: { subsign: true },
                  gravity: 2,
                },
                { view: "spacer", gravity: 0.01 },
                // ユーザー情報
                {
                  css: "user_info",
                  width: 300,
                  cols: [
                    {
                      view: "icon",
                      icon: "wxi-user",
                      click: function () {
                        if (userPanel.config.hidden) {
                          userPanel.show();
                        } else userPanel.hide();
                      },
                    },
                    {
                      view: "label",
                      label: "A1234567890 山田太郎",
                    },
                  ],
                },
              ],
            },
          ],
        },
        // ────────────────────── 右エリア ──────────────────────
        {
          rows: [
            {},
            {
              view: "button",
              label: "閉じる",
              width: 100,
              align: "left",
              css: "webix_danger",
            },
            {},
          ],
        },
      ],
    };

    // メッセージ
    const pageMessage = {
      view: "label",
      id: "pageMessage",
      label: "ここにメッセージが表示されます。",
      css: "page_message",
      height: 32,
    };

    // const { _, getLang, setLang } = this.app.getService("locale");
    // const locales = {
    //   view: "toolbar",
    //   cols: [
    //     { view: "button", value: _("hello"), width: 200 },
    //     {},
    //     {
    //       view: "segmented",
    //       options: ["en", "de"],
    //       value: getLang(),
    //       width: 200,
    //       on: {
    //         onChange: (value) => setLang(value),
    //       },
    //     },
    //   ],
    // };

    return {
      type: "clean",
      rows: [pageHeader, pageMessage, { $subview: true }],
    };
  }

  /**
   * 初期処理
   */
  init() {
    // グローバルメニュー
    this.use(plugins.Menu, "top:menu");

    // サブビューからのイベント受信：画面変更
    this.on(this.app, "screen:change", (id, title) => {
      // 画面ID、画面タイトルの表示
      this.$$("screenInfo").setHTML(`${id}: ${title}`);
    });

    // サブビューからのイベント受信：メッセージ表示
    this.on(this.app, "message:show", (text, type = "info") => {
      this.showMessage(text, type);
    });
  }

  ready() {
    // webix.ui({
    //   view: "contextmenu",
    //   id: "userMenu",
    //   data: [
    //     { id: "lang", value: "言語切り替え" },
    //     { id: "logout", value: "ログアウト" },
    //   ],
    //   on: {
    //     onMenuItemClick: (id) => {
    //       if (id === "lang") {
    //         webix.message("言語を切り替えます");
    //       } else if (id === "logout") {
    //         webix.message("ログアウトします");
    //       }
    //     },
    //   },
    // });
  }

  /**
   * メッセージ表示
   */
  showMessage(text, type) {
    const label = this.$$("pageMessage");
    const labelNode = label.getNode();

    // メッセージ
    label.define("label", text);

    // typeとcssクラスに対応
    const cssMap = {
      info: "message_info",
      warning: "message_warning",
      error: "message_error",
    };
    // typeからCSS反映
    Object.values(cssMap).forEach((cls) => {
      webix.html.removeCss(labelNode, cls);
    });
    label.define("css", cssMap[type]);

    // 反映
    label.refresh();
  }
}
