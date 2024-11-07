import { makeAutoObservable } from "mobx";
import { createContext } from "react";

class AuthStore {
  token: string | null = localStorage.getItem("authToken");
  userId: string | null = localStorage.getItem("userId");
  email: string | null = localStorage.getItem("email");

  constructor() {
    makeAutoObservable(this);
  }

  setToken(token: string) {
    this.token = token;
  }

  removeToken() {
    this.token = null;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  removeUserId() {
    this.userId = null;
  }

  setEmail(email: string) {
    this.email = email;
  }

  removeEmail() {
    this.email = null;
  }
}

const AuthContext = createContext(new AuthStore());
AuthContext.displayName = "AuthContext";
export default AuthContext;
