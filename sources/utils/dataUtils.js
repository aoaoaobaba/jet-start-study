// sources/utils/dataUtils.js
export async function fetchPagedData(service, params, table, pager) {
  try {
    if (!table) {
      throw new Error("table is undefined");
    }
    const result = await service(params);
    table.clearAll();
    table.parse(result.data);
    if (pager && result.total) {
      pager.define({
        count: result.total,
        size: params.size,
        page: params.page - 1,
      });
      pager.refresh();
    }
  } catch (error) {
    webix.message({ type: "error", text: "データ取得に失敗しました" });
    console.error("fetchPagedData error:", error);
  }
}
