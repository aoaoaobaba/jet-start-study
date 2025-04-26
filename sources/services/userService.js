/**
 * ユーザーサービス
 */
export default class UserService {
  /**
   * コンストラクタ
   */
  constructor() {
    // ダミーデータ定義
    this.allData = [
      { id: 1, name: "田中" },
      { id: 2, name: "山田" },
      { id: 3, name: "佐藤" },
      { id: 4, name: "鈴木" },
      { id: 5, name: "高橋" },
      { id: 6, name: "伊藤" },
      { id: 7, name: "小林" },
      { id: 8, name: "加藤" },
    ];
  }

  /**
   * 指定された条件のデータを取得（ダミー）
   * @param {*} name 名前
   * @param {*} page ページ数
   * @param {*} size １ページ当たりの件数
   * @returns ページ情報
   */
  async fetch(name = "", page = 1, size = 5) {
    const filtered = this.allData.filter((d) => d.name.includes(name));
    const start = (page - 1) * size;
    const paged = filtered.slice(start, start + size);
    return {
      total: filtered.length,
      data: paged,
    };
  }
}
