import React, { useState, useEffect, useContext } from "react";
import CustomIntegration from "./Integration";
import clickupLogo from "images/clickup.svg";
import jiraLogo from "images/jira.svg";
import airtableLogo from "images/airtable.png"
import asanaLogo from "images/Asana.svg";
import trelloLogo from "images/trello.svg";
import calendarLogo from "images/calendar.svg";
import emailLogo from "images/email.svg";
import slackLogo from "images/slack.svg";
import confluenceLogo from "images/confluence.svg";
import notionLogo from "images/notion.svg";
import googleLogo from "images/google.svg";
import teamsLogo from "images/teams.svg";
import "styles/Integrations.css";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Box, Theme, CircularProgress } from "@mui/material";
import Menu from "pages/menu/Menu";
import { useNavigate } from "react-router-dom";
import EndPointProvider from "utils/EndPointProvider";
import AuthContext from "store/AuthStore";
import ClickUpContext from "store/ClickUpStore";
import "./style.scss";
import { INTEGRATION_STATUS } from "./type";
import ClickUpSettingModal from "./modals/ClickUpSetting";
import JiraSettingModal from "./modals/JiraSetting";
import AirtableSettingModal from "./modals/AirtableSetting";
import EmailSettingModal from "./modals/EmailSetting";
import { Modal, Select } from "antd";
import Toastify from "utils/Toastify";
import JiraContext from "store/JiraStore";
import EmailContext from "store/EmailStore";
import UserService from "service/userService";
import AirtableContext from "store/AirtableStore";
import SettingService from "service/settingService";
import JiraService from "service/jiraService";

// type UserIntegration = {
//   integrationSystem: string;
//   accessToken: string;
// };

interface Option {
  value: string;
  label: string;
}

type PreferredOptionsState = Option[];

