// mixins/exportMixin.js
export const ExportMixin = {
  init() {
    if (this.getSubViews().showControls) {
      this.exportButton = this.$$("exportButton");
      this.refreshButton = this.$$("refreshButton");
    }
  },
  exportData() {
    webix.message("データをエクスポートしました");
  },
  refresh() {
    this.state.search.query = "";
    if (this.form) this.form.setValue("");
    this.state.pagination.page = 1;
    this.table.clearAll();
    if (this.pager) {
      this.pager.define("template", "全0件");
      this.pager.refresh();
    }
    this.loadData();
    webix.message("データをリフレッシュしました");
  },
};
