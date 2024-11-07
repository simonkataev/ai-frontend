import React from "react";
import "./style.scss";
import { INTEGRATION_STATUS } from "./type";

type StatusProps = {
  text: string;
  status: INTEGRATION_STATUS;
};

const Status: React.FC<StatusProps> = ({ text, status }) => {
  return (
    <div className="integration-status">
      <p
        className={
          "font-semibold-btn-medium" +
          (status === INTEGRATION_STATUS.CONNECTED ? " connected" : " inactive")
        }
      >
        {text}
      </p>
    </div>
  );
};

export default Status;
