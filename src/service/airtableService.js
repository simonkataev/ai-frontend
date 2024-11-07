import axios from "axios";
import EndPointProvider from "utils/EndPointProvider";

export default class AirtableService {
  endpoint = "";
  settingEndpoint = "";
  token = "";
  userId = "";
  config;

  constructor(authStore) {
    this.endpoint = EndPointProvider.getAirtableEndPoint() + "/airtable/";
    this.settingEndpoint = EndPointProvider.getEndPoint() + "/airtable/";
    this.token = authStore.token;
    this.userId = authStore.userId;
    this.config = {
      headers: { Authorization: `Bearer ${this.token}` },
    };
  }

  getBases = async () => {
    const response = await axios.get(this.endpoint + "bases?user_id=" + this.userId);

    return response.data;
  };

  getTables = async (baseId) => {
    const response = await axios.get(
      this.endpoint + "tables?base_id=" + baseId + "&user_id=" + this.userId
    );

    return response.data;
  };

  // getSettingIntegration = async () => {
  //   const response = await axios.get(
  //     this.settingEndpoint + "/settingIntegration",
  //     this.config
  //   );

  //   return response.data;
  // }

  // updateSettingIntegration = async (data) => {
  //   const response = await axios.post(
  //     this.settingEndpoint + "/settingIntegration", data,
  //     this.config
  //   );
    
  //   return response.data;
  // }
}
