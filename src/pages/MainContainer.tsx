import React, { useEffect, useState } from "react";
import { Box, Theme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import Menu from "./menu/Menu";

interface MainContainerProps {
  children: React.ReactNode;
}

const MainContainer: React.FC<MainContainerProps> = ({ children }) => {
  const [activeMenu, setActiveMenu] = useState("Calls");

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
  };
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm"),
  );
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(1280),
  );

  useEffect(() => {
    console.log(isMobile);
  }, [isMobile]);

  return (
    <Box display="flex" flexDirection={isMobile ? "column" : "row"} bgcolor="#FF0">
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
          background: '#FF0'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainContainer;
