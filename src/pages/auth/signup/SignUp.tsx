import React, { useState } from "react";
import "./style.scss";
import axios from "axios";
import EndPointProvider from "utils/EndPointProvider";
import { useNavigate } from "react-router-dom";
import DutifyLogo from "images/dutify-logo.png";
import LoginImg from "images/login_logo.png";
import EyeIcon from "images/eye.svg";
import EyeSlashIcon from "images/eye-slash.svg";
import GoogleIcon from "images/google.svg";
import MicrosoftIcon from "images/microsoft.svg";
import Toastify from "utils/Toastify";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const validateCredential = () => {
    const nameResult = username.length > 0;

    if (!nameResult) {
      setNameError("Invalid Username");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailResult = emailRegex.test(email);
    if (!emailResult) {
      setEmailError("Invalid Email");
    } else {
      setEmailError("");
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*\d).{8,}$/;
    const pwdResult = passwordRegex.test(password);
    if (!pwdResult) {
      setPwdError(
        "Password at least 8 characters containing at least one lowercase, one digit"
      );
    } else {
      setPwdError("");
    }

    return nameResult && emailResult && pwdResult;
  };

  const signup = async () => {
    if (!validateCredential()) return;

    let endpoint = EndPointProvider.getAuthEndPoint();
    try {
      await axios.post(endpoint + "/register", {
        username,
        password,
        email,
        firstName: 'Simon',
        lastName: 'Kataev',
        redirectUri: 'https://dutify.ai/hub/verify'
      });
      await axios.post(`${endpoint}/send-verify-email`, {email: email, redirectUri: "https://dutify.ai/hub/verify"});
      Toastify.success("Verify Email Has Been Sent!");
    } catch (error) {
      Toastify.error("Cannot Send Verify Email");
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
    <div className="signup-container">
      <div className="wrapper">
        <img src={LoginImg} className="splash" alt="login logo"></img>
        <div className="content">
          <div className="body">
            <div className="header">
              <img src={DutifyLogo} className="logo" alt="dutify logo"></img>

              <div className="welcome">
                <div className="welcome-container">
                  <h1 className="font-bold-h1">
                    Let's get started
                    <div className="overlay"></div>
                  </h1>
                </div>
                <span className="font-regular-big">
                  Please enter your details
                </span>
              </div>
            </div>
            <div className="inputData">
              <div>
                <div className="input-control">
                  <label>Username</label>
                  <input
                    className={`dutify-input ${nameError ? "error" : ""}`}
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <label className="info error">{nameError}</label>
                </div>
                <div className="input-control">
                  <label>Email</label>
                  <input
                    className={`dutify-input ${emailError ? "error" : ""}`}
                    type="text"
                    placeholder="your-email@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label className="info error">{emailError}</label>
                </div>
                <div className="input-control">
                  <label>Password</label>
                  <div className="relative">
                    <input
                      className={`dutify-input password-input ${
                        pwdError ? "error" : ""
                      }`}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
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
                        alt="eye"
                      ></img>
                      <img
                        src={EyeSlashIcon}
                        className={showPassword ? "active" : ""}
                        alt="eye slash"
                      ></img>
                    </button>
                  </div>
                  <label className="info error">{pwdError}</label>
                </div>
                <div className="flex">
                  <label className="check-container">
                    <input type="checkbox" id="remeber_me" />
                    <span className="login-label"></span>
                  </label>
                  <p>
                    Creating on account means you're key with{" "}
                    <button
                      type="button"
                      className="dutify-link"
                      onClick={() => {}}
                    >
                      Terms of Services
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="dutify-link"
                      onClick={() => {}}
                    >
                      Privacy Policy
                    </button>
                  </p>
                </div>
              </div>
              <div className="flex flex-col">
                <button
                  className="dutify-button login-button"
                  type="button"
                  onClick={() => {
                    signup();
                  }}
                >
                  Sign up
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
            <span className="font-regular-big">Already have an account?</span>
            <button
              className="dutify-link"
              onClick={() => {
                navigate("/hub/login");
              }}
            >
              Log in now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
