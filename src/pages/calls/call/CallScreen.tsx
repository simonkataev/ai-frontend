import { Collapse } from "antd";
import UserZoomCallData from "./UserZoomCallData";
import ProcessedSign from "./ProcessedSign";
import TimeUtil from "utils/TimeUtil";
import "styles/Main.css";
import "./style.scss";
import { Box, CircularProgress } from "@mui/material";
import ClockIcon from "images/clock.svg";
import ClickUpIcon from "images/clickup.png";
import JiraIcon from "images/jira.png";
import AirtableIcon from "images/airtable.png";
import CaretDownIcon from "images/caret-down.svg";
import CaretDownCollapseIcon from "images/caret-down-collapse.svg";

interface PanelHeaderProps {
  userZoomCall: any;
  isMobile: boolean;
}

const PanelHeader: React.FC<PanelHeaderProps> = ({
  userZoomCall,
  isMobile,
}) => {
  let recording = userZoomCall.call.recordings[0];
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column-reverse" : "row",
        padding: 0,
      }}
      ml={0.5}
    >
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        alignItems={isMobile ? "left" : "center"}
        mr={2}
        gap={1}
      >
        <div style={{ display: "flex" }}>
          <img
            src={userZoomCall.clickupList ? ClickUpIcon : userZoomCall.jiraCloudId ? JiraIcon : userZoomCall.airtableBaseId ? AirtableIcon : ClockIcon}
            style={{
              width: "calc(20 / 16 * 1rem)",
              marginRight: 4,
            }}
            alt="carot icon"
          />
          <p className="call-datetime font-regular-big">
            {TimeUtil.dateToTime(new Date((recording as any).createdAt))}{" "}
            {TimeUtil.dateToYMD(new Date((recording as any).createdAt))}
          </p>
        </div>
        <p className="call-title font-medium-capt-large">
          {(recording as any).referenceV4}
        </p>
      </Box>
    </Box>
  );
};

type CallScreenProps = {
  isMobile: boolean;
  userZoomCalls: any[];
  isLoaded: boolean;
};

const CallScreen: React.FC<CallScreenProps> = ({
  isMobile,
  userZoomCalls,
  isLoaded,
}) => {
  return (
    <Box mt={6.875}>
      <h2 className="integration-header font-bold-h2">Your Calls</h2>
      {isLoaded && (
        <Box
          sx={{
            mt: 3.125,
          }}
          style={{ paddingBottom: "1vh" }}
        >
          {
            <Collapse
              expandIconPosition={"start"}
              expandIcon={({ isActive }) => (
                <div
                  style={{
                    width: 24,
                    height: 24,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={isActive ? CaretDownIcon : CaretDownCollapseIcon}
                    style={{ width: "calc(16 / 16 * 1rem)" }}
                    alt="caret icon"
                  ></img>
                </div>
              )}
              style={{
                width: "100%",
                border: "none",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {userZoomCalls
                .filter((usz: any) => usz.call.recordings.length > 0)
                .sort(
                  (a, b) =>
                    new Date(
                      (b as any).call.recordings[0].createdAt
                    ).getTime() -
                    new Date(
                      (a as any).call.recordings[0].createdAt
                    ).getTime()
                )
                .map((userZoomCall) => (
                  <Collapse.Panel
                    style={{
                      boxShadow: "0px 4px 24px 0px #9A9A9A14",
                      borderRadius: "calc(12 / 16 * 1em)",
                      padding: "calc(24 / 16 * 1em)",
                      border: "1px solid var(--neutral-stroke-color)",
                    }}
                    key={"" + (userZoomCall as any).id}
                    header={
                      <PanelHeader
                        userZoomCall={userZoomCall}
                        isMobile={isMobile}
                      />
                    }
                    extra={
                      <ProcessedSign
                        processed={
                          ((userZoomCall as any).call.recordings[0] as any)
                            .processed
                        }
                      />
                    }
                  >
                    <Box>
                      <UserZoomCallData
                        userZoomCall={userZoomCall}
                        isMobile={isMobile}
                      />
                    </Box>
                  </Collapse.Panel>
                ))}
            </Collapse>
          }
        </Box>
      )}
      {!isLoaded && (
        <Box className={"flex-column-container"}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default CallScreen;
