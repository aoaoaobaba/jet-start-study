// sources/utils/uiComponents.js
export function createSearchForm(onSearch, options = {}) {
  return {
    view: "form",
    localId: "search",
    elements: [
      {
        cols: [
          {
            view: "text",
            localId: "filterInput",
            placeholder: options.label || "検索",
            on: {
              onTimedKeyPress: function () {
                onSearch(this.getValue());
              },
            },
          },
          {
            view: "button",
            value: "検索",
            css: "webix_primary",
            click: function () {
              onSearch(this.getParentView().getChildViews()[0].getValue());
            },
          },
        ],
      },
    ],
  };
}

export function createControlToolbar(controls) {
  return {
    view: "toolbar",
    elements: controls.map((control) => ({
      view: "button",
      localId: control.localId,
      value: control.label,
      click: control.onClick,
    })),
  };
}

export function createPagedTable(columns, options = {}) {
  return {
    view: "datatable",
    localId: "table",
    id: "table",
    columns,
    pager: {
      view: "pager",
      localId: "pager",
      id: "pager",
      size: options.size || 10,
      group: 5,
      template: "{common.prev()}{common.pages()}{common.next()} 全#count#件",
    },
    select: true,
  };
}
