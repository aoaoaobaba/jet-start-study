// views/baseContentView.js
import { JetView } from "webix-jet";
import { createSearchForm } from "../utils/uiComponents";
import { fetchPagedData } from "../utils/dataUtils";

export default class BaseContentView extends JetView {
  constructor(app, name) {
    super(app, name);
    this.state = {
      search: { query: "" },
      pagination: { page: 1, size: 5 },
    };
  }

  config() {
    const subViews = this.getSubViews();
    const layout = [];

    if (subViews.enableSearch) {
      layout.push({
        localId: "search",
        ...createSearchForm(() => this.search(), subViews.searchOptions || {}),
      });
    }

    if (subViews.showCenter) {
      layout.push({ localId: "center", ...subViews.center });
    }

    if (subViews.showControls) {
      layout.push({ localId: "controls", ...subViews.controls });
    }

    layout.push({ view: "resizer", height: 5 }, subViews.main);

    return { rows: layout };
  }

  init() {
    // 空に
  }

  ready() {
    const subViews = this.getSubViews();
    if (subViews.enableSearch) {
      const searchView = this.getRoot().queryView({ localId: "search" });
      this.form = searchView
        ? searchView.queryView({ localId: "filterInput" })
        : null;
      this.table = this.getRoot().queryView({ localId: "table" });
      this.pager =
        subViews.enablePagination !== false
          ? this.getRoot().queryView({ id: "pager" })
          : null;

      console.log("BaseContentView ready:", {
        form: this.form ? this.form.config.view : "undefined",
        table: this.table ? this.table.config.view : "undefined",
        pager: this.pager ? this.pager.config.view : "undefined",
      });

      if (!this.form || !this.table) {
        console.error("form or table is undefined");
        return;
      }
      if (subViews.enablePagination !== false && !this.pager) {
        console.warn("pager is undefined, proceeding without pagination");
      }
      this.loadData();
    }
    // view:change をコメントアウト（暴走防止）
    // this.app.callEvent("view:change", [this]);
  }

  getSubViews() {
    throw new Error("getSubViews must be implemented by subclass");
  }

  getService() {
    throw new Error("getService must be implemented by subclass");
  }

  search(query) {
    if (!this.getSubViews().enableSearch) return;
    this.state.search.query = query;
    this.state.pagination.page = 1;
    this.loadData();
  }

  setPage(page) {
    if (
      !this.getSubViews().enableSearch ||
      this.getSubViews().enablePagination === false
    )
      return;
    this.state.pagination.page = page;
    this.loadData();
  }

  async loadData() {
    if (!this.getSubViews().enableSearch) return;
    const {
      search: { query },
      pagination: { page, size },
    } = this.state;
    const service = this.getService();
    console.log("loadData:", {
      table: this.table ? this.table.config.view : "undefined",
      pager: this.pager ? this.pager.config.view : "undefined",
    });
    await fetchPagedData(
      service,
      { query, page, size },
      this.table,
      this.pager
    );
  }
}
