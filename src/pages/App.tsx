import React, { useState, useEffect, useContext } from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import Login from "./auth/login/Login";
import SignUp from "./auth/signup/SignUp";
import Forgot from "./auth/forgot/Forgot";
import "styles/App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import EndPointProvider from "utils/EndPointProvider";
import AuthContext from "store/AuthStore";
import axios from "axios";
import Toastify from "utils/Toastify";
import AuthService from "service/authService";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signed from "./auth/signed/Signed";
import Calls from "./calls/Calls";
import Integrations from "./integration/Integrations";
import Calendar from "./calendar/Calendar";
import NewPassword from "pages/auth/new_password/NewPassword";
import AllDone from "pages/auth/alldone/AllDone";
import Verify from "./auth/verify/Verify";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#e6d6e9", // Another color in your gamma
    },
  },
  typography: {
    fontFamily: "Mona Sans",
    button: {
      textTransform: "none",
      height: "48px",
      maxHeight: "48px",
      minHeight: "48px",
      boxShadow: "0px 4px 16px 0px rgba(185, 121, 249, 0.32)",
    },
    body1: {
      fontSize: "1em",
    },
    body2: {
      fontSize: "14px",
    },
    h3: {
      fontSize: "28px",
      fontWeight: 600,
    },
    h6: {
      fontSize: "18px",
      fontWeight: 600,
      lineHeight: "20px",
    },
  },
});

const App: React.FC = () => {
  const windowUrl = window.location.search;
  const params = new URLSearchParams(windowUrl);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const authStore = useContext(AuthContext);

  console.log("Code", params.get("code"));
  const endpoint = EndPointProvider.getEndPoint() + "/clickup/oauth/token";
  const code = params.get("code");
  const state = params.get("state");
  let isClickUpRelocation = false;
  let isKeyCloakLogin = false;
  if(state==='random123') {
    isKeyCloakLogin = true;
  } else { isKeyCloakLogin = code !== null; }

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      let authService = new AuthService(authStore);
      authService
        .getProtectedStatus()
        .then((response) => {
          if (response === 401) {
            setIsAuthenticated(false);
          }
        })
        .catch((e) => {
          if (e.response.status === 401) {
            setIsAuthenticated(false);
          } else {
            console.log(e);
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isClickUpRelocation) {
      const fetchData = async () => {
        try {
          const response = await axios.post(
            endpoint,
            {
              code: code,
            },
            {
              headers: {
                Authorization: `Bearer ${authStore.token}`,
              },
            }
          );
          if (response.status === 200) {
            const location = EndPointProvider.getPageEndPoint();
            window.location.href = location || '';
            Toastify.success("Successfully connected to ClickUp");
          } else {
            Toastify.error("Failed to obtain ClickUp token");
          }
        } catch (error) {
          Toastify.error("Failed to obtain ClickUp token");
        }
      };
      fetchData();
    }
    else if(isKeyCloakLogin) {
      const loginWithCode = async () => {
        let endpoint = EndPointProvider.getEndPoint() + "/auth/login/code";
        try {
          const response = await axios.post(endpoint, { authCode: code, redirectUri: "https://dutify.ai/hub/call" });
          if (response.status === 200) {
            const token = response.data.token;
            const userId = response.data.user_id;
            localStorage.setItem("authToken", token);
            localStorage.setItem("userId", userId);
            authStore.setToken(token);
            authStore.setUserId(userId);
            const headers = {
              headers: { Authorization: `Bearer ${token}` },
            };
            axios
              .get(EndPointProvider.getEndPoint() + "/user/current", headers)
              .then((respon) => {
                const email =respon.data.email;
                localStorage.setItem("email", email);
                authStore.setEmail(email);
                setIsAuthenticated(true);
                Toastify.success("Login Successfully");
              })
              .catch((error) => {
                console.log(error);
                Toastify.success("Login Failed");
              });
          }
        } catch (error: any) {
          Toastify.success("Login Failed");
        }
      };
      loginWithCode();
    }
  }, [isClickUpRelocation, isKeyCloakLogin, code, authStore, endpoint]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const PrivateRoute = ({ children }: { children: any }) => {
    if (authStore.token && isAuthenticated) {
      return children;
    }
    return <Navigate to="/hub/login" />;
  };

  const BaseRoute = ({ children }: { children: any }) => {
    const token = localStorage.getItem("authToken");
    if (authStore.token && authStore.token === token && isAuthenticated) {
      return <Navigate to="/hub/call" />;
    }
    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Navigate to="/hub" />} />
          <Route path="/hub">
            <Route
              path=""
              element={
                <BaseRoute>
                  <Login onLoginSuccess={handleLoginSuccess} />
                </BaseRoute>
              }
            />
            <Route
              path="call"
              element={
                <PrivateRoute>
                  <Calls />
                </PrivateRoute>
              }
            />
            <Route
              path="integration"
              element={
                <PrivateRoute>
                  <Integrations />
                </PrivateRoute>
              }
            />
            <Route
              path="calendar"
              element={
                <PrivateRoute>
                  <Calendar />
                </PrivateRoute>
              }
            />
            <Route
              path="login"
              element={
                <BaseRoute>
                  <Login onLoginSuccess={handleLoginSuccess} />
                </BaseRoute>
              }
            />
            <Route path="signup" element={<SignUp />} />
            <Route path="signed" element={<Signed />} />
            <Route path="forgot" element={<Forgot />} />
            <Route path="newpwd" element={<NewPassword />} />
            <Route path="done" element={<AllDone />} />
            <Route path="verify" element={<Verify />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
