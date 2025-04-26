// views/users.js
import BaseContentView from "./baseContentView";
import { ExportMixin } from "../mixins/exportMixin";
import { createControlToolbar, createPagedTable } from "../utils/uiComponents";

export default class UsersView extends BaseContentView {
  constructor(app, name) {
    super(app, name);
    Object.assign(this, ExportMixin);
    this.state.search.query = this.state.search.name || "";
  }

  getSubViews() {
    return {
      title: "ユーザー一覧",
      enableSearch: true,
      searchOptions: { label: "名前" },
      showCenter: true,
      center: {
        template: "検索結果表示中…",
        height: 30,
        css: { "text-align": "right", padding: "8px", color: "#666" },
      },
      showControls: true,
      controls: createControlToolbar([
        {
          localId: "exportButton",
          label: "エクスポート",
          onClick: () => this.exportData(),
        },
        {
          localId: "refreshButton",
          label: "更新",
          onClick: () => this.refresh(),
        },
      ]),
      enablePagination: true,
      main: createPagedTable(
        [
          { id: "id", header: "ID", width: 50 },
          { id: "name", header: "名前", fillspace: true },
        ],
        {
          size: this.state.pagination.size,
          onPageChange: (id) => this.setPage(parseInt(id) + 1),
        }
      ),
    };
  }

  getService() {
    return this.app
      .getService("userService")
      .fetch.bind(
        null,
        this.state.search.query,
        this.state.pagination.page,
        this.state.pagination.size
      );
  }
}
