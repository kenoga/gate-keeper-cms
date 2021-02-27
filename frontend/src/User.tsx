import * as util from "./util";
class User {
  isLoggedIn = () => {
    console.log("isLoggedIn called!");
    return this.get("isLoggedIn") === "true";
  };

  isAdmin = () => {
    return this.get("isAdmin") === "true";
  };

  set = (key: string, value: any) => localStorage.setItem(key, value);

  get = (key: string) => this.getLocalStorage(key);

  getLocalStorage = (key: string) => {
    const ret = localStorage.getItem(key);
    if (ret) {
      return ret;
    }
    return null;
  };

  login = async () => {
    this.set("isLoggedIn", true);
    return true;
  };

  logout = async () => {
    if (this.isLoggedIn()) {
      this.set("isLoggedIn", false);
    }
    util.fetchPost("/api/logout", {}).then((response) => {
      console.log(response.json());
    });
    document.cookie = "session_key=; max-age=0";
    window.location.reload();
  };
}

export default new User();
