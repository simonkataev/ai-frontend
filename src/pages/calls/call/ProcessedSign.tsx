import React from "react";
import "styles/Main.css";
import Status from "./Status";
import { CALL_STATUS } from "./type";

interface ProcessedSignProps {
  processed: boolean;
}

const ProcessedSign: React.FC<ProcessedSignProps> = ({ processed }) => {
  return (
    <Status type={processed ? CALL_STATUS.READY : CALL_STATUS.PROCESSING} />
  );
};

export default ProcessedSign;
