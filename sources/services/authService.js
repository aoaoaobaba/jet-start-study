// services/authService.js
export default class AuthService {
  constructor() {
    this.user = { name: "Tarou" }; // 初期ユーザー
  }

  getUser() {
    return this.user;
  }

  setUser(user) {
    this.user = user;
    // 状態変更を通知（ビューでリフレッシュ可能）
    webix.event("auth:change", user);
  }
}
