import { JetView } from "webix-jet";

export default class SearchView extends JetView {
  // 画面情報
  static SCREEN_ID = "PG001";
  static SCREEN_TITLE_KEY = "page1_title";

  config() {
    // 検索条件
    const condition = {
      view: "form",
      id: "searchForm",
      css: "search_form",
      scroll: "y",
      height: 240,
      padding: 8,
      borderless: true,
      elementsConfig: {
        labelPosition: "top",
        width: 200,
        bottomPadding: 16,
        invalidMessage: "正しい値を入力してください",
      },
      elements: [
        {
          margin: 8,
          view: "flexlayout",
          cols: [
            {
              view: "text",
              label: "タイトル",
              width: 400,
              required: true,
              name: "search:book_name",
            },
            {
              view: "text",
              label: "著者名",
              width: 300,
              name: "search:author",
            },
          ],
        },
        {
          margin: 8,
          view: "flexlayout",
          cols: [
            {
              view: "text",
              label: "出版者",
              width: 200,
              required: true,
              name: "search:publisher",
            },
            {
              view: "text",
              label: "出版日",
              width: 200,
              name: "search:publication_year",
            },
            {
              view: "text",
              label: "ISBN",
              width: 200,
              name: "search:isbn",
            },
            {
              view: "text",
              label: "資料区分",
              width: 200,
              name: "search:div",
            },
            {
              view: "text",
              label: "形態区分",
              width: 200,
              required: true,
              name: "search:type",
            },
          ],
        },
        {
          view: "flexlayout",
          margin: 8,
          cols: [
            {},
            {
              view: "button",
              value: "クリア",
              width: 100,
              click: () => {
                const form = this.$$("searchForm");
                form.clearValidation();
                this.app.callEvent("message:show", ["クリアしました"]);
              },
            },
            {
              view: "button",
              value: "検索",
              width: 100,
              css: "webix_primary",
              click: () => {
                const form = this.$$("searchForm");
                if (!form.validate()) {
                  this.app.callEvent("message:show", ["検索条件NG!", "error"]);
                  return;
                }
                this.app.callEvent("message:show", ["検索条件OK！"]);
              },
            },
          ],
        },
      ],
    };

    // メイン
    const main = {
      view: "form",
      id: "mainForm",
      css: "main_form",
      scroll: "y",
      gravity: 1,
      padding: 8,
      borderless: true,
      elementsConfig: {
        labelPosition: "top",
        width: 200,
        bottomPadding: 16,
        invalidMessage: "正しい値を入力してください",
      },
      elements: [
        {
          margin: 8,
          view: "flexlayout",
          cols: [
            {
              view: "text",
              label: "タイトル",
              width: 408,
              required: true,
              name: "search:book_name",
            },
            {
              view: "text",
              label: "著者名",
              width: 408,
              name: "search:author",
            },
          ],
        },
        {
          margin: 8,
          view: "flexlayout",
          cols: [
            {
              view: "text",
              label: "出版者",
              required: true,
              name: "search:publisher",
            },
            {
              view: "text",
              label: "出版日",
              name: "search:publication_year",
            },
            {
              view: "text",
              label: "ISBN",
              name: "search:isbn",
            },
            {
              view: "text",
              label: "資料区分",
              required: true,
              name: "search:div",
            },
            {
              view: "text",
              label: "形態区分",
              required: true,
              name: "search:type",
            },
            {
              view: "text",
              label: "項目",
            },
            {
              view: "text",
              label: "項目",
            },
            {
              view: "text",
              label: "項目",
            },
            {
              view: "text",
              label: "項目",
            },
            {
              view: "text",
              label: "項目",
            },
            {
              view: "text",
              label: "項目",
            },
            {
              view: "text",
              label: "項目",
            },
            {
              view: "text",
              label: "項目",
            },
          ],
        },
      ],
    };

    // ボタン
    const actionButtons = {
      view: "layout",
      padding: 8,
      margin: 8,
      height: 56,
      borderless: true,
      cols: [
        {},
        {
          view: "button",
          value: "キャンセル",
          width: 120,
          click: () => {
            const form = this.$$("mainForm");
            form.clearValidation();
            this.app.callEvent("message:show", ["キャンセルしました"]);
          },
        },
        {
          view: "button",
          value: "保存",
          width: 100,
          css: "webix_primary",
          click: () => {
            const form = this.$$("mainForm");
            if (!form.validate()) {
              this.app.callEvent("message:show", ["登録NG!", "error"]);
              return;
            }
            this.app.callEvent("message:show", ["登録OK！"]);
          },
        },
      ],
    };

    return {
      rows: [condition, { view: "resizer" }, main, actionButtons],
    };
  }

  init() {
    // 親ビューへ「画面ID・画面名」を通知
    // const _ = this.app.getService("locale")._ || ((v) => v);
    // this.app.callEvent("screen:change", [
    //   SearchView.SCREEN_ID,
    //   _(SearchView.SCREEN_TITLE_KEY),
    // ]);
    this.app.callEvent("screen:change", ["SAMPLE-01", "検索画面サンプル"]);
  }
}
