import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import DutifyLogo from "images/dutify-logo.png";

const Signed: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="signed-container">
      <div className="wrapper">
        <div className="content">
          <div className="body">
            <img src={DutifyLogo} className="logo" alt="dutify logo"></img>

            <div className="welcome">
              <div className="welcome-container">
                <h1 className="font-bold-h1">
                  Thanks for registration!
                  <div className="overlay"></div>
                </h1>
              </div>
              <span className="font-regular-big ">
                Your account has been succesfully created.
              </span>
            </div>

            <button
              className="dutify-button login-button w-[19.5rem]"
              type="button"
              onClick={() => {
                navigate("/hub/login");
              }}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signed;
