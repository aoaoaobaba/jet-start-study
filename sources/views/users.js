import { JetView } from "webix-jet";
import { BasePageLayout } from "./layouts/BasePageLayout";
import UserService from "../services/userService";

/**
 * ユーザ一覧画面
 */
export default class UsersView extends JetView {
  /**
   * コンストラクタ
   * @param {*} app
   * @param {*} name
   */
  constructor(app, name) {
    // インスタンス生成
    super(app, name);
    // 画面データを保存するメンバ変数を定義
    this.state = { name: "", page: 1, size: 5 };
  }

  /**
   * 描画コンポーネント
   * @returns
   */
  config() {
    // 検索条件
    const search = new JetView({
      config: () => {
        return {
          cols: [
            { view: "text", localId: "filterInput", label: "名前" },
            {
              view: "button",
              value: "検索",
              width: 100,
              click: async () => {
                this.state.name = this.getSubView("search")
                  .$$("filterInput")
                  .getValue();
                this.state.page = 1;
                await this.loadData();
              },
            },
          ],
        };
      },
    });

    // 真ん中
    const center = {
      template: "検索結果表示中…",
      height: 30,
      css: { "text-align": "right", padding: "8px", color: "#666" },
    };

    // メイン
    const main = new JetView({
      config: () => {
        return {
          rows: [
            {
              view: "datatable",
              localId: "userTable",
              autoheight: true,
              columns: [
                { id: "id", header: "ID", width: 50 },
                { id: "name", header: "名前", fillspace: true },
              ],
              data: [],
            },
            {
              view: "pager",
              localId: "pager",
              size: this.state.size,
              group: 1,
              template: "全0件",
              on: {
                onItemClick: async (id) => {
                  this.state.page = parseInt(id) + 1;
                  await this.loadData();
                },
              },
            },
          ],
        };
      },
    });

    // 共通レイアウト
    return new BasePageLayout(this.app, { content: { search, center, main } });
  }

  /**
   * 描画時の処理
   */
  ready() {
    // ユーザーサービス
    this.app.setService("userService", new UserService());
    // データ取得
    this.loadData();
  }

  /**
   * データ取得
   */
  async loadData() {
    // 保存した画面データを取得
    const { name, page, size } = this.state;
    // ユーザーサービスで、一覧データを取得
    const userService = this.app.getService("userService");
    const result = await userService.fetch(name, page, size);
    // 画面に反映
    const main = this.getSubView("main");
    const table = main.$$("userTable");
    const pager = main.$$("pager");

    table.clearAll();
    table.parse(result.data);
    pager.define("template", `全${result.total}件`);
    pager.refresh();
    pager.config.group = Math.ceil(result.total / size);
  }
}
