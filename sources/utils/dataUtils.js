// sources/utils/dataUtils.js
export async function fetchPagedData(service, params, table, pager) {
  try {
    console.log("fetchPagedData:", {
      table: table ? table.config.view : "undefined",
      pager: pager ? pager.config.view : "undefined",
      params,
    });
    if (!table) {
      throw new Error("table is undefined");
    }
    const result = await service(params);
    table.clearAll();
    table.parse(result.data);
  } catch (error) {
    webix.message({ type: "error", text: "データ取得に失敗しました" });
    console.error("fetchPagedData error:", error);
  }
}
