import { JetView } from "webix-jet";

/**
 * 共通レイアウト
 */
export class BasePageLayout extends JetView {
  constructor(app, config) {
    super(app, config);
    this.content = config.content || {};
  }

  config() {
    return {
      rows: [
        {
          view: "toolbar",
          css: "webix_dark",
          height: 50,
          elements: [
            { view: "label", label: "My Application", width: 200 },
            {
              view: "template",
              borderless: true,
              template: () => {
                const user = this.$scope.app.getState()?.authUser;
                // const user = "tarou";
                return user
                  ? `ようこそ、${user.name} さん`
                  : "ログインしていません";
              },
              autoheight: true,
            },
          ],
        },
        { view: "template", type: "section", template: "検索条件" },
        { $subview: true, name: "search", body: this.content.search },
        { view: "template", type: "section", template: "共通情報" },
        this.content.center || {},
        { view: "template", type: "section", template: "メイン表示" },
        { $subview: true, name: "main", body: this.content.main },
      ],
    };
  }
}
