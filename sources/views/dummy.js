// views/dummy.js
import { JetView } from "webix-jet";

export default class DummyView extends JetView {
  config() {
    return {
      view: "template",
      template:
        "<div style='padding: 20px; font-size: 24px;'>Dummy View: テスト表示</div>",
    };
  }

  ready() {
    console.log("DummyView loaded");
  }
}
