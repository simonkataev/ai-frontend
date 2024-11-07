import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import DutifyLogo from "images/dutify-logo.png";
import EyeIcon from "images/eye.svg";
import EyeSlashIcon from "images/eye-slash.svg";
import BackIcon from "images/back-icon.svg";
import EndPointProvider from "utils/EndPointProvider";
import axios from "axios";
import Toastify from "utils/Toastify";

const NewPassword: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pwdError, setPwdError] = useState('');

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string>('');

  const validateCredential = () => {

    if(password!==confirmPassword){
      setPwdError('Passwords do not match');
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*\d).{8,}$/;
    const pwdResult = passwordRegex.test(password);
    if (!pwdResult) {
      setPwdError('Password at least 8 characters containing at least one lowercase, one digit');
    }

    return pwdResult;
  };

  const resetPassword = async () => {
    if (!validateCredential()) {
      return;
    }
    setPwdError('');
    
    let endpoint = EndPointProvider.getAuthEndPoint() + "/reset-password";
    try{
      await axios.post(endpoint, {newPassword: password, token: token ? token : ''}, {params: {newPassword: password, token: token ? token : ''}});
      navigate('/done');
    } catch(error) {
      Toastify.error("This Link is Invalid or Expired");
      setPwdError('');
    }
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(new URL(currentUrl).search);
    const urlToken = urlParams.get('key');

    setToken(urlToken ? urlToken : '');
  }, []);

  return (
    <div className="forgot-container">
      <div className="wrapper">
        <div className="content">
          <div className="body">
            <img src={DutifyLogo} className="logo" alt="dutify logo"></img>

            <div className="welcome">
              <div className="welcome-container">
                <h1 className="font-bold-h1">
                  Set new password
                  <div className="overlay"></div>
                </h1>
              </div>
              <span className="font-regular-big ">
                Must be at least 8 characters
              </span>
            </div>
            <form>
              <div className="input-control">
                <label>Password</label>
                <div className="relative">
                  <input
                    className={`dutify-input password-input ${
                      pwdError ? 'error' : ''
                    }`}
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
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

              <div className="input-control">
                <label>Confirm Password</label>
                <div className="relative">
                  <input
                    className="dutify-input password-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    className="btn-visibility"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    <img
                      src={EyeIcon}
                      className={showConfirmPassword ? "" : "active"}
                      alt="eye"
                    ></img>
                    <img
                      src={EyeSlashIcon}
                      className={showConfirmPassword ? "active" : ""}
                      alt="eye slash"
                    ></img>
                  </button>
                </div>
              </div>
              <button
                className="dutify-button login-button w-full"
                type="button"
                onClick={resetPassword}
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
                alt="back icon"
              />
              Back to log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
