import React from "react";
import "./style.scss";
import { CALL_STATUS } from "./type";

type StatusProps = {
  type: CALL_STATUS;
};

const STATUS_DATA: {
  [key in CALL_STATUS]: {
    color: string;
    bgcolor: string;
    text: string;
  };
} = {
  [CALL_STATUS.PROCESSING]: {
    color: "var(--tags-blue-color)",
    bgcolor: "var(--tags-trans-blue-color)",
    text: "processing",
  },
  [CALL_STATUS.READY]: {
    color: "var(--tags-green-color)",
    bgcolor: "var(--tags-trans-green-color)",
    text: "ready",
  },
};
const Status: React.FC<StatusProps> = ({ type }) => {
  return (
    <p
      className="calls-status font-semibold-btn-medium"
      style={{
        color: STATUS_DATA[type].color,
        background: STATUS_DATA[type].bgcolor,
      }}
    >
      {STATUS_DATA[type].text}
    </p>
  );
};

export default Status;
