export default [
  {
    id: "search",
    value: "サンプル画面",
    icon: "mdi mdi-home",
    submenu: [
      {
        id: "home_1",
        value: "ダッシュボード",
        icon: "mdi mdi-developer-board",
      },
      { id: "home_2", value: "通知一覧", icon: "mdi mdi-alert-box" },
    ],
  },
  {
    id: "data",
    value: "入力",
    icon: "mdi mdi-pencil",
    submenu: [
      { id: "input_1", value: "申請入力", icon: "mdi mdi-pencil" },
      { id: "input_2", value: "確認入力", icon: "mdi mdi-pencil" },
    ],
  },
];
