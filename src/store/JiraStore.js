import { makeAutoObservable } from "mobx";
import { createContext } from "react";

class JiraStore {
  appInfo = {
    clientId: "",
    clientSecret: "",
    redirectUri: "",
  };

  jiraCode = "";
  accessToken = null;
  clouds = [];
  projects = [];
  lists = [];

  selectedCloudId = null;
  selectedProjectId = null;
  selectedListId = null;
  isSelectedListConfirmed = false;
  isRequestInProgress = false;

  constructor() {
    if (process.env.REACT_APP_LOCAL_START) {
      this.appInfo.clientId = "KFUK0LTNJLLJ6TKLQ3FZIJRDZUNPTQ7Z";
      this.appInfo.clientSecret =
        "5EJ6K6QSMZTHGHPF911IJ17O58NOPHYPL1WACIT0UUT79TG8H4AREDYQL3339RX9";
      this.appInfo.redirectUri = "http://localhost:9000/";
    } else {
      this.appInfo.clientId = "J0DTZ5T3LEHGJ0VHRSYY8S2832SLMY5H";
      this.appInfo.clientSecret =
        "29W81HWHX5BQ115QHOHV0HXLQIYSSH6S3RI0ZKW3I3U519PLDMOQKGK6P32YSTV7";
      this.appInfo.redirectUri = process.env.REACT_APP_ZOOMENDPOINT;
    }

    makeAutoObservable(this);
  }

  setJiraCode(newCode) {
    this.jiraCode = newCode;
  }

  setAccessToken = (token) => {
    this.accessToken = token;
  };

  setCloudes(value) {
    this.clouds = value;
  }

  setProjects(value) {
    this.projects = value;
  }

  setLists(value) {
    this.lists = value;
  }

  setIsRequestInProgress(isInProgress) {
    this.isRequestInProgress = isInProgress;
  }

  setSelectedCloudId(id) {
    this.selectedCloudId = id;
  }

  setSelectedProjectId(id) {
    this.selectedProjectId = id;
  }

  setSelectedListId(id) {
    this.selectedListId = id;
  }

  setSelectedListConfirmed(confirmed) {
    this.isSelectedListConfirmed = confirmed;
  }
}

const JiraContext = createContext(new JiraStore());
JiraContext.displayName = "JiraContext";

export default JiraContext;
