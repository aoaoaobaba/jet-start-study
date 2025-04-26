// utils/dataUtils.js
export async function fetchPagedData(service, params, table, pager) {
  try {
    webix.ui.showProgress(table);
    const result = await service(params);
    table.clearAll();
    table.parse(result.data);

    const totalTemplate = `全${result.total}件`;
    if (pager.config.template !== totalTemplate) {
      pager.define("template", totalTemplate);
      pager.refresh();
    }
    const newGroup = Math.ceil(result.total / params.size);
    if (pager.config.group !== newGroup) {
      pager.define("group", newGroup);
      pager.refresh();
    }
  } catch (error) {
    webix.message({ type: "error", text: "データ取得に失敗しました" });
    console.error(error);
  } finally {
    webix.ui.hideProgress();
  }
}
