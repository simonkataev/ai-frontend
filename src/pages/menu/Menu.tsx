import React, { useEffect, useState, useContext } from "react";
import { Box } from "@mui/material";
import "./style.scss";
import Burger from "images/burger.svg";
import { useNavigate } from "react-router-dom";
import AuthContext from "store/AuthStore";
import DutifyLogo from "images/dutify-logo.png";
import PersonIcon from "images/person.svg";
import SignOutIcon from "images/SignOut.svg";
import CallIcon from "images/call.svg";
import ActiveCallIcon from "images/active-call.svg";
import SettingIcon from "images/setting.svg";
import ActiveSettingIcon from "images/active-setting.svg";
import CalendarIcon from "images/calendars.svg";
import ActiveCalendarIcon from "images/active-calendars.svg";

interface MenuProps {
  onMenuClick: (menu: string) => void;
  selectedMenu: string;
  isMobile: boolean;
  isSmallScreen: boolean;
}

const Menu: React.FC<MenuProps> = ({
  onMenuClick,
  selectedMenu,
  isMobile,
  isSmallScreen,
}) => {
  const [toggle, setToggle] = useState<boolean>(false);
  const navigate = useNavigate();
  const authStore = useContext(AuthContext);
  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  useEffect(() => {
    if (isMobile) {
      setToggle(false);
    }
  }, [isMobile]);

  const handleLogOut = () => {
    localStorage.clear();
    authStore.removeToken();
    navigate("/hub/login");
  };

  return (
    <Box
      className="menu-container"
      sx={{
        position: "fixed",
        width: isMobile ? "100%" : isSmallScreen ? 300 : "23em",
        minWidth: isMobile ? "100%" : isSmallScreen ? 300 : "23em",
        transition: "all 0.5s",
        height: !isMobile ? "100vh" : toggle ? 360 : 90,
        overflow: "hidden",
        boxShadow:
          isMobile && toggle ? "0px 2px 8px 0px rgba(24, 28, 48, 0.1)" : "",
        backgroundColor: "white",
        borderRight: "1px solid var(--neutral-stroke-color)",
        zIndex: 999,
        borderBottom: "1px solid var(--neutral-stroke-color)",
      }}
    >
      <Box
        pl={isMobile ? 2 : 10.5}
        pt={isMobile ? 4 : 8}
        pb={isMobile ? 2 : 3}
        pr={isMobile ? 2 : 3}
        display="flex"
        justifyContent="space-between"
      >
        <Box height={32} display="flex" alignItems="center">
          <img src={DutifyLogo} width="105px" alt="Logo" />
        </Box>
        {isMobile && (
          <Box
            height={32}
            display="flex"
            alignItems="center"
            sx={{
              cursor: "pointer",
            }}
            onClick={() => setToggle(!toggle)}
          >
            <img src={Burger} alt={"Burger"} />
          </Box>
        )}
      </Box>
      {(!isMobile || toggle) && (
        <Box
          display="flex"
          flexDirection="column"
          gap={isMobile ? 4 : 3.5}
          sx={{ mb: 4 }}
        >
          {/** User logo, logout */}
          <Box
            display="flex"
            flexDirection="column"
            gap={2.5}
            py={3}
            pl={10.5}
            sx={{ borderBottom: "1px solid var(--neutral-stroke-color)" }}
          >
            <Box display="flex" gap={1.5}>
              <img
                src={PersonIcon}
                style={{ width: "2.75em" }}
                alt="person"
              ></img>

              <Box>
                <p
                  className="font-regular-large"
                  style={{ color: "var(--neutral-almost-black-color)" }}
                >
                  {username}
                </p>
                <p
                  className="font-regular-medium"
                  style={{ color: "var(--neutral-body-text-color)" }}
                >
                  {email}
                </p>
              </Box>
            </Box>
            <Box display="flex">
              <img
                src={SignOutIcon}
                style={{ marginRight: "0.5rem" }}
                alt="sign out"
              ></img>
              <button className="dutify-secondary-link" onClick={handleLogOut}>
                Log out
              </button>
            </Box>
          </Box>

          {/** Menu UL */}

          {/** Menu UL */}

          <ul>
            <li
              className={selectedMenu === "Calls" ? "active" : ""}
              onClick={() => {
                onMenuClick("Calls");
              }}
            >
              <img
                src={selectedMenu === "Calls" ? ActiveCallIcon : CallIcon}
                alt="calls"
              ></img>
              <p>Calls</p>
            </li>
            <li
              className={selectedMenu === "Integrations" ? "active" : ""}
              onClick={() => {
                onMenuClick("Integrations");
              }}
            >
              <img
                src={
                  selectedMenu === "Integrations"
                    ? ActiveSettingIcon
                    : SettingIcon
                }
                alt="setting"
              ></img>
              <p>Integrations</p>
            </li>
            <li
              className={selectedMenu === "Calendars" ? "active" : ""}
              onClick={() => {
                onMenuClick("Calendars");
              }}
            >
              <img
                src={
                  selectedMenu === "Calendars"
                    ? ActiveCalendarIcon
                    : CalendarIcon
                }
                alt="schedule"
              ></img>
              <p>Calendar</p>
            </li>
          </ul>
        </Box>
      )}
    </Box>
  );
};

export default Menu;
