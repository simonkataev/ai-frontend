import React, { useContext, useEffect, useState } from "react";
import "./style.scss";
import CallScreen from "./call/CallScreen";
import { Box, Theme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import EndPointProvider from "utils/EndPointProvider";
import axios from "axios";
import AuthContext from "store/AuthStore";
import Menu from "pages/menu/Menu";
import { useNavigate } from "react-router-dom";
import ClickUpContext from "store/ClickUpStore";

const Calls: React.FC = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Calls");
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(1280)
  );
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const isSmallerScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(1000)
  );
  let authStore = useContext(AuthContext);
  let clickUpStore = useContext(ClickUpContext);
  let [userZoomCalls, setUserZoomCalls] = useState([]);
  let [isLoaded, setIsLoaded] = useState(false);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    if (menu === "Integrations") {
      navigate(`/hub/integration`);
    }
    else if (menu === "Calendars") {
      navigate(`/hub/calendar`);
    }
  };

  async function requestRecordings() {
    let endpoint = EndPointProvider.getEndPoint();
    const token = authStore.token;
    return await axios.get(endpoint + "/usercall/all", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  useEffect(() => {
    if (!clickUpStore.isRequestInProgress) {
      clickUpStore.setIsRequestInProgress(true);
      setIsLoaded(false);
      requestRecordings()
        .then((callRecordings) => {
          clickUpStore.setIsRequestInProgress(false);
          setIsLoaded(true);
          if (userZoomCalls.length === 0 && callRecordings.data.length !== 0) {
            setUserZoomCalls(callRecordings.data);
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status === 401) {
            clickUpStore.setIsRequestInProgress(false);
            navigate("/hub");
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box display="flex" flexDirection={isMobile ? "column" : "row"}>
      <Menu
        onMenuClick={handleMenuClick}
        selectedMenu={activeMenu}
        isMobile={isMobile}
        isSmallScreen={isSmallScreen}
      />
      <Box
        flexGrow={1}
        sx={{
          height: "100%",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            p: isMobile ? 2 : 4,
            pr: isMobile ? 2 : isSmallerScreen ? 4 : isSmallScreen ? 29 : 42,
            ml: isMobile ? 0 : isSmallScreen ? "300px" : "366px",
          }}
        >
          <CallScreen
            isMobile={isMobile}
            userZoomCalls={userZoomCalls}
            isLoaded={isLoaded}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calls;
