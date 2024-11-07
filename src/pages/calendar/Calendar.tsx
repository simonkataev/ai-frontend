import React, { useState } from "react";
import "./style.scss";
import { Box, Theme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Menu from "pages/menu/Menu";
import { useNavigate } from "react-router-dom";
import CalendarScreen from "./calendar/CalendarScreen";

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("Calendars");
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(1280)
  );
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    if (menu === "Integrations") {
      navigate(`/hub/integration`);
    }
    else if (menu === "Calls") {
      navigate(`/hub/call`);
    }
  };

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
            ml: isMobile ? 0 : isSmallScreen ? "300px" : "366px"
          }}
        >
          <CalendarScreen
            isMobile={isMobile}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar;
