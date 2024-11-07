import axios from "axios";
import EndPointProvider from "utils/EndPointProvider";

export default class JiraService {
  jiraEndpoint = "";
  atlassianEndpoint = "";
  token = "";
  config;

  constructor(authStore) {
    this.jiraEndpoint = EndPointProvider.getEndPoint() + "/jira/";
    this.atlassianEndpoint = EndPointProvider.getEndPoint() + "/atlassian/"
    this.token = authStore.token;
    this.config = {
      headers: { Authorization: `Bearer ${this.token}` },
    };
  }

  getAccessToken = async (code) => {
    const tokenResponse = await axios.post(
      this.atlassianEndpoint + "oauth/token",
      { authorizationCode: code },
      this.config,
    );

    return tokenResponse.data;
  };

  getClouds = async () => {
    const response = await axios.get(this.atlassianEndpoint + "resource", this.config);

    return response.data;
  };

  getProjects = async (cloudId) => {
    const response = await axios.get(
      this.jiraEndpoint + cloudId + "/project",
      this.config,
    );

    return response.data;
  };

  getLists = async (cloudId, projectId) => {
    const response = await axios.get(
      this.jiraEndpoint + cloudId + "/project/" + projectId + "/issue",
      this.config,
    );

    return response.data;
  };

  getSettingIntegration = async () => {
    const response = await axios.get(
      this.jiraEndpoint + "settingIntegration",
      this.config
    );

    return response.data;
  }

  updateSettingIntegration = async (data) => {
    const response = await axios.post(
      this.jiraEndpoint + "settingIntegration", data ,
      this.config
    );
    
    return response.data;
  }
}
