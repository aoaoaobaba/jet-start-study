export default [
  {
    id: "search",
    key: "サンプル画面",
    icon: "mdi mdi-home",
    submenu: [
      {
        id: "home_1",
        key: "ダッシュボード",
        icon: "mdi mdi-developer-board",
      },
      { id: "home_2", key: "通知一覧", icon: "mdi mdi-alert-box" },
    ],
  },
  {
    id: "data",
    key: "入力",
    icon: "mdi mdi-pencil",
    submenu: [
      { id: "input_1", key: "申請入力", icon: "mdi mdi-pencil" },
      { id: "input_2", key: "確認入力", icon: "mdi mdi-pencil" },
    ],
  },
  {
    id: "searchList",
    key: "一覧",
    icon: "mdi mdi-pencil",
  },
];
