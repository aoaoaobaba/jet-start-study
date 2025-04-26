// views/app.js
import { JetView } from "webix-jet";

export default class AppView extends JetView {
  config() {
    return {
      rows: [
        {
          view: "toolbar",
          css: "webix_dark",
          height: 50,
          elements: [
            { view: "label", localId: "title", width: 200 },
            {
              view: "template",
              borderless: true,
              template: () => {
                const user = this.app.getService("auth").getUser();
                return user
                  ? `ようこそ、${user.name} さん`
                  : "ログインしていません";
              },
              autoheight: true,
            },
            {
              view: "button",
              value: "ホーム",
              width: 100,
              click: () => this.app.show("/app/top"),
            },
          ],
        },
        { $subview: true, name: "content" },
      ],
    };
  }

  ready() {
    this.app.attachEvent("view:change", (view) => {
      const title = view.getSubViews
        ? view.getSubViews().title
        : "未定義の画面";
      this.$$("title").setValue(title);
    });
    this.app.attachEvent("auth:change", () => this.refresh());
  }
}
