

class User {
  static async me() {
   
    return {
      id: 1,
      name: "John Doe",
      email: "user@example.com",
      created_date: "2024-01-01"
    };
  }

  static async loginWithRedirect() {
    console.log("Mock login redirect");
    return Promise.resolve();
  }
}

export default User;