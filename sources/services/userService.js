// services/userService.js
export default class UserService {
  async fetch(query, page, size) {
    console.log("Fetching users with:", { query, page, size });
    const data = [
      { id: 1, name: "User 1" },
      { id: 2, name: "User 2" },
      { id: 3, name: "User 3" },
    ].filter((item) => item.name.includes(query));
    return { data, total: data.length };
  }
}
