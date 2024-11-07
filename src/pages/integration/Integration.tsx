import { Box } from "@mui/material";
import "styles/Integrations.css";
import "./type";
import Status from "./Status";
import { INTEGRATION_STATUS } from "./type";
import SettingIcon from "images/setting1.svg";

type CustomIntegrationProps = {
  imgSrc: string;
  integrationName: string;
  clickFunc: Function;
  status: INTEGRATION_STATUS;
  setting: boolean | undefined;
};

const CustomIntegration: React.FC<CustomIntegrationProps> = ({
  imgSrc,
  integrationName,
  clickFunc,
  status,
  setting,
}) => {
  return (
    <Box display="flex" justifyContent="space-between">
      <Box display="flex" alignItems="center">
        <img src={imgSrc} alt={"logo"} />
        <Box className={"name-cell"}>{integrationName}</Box>
      </Box>
      <Box display="flex" gap={1}>
        {setting === true && status === INTEGRATION_STATUS.CONNECTED ? (
          <button 
            className="integration-btn-setting font-semibold-btn-medium"
            onClick={() => clickFunc()}
          >
            <img
              src={SettingIcon}
              style={{ width: "calc(20 / 16 * 1rem)" }}
              alt="setting1 icon"
            />
          </button>
        ) : null}
        {status === INTEGRATION_STATUS.ACTIVE ? (
          <button
            onClick={() => clickFunc()}
            className="integration-btn-connect font-semibold-btn-medium"
          >
            Connect
          </button>
        ) : (
          status === INTEGRATION_STATUS.CONNECTED ? (
            <Status
              text={ "Connected"}
              status={status}
            />
            // <button
            //   className="integration-status font-semibold-btn-medium connected"
            // >
            //   Connected
            // </button>
          ) : (
            <Status
              text={ "Comming soon"}
              status={status}
            />
          )
        )}
      </Box>
    </Box>
  );
};

export default CustomIntegration;
