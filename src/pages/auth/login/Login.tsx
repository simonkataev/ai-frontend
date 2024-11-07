import React, { useContext, useState } from "react";
import axios from "axios";
import AuthContext from "store/AuthStore";
import EndPointProvider from "utils/EndPointProvider";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import LoginLogoImg from "images/login_logo.png";
import DutifyLogoImg from "images/dutify-logo.png";
import EyeIcon from "images/eye.svg";
import EyeSlashIcon from "images/eye-slash.svg";
import GoogleIcon from "images/google.svg";
import MicrosoftIcon from "images/microsoft.svg";

interface LoginProps {
  onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [loginError, setLoginError] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const authStore = useContext(AuthContext);

  const validateCredential = () => {
    const nameResult = username.length > 0;

    if (!nameResult) {
      setNameError("Invalid Username");
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*\d).{8,}$/;
    const pwdResult = passwordRegex.test(password);
    if (!pwdResult) {
      setPwdError(
        "Password at least 8 characters containing at least one lowercase, one digit"
      );
    }
    return nameResult && pwdResult;
  };

  const login = async () => {
    let endpoint = EndPointProvider.getAuthEndPoint() + "/login";
    if (!validateCredential()) return;
    try {
      const response = await axios.post(endpoint, { username, password });
      if (response.status === 200) {
        const token = response.data.token;
        const userId = response.data.user_id;
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", userId);
        authStore.setToken(token);
        authStore.setUserId(userId);
        onLoginSuccess();
        localStorage.setItem("username", username);
        const headers = {
          headers: { Authorization: `Bearer ${token}` },
        };
        axios
          .get(EndPointProvider.getEndPoint() + "/user/current", headers)
          .then((respon) => {
            const email =respon.data.email;
            localStorage.setItem("email", email);
            authStore.setEmail(email);
            navigate("/hub/call");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error: any) {
      setPwdError("");
      setNameError(error.response.data);
      setLoginError(true);
      console.error("Login error:", error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://keycloak.dutify.ai/realms/dutify/protocol/openid-connect/auth?client_id=dutify-client&response_type=code&redirect_uri=https://dutify.ai/hub/call&scope=openid&state=random123&nonce=nonce456&kc_idp_hint=google";
  };

  const handleMicrosoftLogin = () => {
    window.location.href = "https://keycloak.dutify.ai/realms/dutify/protocol/openid-connect/auth?client_id=dutify-client&response_type=code&redirect_uri=https://dutify.ai/hub/call&scope=openid&state=random123&nonce=nonce456&kc_idp_hint=microsoft";
  };

  return (
    <div className="login-container">
      <div className="wrapper">
        <img src={LoginLogoImg} className="splash" alt="login logo"></img>
        <div className="content">
          <div className="body">
            <div className="header">
              <img
                src={DutifyLogoImg}
                className="logo"
                alt="dutify logo "
              ></img>

              <div className="welcome">
                <div className="welcome-container">
                  <h1 className="font-bold-h1">
                    Welcome back!
                    <div className="overlay"></div>
                  </h1>
                </div>
                <span className="font-regular-big">
                  Please enter your details
                </span>
              </div>
            </div>
            <div className="inputdata">
              <div>
                <div className="input-control">
                  <label>Username</label>
                  <input
                    className={`dutify-input ${nameError ? "error" : ""}`}
                    type="text"
                    placeholder="your-email@gmail.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label className="info error">{nameError}</label>
                </div>
                <div className="input-control">
                  <label>Password</label>
                  <div className="relative">
                    <input
                      className={`dutify-input password-input ${
                        loginError || pwdError ? "error" : ""
                      }`}
                      type={showPassword ? "text" : "password"}
                      placeholder="your-email@gmail.com"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="btn-visibility"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      <img
                        src={EyeIcon}
                        className={showPassword ? "" : "active"}
                        alt="eye icon"
                      ></img>
                      <img
                        src={EyeSlashIcon}
                        className={showPassword ? "active" : ""}
                        alt="eye slash icon"
                      ></img>
                    </button>
                  </div>
                  <label className="info error">{pwdError}</label>
                </div>
                <div className="flex justify-between">
                  <label className="check-container">
                    Remember Me
                    <input type="checkbox" id="remeber_me" />
                    <span className="login-label"></span>
                  </label>
                  <button
                    type="button"
                    className="dutify-link"
                    onClick={() => {
                      navigate("/hub/forgot");
                    }}
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>
              <div className="flex flex-col">
                <button
                  className="dutify-button login-button"
                  type="button"
                  onClick={() => {
                    login();
                  }}
                >
                  Login
                </button>
                <button className='flex h-12 mt-2 px-3 py-2 justify-center items-center gap-2 self-stretch rounded border border-[#CECEEA]' onClick={() => {handleGoogleLogin()}}>
                  <img src={GoogleIcon} className='w-4' alt='' />
                  <p className='text-[#3B4163] text-16 font-medium'>Log in with Google</p>
                </button>
                <button className='flex h-12 mt-2 px-3 py-2 justify-center items-center gap-2 self-stretch rounded border border-[#CECEEA]' onClick={() => {handleMicrosoftLogin()}}>
                  <img src={MicrosoftIcon} className='w-4' alt='' />
                  <p className='text-[#3B4163] text-16 font-medium'>Log in with Microsoft</p>
                </button>
              </div>
            </div>
          </div>
          <div className="footer mt-4">
            <span className="font-regular-big">
              Don&apos;t have an account?
            </span>
            <button
              className="dutify-link"
              onClick={() => {
                navigate("/hub/signup");
              }}
            >
              Sign up now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
