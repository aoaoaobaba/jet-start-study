// utils/uiComponents.js
export function createSearchForm(onSearch, options = {}) {
  return {
    cols: [
      {
        view: "text",
        localId: options.inputId || "filterInput",
        label: options.label || "検索",
      },
      { view: "button", value: "検索", width: 100, click: onSearch },
    ],
  };
}

export function createControlToolbar(buttons = []) {
  return {
    view: "toolbar",
    elements: buttons.map((btn) => ({
      view: "button",
      localId: btn.localId,
      value: btn.label,
      click: btn.onClick,
    })),
  };
}

export function createPagedTable(columns, options = {}) {
  return {
    rows: [
      {
        view: "datatable",
        localId: "table",
        autoheight: true,
        columns,
        data: [],
      },
      {
        view: "pager",
        localId: "pager",
        size: options.size || 5,
        group: 1,
        template: "全0件",
        on: {
          onItemClick: options.onPageChange,
        },
      },
    ],
  };
}

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
