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
    this.isLoading = false; // ループ防止フラグ
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

    // 検索する場合
    if (subViews.enableSearch) {
      // 検索条件
      const searchView = this.$$("search");
      this.form = searchView ? this.$$("filterInput") : null;
      this.table = this.$$("table");
      this.pager =
        subViews.enablePagination !== false ? this.table.getPager() : null;
      // データ取得
      this.loadData();
    }
  }

  getSubViews() {
    throw new Error("getSubViews must be implemented by subclass");
  }

  getService() {
    throw new Error("getService must be implemented by subclass");
  }

  search(query) {
    if (!this.getSubViews().enableSearch) {
      return;
    }
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
    if (!this.getSubViews().enableSearch || this.isLoading) {
      return;
    }
    this.isLoading = true; // ループ防止
    try {
      const {
        search: { query },
        pagination: { page, size },
      } = this.state;
      const service = this.getService();
      await fetchPagedData(
        service,
        { query, page, size },
        this.table,
        this.pager
      );
    } finally {
      this.isLoading = false; // フラグ解除
    }
  }
}
