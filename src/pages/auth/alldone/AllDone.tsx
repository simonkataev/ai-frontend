import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";
import DutifyLogo from "images/dutify-logo.png";

const AllDone: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="alldone-container">
      <div className="wrapper">
        <div className="content">
          <div className="body">
            <img src={DutifyLogo} className="logo" alt="dutify logo"></img>

            <div className="welcome">
              <div className="welcome-container">
                <h1 className="font-bold-h1">
                  All done
                  <div className="overlay"></div>
                </h1>
              </div>
              <span className="font-regular-big ">
                Your password has been successfully changed.
              </span>
            </div>

            <button
              className="dutify-button login-button w-[19.5rem] max-w-[360px] sm:w-full"
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

export default AllDone;
