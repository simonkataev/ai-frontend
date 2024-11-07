import axios from "axios";
import EndPointProvider from "utils/EndPointProvider";

export default class SettingService {
  endpoint = "";
  token = "";
  userId = "";
  config;

  constructor(authStore) {
    this.endpoint = EndPointProvider.getEndPoint() + "/settings/";
    this.token = authStore.token;
    this.config = {
      headers: { Authorization: `Bearer ${this.token}` },
    };
  }

  getPreferredIntegration = async () => {
    const response = await axios.get(this.endpoint, this.config);
    return response;
  }

  getAirtableIntegration = async() => {
    const response = await axios.get(this.endpoint + 'airtable', this.config);
    return response;
  }

  getClickUpIntegration = async() => {
    const response = await axios.get(this.endpoint + 'clickup', this.config);
    return response;
  }

  getEmailIntegration = async() => {
    const response = await axios.get(this.endpoint + 'email', this.config);
    return response;
  }

  updatePreferredIntegration = async (data) => {
    const response = await axios.put(this.endpoint, data, this.config);
    return response;
  }

  updateAirtableIntegration = async(data) => {
    const response = await axios.put(this.endpoint + 'airtable', data, this.config);
    return response;
  }

  updateClickUpIntegration = async(data) => {
    const response = await axios.put(this.endpoint + 'clickup', data, this.config);
    return response;
  }

  updateEmailIntegration = async(data) => {
    const response = await axios.put(this.endpoint + 'email', data, this.config);
    return response;
  }
}
