import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import DutifyLogo from "images/dutify-logo.png";
import BackIcon from "images/back-icon.svg";
import EndPointProvider from "utils/EndPointProvider";
import axios from "axios";
import Toastify from "utils/Toastify";

const Forgot: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validatePassword = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const result = emailRegex.test(email);
    if (!result) {
      setError("Invalid Email");
    }
    return result;
  };

  const resetPassword = async () => {
    if (!validatePassword()) return;

    let endpoint = EndPointProvider.getAuthEndPoint() + "/reset-password-email";
    try {
      await axios.post(endpoint, { email: email, redirectUri: 'https://dutify.ai/hub/newpwd' });
      Toastify.success("Reset Email Has Been Sent");
    } catch (error: any) {
      Toastify.error("Cannot Send Reset Email");
      console.error("Login error:", error);
    }
  };
  return (
    <div className="forgot-container">
      <div className="wrapper">
        <div className="content">
          <div className="body">
            <img src={DutifyLogo} className="logo" alt="dutify logo"></img>

            <div className="welcome">
              <div className="welcome-container">
                <h1 className="font-bold-h1">
                  Forgot password?
                  <div className="overlay"></div>
                </h1>
              </div>
              <span className="font-regular-big ">
                No worries, we'll send you instruction
              </span>
            </div>
            <form>
              <div className="input-control">
                <label>Email</label>
                <input
                  className={`dutify-input ${error ? "error" : ""}`}
                  type="text"
                  placeholder="your-email@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label className="info error">{error}</label>
              </div>
              <button
                className="dutify-button login-button w-full"
                type="button"
                onClick={() => resetPassword()}
              >
                Reset password
              </button>
            </form>
            <button
              className="dutify-secondary-link"
              onClick={() => {
                navigate("/login");
              }}
            >
              <img
                src={BackIcon}
                className="inline w-[1.25rem] mr-[0.5rem]"
                alt="back"
              />
              Back to log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forgot;
