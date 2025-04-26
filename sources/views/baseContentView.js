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

    layout.push(
      { view: "resizer", height: 5 },
      { localId: "main", ...subViews.main }
    );

    return { rows: layout };
  }

  init() {
    const subViews = this.getSubViews();
    if (subViews.enableSearch) {
      this.form = this.$$("filterInput");
      this.table = this.$$("table");
      if (subViews.enablePagination !== false) {
        this.pager = this.$$("pager");
      }
    }
  }

  ready() {
    if (this.getSubViews().enableSearch) {
      this.loadData();
    }
    this.app.callEvent("view:change", [this]);
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
    if (
      !this.getSubViews().enableSearch ||
      this.getSubViews().enablePagination === false
    )
      return;
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
  }
}