const Integrations: React.FC = () => {
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(1280)
  );
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm")
  );
  const endpoint: string = EndPointProvider.getEndPoint() + "/user/integration";
  const currentEmail = localStorage.getItem('email');
  const authStore = useContext(AuthContext);
  const airtableStore = useContext(AirtableContext);
  const clickUpStore = useContext(ClickUpContext);
  const jiraStore = useContext(JiraContext);
  const jiraService = new JiraService(authStore);
  const emailStore = useContext(EmailContext);
  const userService = new UserService(authStore);
  const settingService = new SettingService(authStore);
  let [isLoaded, setIsLoaded] = useState(false);
  const [clickUpData, setClickUpData] = useState({
    useSelectedList: false,
    selectedWorkspace: null,
    selectedSpace: null,
    selectedFolder: null,
    selectedList: null,
  });
  const [airtableData, setAirtableData] = useState({
    useSelectedList: false,
    selectedBase: null,
    selectedTable: null
  });
  const [jiraData, setJiraData] = useState({
    useSelectedList: false,
    selectedCloud: null,
    selectedProject: null,
    selectedList: null,
  });
  const [emailData, setEmailData] = useState({
    autoApply: false,
    domain: null,
  });
  const [isClickUpModalOpen, setIsClickUpModalOpen] = useState(false);
  const [isJiraModalOpen, setIsJiraModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isAirtableModalOpen, setIsAirtableModalOpen] = useState(false);


  const onClickUpSetting = () => {
    setIsClickUpModalOpen(true);
  }

  const onAirtableSetting = () => {
    setIsAirtableModalOpen(true);
  }

  const onJiraSetting = () => {
    setIsJiraModalOpen(true);
  }

  const onSlackSetting = () => {

  }

  const onAirtableConnect = () => {
    window.location.replace(
      `https://dutify.ai/atbl/airtable/authenticate?user_id=${authStore.userId}`
    );
  };
  const onClickUpConnect = () => {
    const clientId = "PUF01QPJUCHBJEHZ4XHDSTJ14WEHX839";
    let redirectUri;
    if (process.env.REACT_APP_LOCAL_START) {
      redirectUri = "http://localhost:9002";
    } else {
      redirectUri = process.env.REACT_APP_HUBENDPOINT;
    }
    window.location.replace(
      `https://app.clickup.com/api?client_id=${clientId}&redirect_uri=${redirectUri}`
    );
  };
  const onJiraConnect = () => {
    // const clientId = "IZvWABvu2y1QnBJzKZn2yZA04HU8SU9z"; // dutify-test-app
    const clientId = "BKOtzeMuyHFIlpeZtOAMak3hvtr6wE5K";
    let redirectUri;
    if (process.env.REACT_APP_LOCAL_START) {
      redirectUri = "http://localhost:9002";
    } else {
      // redirectUri = "https://dutify.ai/hub";
      redirectUri = "http://localhost:9002";
    }

    window.location.replace(`https://auth.atlassian.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=offline_access%20write:jira-work%20read:jira-work%20read:jira-user%20manage:jira-webhook%20manage:jira-data-provider%20manage:jira-configuration%20manage:jira-project&response_type=code`);
  };
  const onAsanaConnect = () => {};
  const onTrelloConnect = () => {};
  const onCalendarConnect = () => {};
  const onEmailConnect = () => {
    setIsEmailModalOpen(true);
  };
  const onSlackConnect = () => {
    const customerEmail = currentEmail;
    window.location.replace(`https://slack.com/oauth/v2/authorize?client_id=6872623246135.7040990822659&scope=app_mentions:read,channels:history,channels:read,chat:write,chat:write.public,emoji:read,groups:history,im:history,im:read,im:write,incoming-webhook,links:read,mpim:history,reactions:read,users.profile:read,users:read,reactions:write,commands&redirect_uri=https://dutify.ai/api/slack/oauth/redirect&user_scope=&state=${customerEmail}`);
  };
  const onConfluenceConnect = () => {};
  const onNotionConnect = () => {};
  const onGoogleConnect = () => {};

  const [preferredOptions, setPreferredOptions] = useState<PreferredOptionsState>([]);
  const [preferredIntegration, setPreferredIntegration] = useState({
    dateFormat: 'US',
    timeFormat: '12',
    preferredIntegrationSystem: null
  });
  const [IntegrationData, setIntegrationData] = useState([
    {
      title: "Task Systems",
      data: [
        {
          logo: clickupLogo,
          name: "ClickUp",
          func: onClickUpConnect,
          status: INTEGRATION_STATUS.ACTIVE,
          setting: true
        },
        {
          logo: airtableLogo,
          name: "Airtable",
          func: onAirtableConnect,
          status: INTEGRATION_STATUS.ACTIVE,
          setting: true
        },
        {
          logo: jiraLogo,
          name: "Jira",
          func: onJiraConnect,
          status: INTEGRATION_STATUS.ACTIVE,
        },
        {
          logo: asanaLogo,
          name: "Asana",
          func: onAsanaConnect,
          status: INTEGRATION_STATUS.INACTIVE,
        },
        {
          logo: trelloLogo,
          name: "Trello",
          func: onTrelloConnect,
          status: INTEGRATION_STATUS.INACTIVE,
        },
      ],
    },
    {
      title: "Communications",
      data: [
        {
          logo: teamsLogo,
          name: "Teams",
          func: onEmailConnect,
          status: INTEGRATION_STATUS.INACTIVE,
        },
        {
          logo: slackLogo,
          name: "Slack",
          func: onSlackConnect,
          status: INTEGRATION_STATUS.ACTIVE,
        },
        {
          logo: emailLogo,
          name: "Email",
          func: onEmailConnect,
          status: INTEGRATION_STATUS.ACTIVE,
          setting: true,
        },
      ],
    },
    {
      title: "Calendar",
      data: [
        {
          logo: calendarLogo,
          name: "Google Calendar",
          func: onCalendarConnect,
          status: INTEGRATION_STATUS.INACTIVE,
        },
      ],
    },

    {
      title: "Knowledge Base",
      data: [
        {
          logo: confluenceLogo,
          name: "Confluence",
          func: onConfluenceConnect,
          status: INTEGRATION_STATUS.INACTIVE,
        },
        {
          logo: notionLogo,
          name: "Notion",
          func: onNotionConnect,
          status: INTEGRATION_STATUS.INACTIVE,
        },
        {
          logo: googleLogo,
          name: "Google",
          func: onGoogleConnect,
          status: INTEGRATION_STATUS.INACTIVE,
        },
      ],
    },
  ]);

  useEffect(() => {

    userService
      .getIntegrations()
      .then((data : any) => {
        if(data != null)
        {
          let isClickupConnected = false;
          let isJiraConnected = false;
          let isAirtableConnected = false;
          let isSlackConnected = false;

          data.forEach((item:any) => {
            if (item.integrationSystem === "AIRTABLE") isAirtableConnected = true;
            else if (item.integrationSystem === "CLICKUP") isClickupConnected = true;
            else if (item.integrationSystem === "ATLASSIAN") isJiraConnected = true;
            else if (item.integrationSystem === "SLACK") isSlackConnected = true;
          });

          if(isAirtableConnected) {
            settingService
            .getAirtableIntegration()
            .then((data: any) => {
              if(data != null) {
      
                setAirtableData({
                  useSelectedList: data.data.useSelectedList,
                  selectedBase: data.data.selectedBase,
                  selectedTable: data.data.selectedTable
                })
                airtableStore.isSelectedListConfirmed = data.useSelectedList;
                setIsLoaded(true);
              }
            })
            setPreferredOptions(prevState => {
              const exists = prevState.some(item => item.value === 'Airtable');
              return exists
                  ? prevState
                  : [...prevState, { value: 'Airtable', label: 'Airtable' }];
            });
            setIntegrationData(prevState => 
              prevState.map(category => 
                category.title === "Task Systems"
                  ? {
                      ...category,
                      data: category.data.map(integration => 
                        integration.name === "Airtable"
                          ? { ...integration, status: INTEGRATION_STATUS.CONNECTED, func: onAirtableSetting }
                          : integration
                      ),
                    }
                  : category
              )
            );
          }

          if(isClickupConnected) {
            settingService
            .getClickUpIntegration()
            .then((data: any) => {
              if(data != null) {
                setClickUpData({
                  useSelectedList: data.data.useSelectedList,
                  selectedWorkspace: data.data.selectedWorkspace,
                  selectedSpace: data.data.selectedSpace,
                  selectedFolder: data.data.selectedFolder,
                  selectedList: data.data.selectedList,
                })
                clickUpStore.isSelectedListConfirmed = data.useSelectedList;
                setIsLoaded(true);
              }
            })
            setPreferredOptions(prevState => {
              const exists = prevState.some(item => item.value === 'ClickUp');
              return exists
                  ? prevState
                  : [...prevState, { value: 'ClickUp', label: 'ClickUp' }];
            });
            setIntegrationData(prevState => 
              prevState.map(category => 
                category.title === "Task Systems"
                  ? {
                      ...category,
                      data: category.data.map(integration => 
                        integration.name === "ClickUp"
                          ? { ...integration, status: INTEGRATION_STATUS.CONNECTED, func: onClickUpSetting }
                          : integration
                      ),
                    }
                  : category
              )
            );
          }

          if(isJiraConnected) {
            jiraService
            .getSettingIntegration()
            .then((data: any) => {
              if(data != null) {
      
                setJiraData({
                  useSelectedList: data.data.useSelectedList,
                  selectedCloud: data.data.selectedCloud,
                  selectedProject: data.data.selectedProject,
                  selectedList: data.data.selectedList,
                })
                jiraStore.isSelectedListConfirmed = data.useSelectedList;
                setIsLoaded(true);
              }
            })
            setPreferredOptions(prevState => {
              const exists = prevState.some(item => item.value === 'Jira');
              return exists
                  ? prevState
                  : [...prevState, { value: 'Jira', label: 'Jira' }];
            });
            setIntegrationData(prevState => 
              prevState.map(category => 
                category.title === "Task Systems"
                  ? {
                      ...category,
                      data: category.data.map(integration => 
                        integration.name === "Jira"
                          ? { ...integration, status: INTEGRATION_STATUS.CONNECTED, func: onJiraSetting }
                          : integration
                      ),
                    }
                  : category
              )
            );
          }

          if(isSlackConnected) {
            setIntegrationData(prevState => 
              prevState.map(category => 
                category.title === "Communications"
                  ? {
                      ...category,
                      data: category.data.map(integration => 
                        integration.name === "Slack"
                          ? { ...integration, status: INTEGRATION_STATUS.CONNECTED, func: onSlackSetting }
                          : integration
                      ),
                    }
                  : category
              )
            );
          }
          
        }
      })

    settingService
    .getEmailIntegration()
    .then((data: any) => {
      if(data != null) {

        setEmailData({
          autoApply: data.data.autoApply,
          domain: data.data.domain
        })
        emailStore.autoApply = data.autoApply;
        setIntegrationData(prevState => 
          prevState.map(category => 
            category.title === "Communications"
              ? {
                  ...category,
                  data: category.data.map(integration => 
                    integration.name === "Email"
                      ? { ...integration, status: INTEGRATION_STATUS.CONNECTED }
                      : integration
                  ),
                }
              : category
          )
        );
        setIsLoaded(true);
      }
    })

    settingService
    .getPreferredIntegration()
    .then((data: any) => {
      if(data != null) {
        setPreferredIntegration(data.data);
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStore.token, endpoint]);

  const mobileCSS = {
    // bgcolor: "white",
    borderRadius: "14px",
    width: "100%",
    boxShadow: "0px 2px 8px 0px rgba(24, 28, 48, 0.1)",
  };
  const [activeMenu, setActiveMenu] = useState("Integrations");
  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
    if (menu === "Calls") {
      navigate(`/hub/call`);
    }
    else if (menu === "Calendars") {
      navigate(`/hub/calendar`);
    }
  };

  const handleClickUpOk = async () => {
    try {
      settingService.updateClickUpIntegration({
        useSelectedList : clickUpStore.isSelectedListConfirmed,
        selectedWorkspace : clickUpStore.selectedWorkSpaceId,
        selectedSpace : clickUpStore.selectedSpaceId,
        selectedFolder : clickUpStore.selectedFolderId,
        selectedList : clickUpStore.selectedListId
      }).then((response: any) => {
        setClickUpData({
          useSelectedList: clickUpStore.isSelectedListConfirmed,
          selectedWorkspace: clickUpStore.selectedWorkSpaceId,
          selectedSpace: clickUpStore.selectedSpaceId,
          selectedFolder: clickUpStore.selectedFolderId,
          selectedList: clickUpStore.selectedListId,
        })
        Toastify.success("Set the clickup setting integration successfully.");
        setIsClickUpModalOpen(false);
      })
    } catch (error: any) {
      Toastify.error("Error setting user setting integrations");
      console.error("Error fetching user integrations:", error);
      setIsClickUpModalOpen(false);
    }
  };

  const handleAirtableOk = async () => {
    try {
      settingService.updateAirtableIntegration({
        useSelectedList : airtableStore.isSelectedListConfirmed,
        selectedBase : airtableStore.selectedBaseId,
        selectedTable : airtableStore.selectedTableId
      }).then((response: any) => {
        setAirtableData({
          useSelectedList: airtableStore.isSelectedListConfirmed,
          selectedBase: airtableStore.selectedBaseId,
          selectedTable: airtableStore.selectedTableId,
        })
        Toastify.success("Set the airtable setting integration successfully.");
        setIsAirtableModalOpen(false);
      })
    } catch (error: any) {
      Toastify.error("Error setting user setting integrations");
      console.error("Error fetching user integrations:", error);
      setIsAirtableModalOpen(false);
    }
  };

  const handleClickUpCancel = () => {
    setClickUpData((prev) => ({...prev}));
    setIsClickUpModalOpen(false);
  };

  const handleAirtableCancel = () => {
    setClickUpData((prev) => ({...prev}));
    setIsAirtableModalOpen(false);
  };

  const handleJiraOk = async () => {
    try {
      jiraService.updateSettingIntegration({
        useSelectedList : jiraStore.isSelectedListConfirmed,
        cloudId : jiraStore.selectedCloudId,
        projectId : jiraStore.selectedProjectId,
        listId : jiraStore.selectedListId
      })
      .then((response: any) => {
        setJiraData({
          useSelectedList: jiraStore.isSelectedListConfirmed,
          selectedCloud: jiraStore.selectedCloudId,
          selectedProject: jiraStore.selectedProjectId,
          selectedList: jiraStore.selectedListId,
        })
        Toastify.success("Set the Jira setting integration successfully.");
        setIsJiraModalOpen(false);
      })
    } catch (error: any) {
      Toastify.error("Error setting user setting integrations");
      console.error("Error fetching user integrations:", error);
      setIsJiraModalOpen(false);
    }
  };
  
  const handleJiraCancel = () => {
    setJiraData((prev) => ({...prev}));
    setIsJiraModalOpen(false);
  };

  const handleEmailOk = async () => {
    try {
      settingService.updateEmailIntegration({
        domain : emailStore.domain,
        autoApply : emailStore.autoApply
      })
      .then((response: any) => {
        setEmailData({
          autoApply: emailStore.autoApply,
          domain: emailStore.domain,
        })
        Toastify.success("Set the Email setting integration successfully.");
        setIntegrationData(prevState => 
          prevState.map(category => 
            category.title === "Communications"
              ? {
                  ...category,
                  data: category.data.map(integration => 
                    integration.name === "Email"
                      ? { ...integration, status: INTEGRATION_STATUS.CONNECTED }
                      : integration
                  ),
                }
              : category
          )
        );
        setIsEmailModalOpen(false);
      })
    } catch (error: any) {
      Toastify.error("Error setting user setting integrations");
      console.error("Error fetching user integrations:", error);
      setIsEmailModalOpen(false);
    }
  };

  const handleEmailCancel = () => {
    setEmailData((prev) => ({...prev}));
    setIsEmailModalOpen(false);
  };

  const onPreferredChange = (value:any) => {
    try {
      settingService.updatePreferredIntegration({
        dateFormat : preferredIntegration.dateFormat,
        timeFormat : preferredIntegration.timeFormat,
        preferredIntegrationSystem : value
      })
      .then((response: any) => {
        setPreferredIntegration(prevState => ({
          ...prevState,
          preferredIntegrationSystem : value
        }))
        Toastify.success("Set the Preferred integration successfully.");
      })
    } catch (error: any) {
      Toastify.error("Error setting preferred integrations");
      console.error("Error fetching user integrations:", error);
    }
  };

  return (
    <Box display="flex" flexDirection={isMobile ? "column" : "row"}>

      <Modal
        title="Airtable Setting"
        open={isAirtableModalOpen}
        onOk={handleAirtableOk}
        onCancel={handleAirtableCancel}
      >
        <AirtableSettingModal  initData={airtableData}/>
      </Modal>

      <Modal
        title="ClickUp Setting"
        open={isClickUpModalOpen}
        onOk={handleClickUpOk}
        onCancel={handleClickUpCancel}
      >
        <ClickUpSettingModal  initData={clickUpData}/>
      </Modal>

      <Modal
        title="Jira Setting"
        open={isJiraModalOpen}
        onOk={handleJiraOk}
        onCancel={handleJiraCancel}
      >
        <JiraSettingModal  initData={jiraData}/>
      </Modal>

      <Modal
        title="Email Setting"
        open={isEmailModalOpen}
        onOk={handleEmailOk}
        onCancel={handleEmailCancel}
      >
        <EmailSettingModal  initData={emailData}/>
      </Modal>

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
          ml: isMobile ? 0 : isSmallScreen ? "300px" : "366px",
        }}
      >
        <Box p={isMobile ? 2 : 4}>
          <h2 className="integration-header font-bold-h2">Integrations</h2>

          {isLoaded && (
            <Box
              display="flex"
              flexWrap="wrap"
              flexDirection="row"
              gap={isMobile ? 1 : "calc(24 / 16 * 1rem)"}
            >
              {IntegrationData.map((section) => {
                return (
                  <Box
                    display="flex"
                    flexDirection="column"
                    border="1px solid var(--other-purple-stroke-color)"
                    borderRadius="calc(12 / 16 * 1rem)"
                    py="calc(20 / 16 * 1rem)"
                    sx={isMobile ? mobileCSS : {}}
                  >
                    <div className="section-header font-medium-capt-small" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <p>{section.title}</p>
                      {section.title === 'Task Systems' &&  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}><p style={{ textTransform: 'none', marginRight: 10}}>Preferred: </p><Select
                        placeholder={"Select Integration"}
                        size={"small"}
                        style={{ width: 100, marginRight: 25 }}
                        onChange={onPreferredChange}
                        options={preferredOptions}
                        value={preferredIntegration.preferredIntegrationSystem}
                      /></div>}
                    </div>
                    <div className="section-body">
                      {section.data.map((item) => {
                        return (
                          <CustomIntegration
                            imgSrc={item.logo}
                            integrationName={item.name}
                            clickFunc={item.func}
                            status={item.status}
                            setting={item.setting}
                          />
                        );
                      })}
                    </div>
                  </Box>
                );
              })}
            </Box>
          )}
          {!isLoaded && (
            <Box className={"flex-column-container"}>
              <CircularProgress />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Integrations;
