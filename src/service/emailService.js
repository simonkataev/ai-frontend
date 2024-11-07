import EndPointProvider from "utils/EndPointProvider";

export default class EmailService {
  endpoint = "";
  token = "";
  config;

  constructor(authStore) {
    this.endpoint = EndPointProvider.getEndPoint() + "/email/";
    this.token = authStore.token;
    this.config = {
      headers: { Authorization: `Bearer ${this.token}` },
    };
  }

  // getSettingIntegration = async () => {
  //   const response = await axios.get(
  //     this.endpoint + "settingIntegration",
  //     this.config
  //   );

  //   return response.data;
  // }

  // updateSettingIntegration = async (data) => {
  //   const response = await axios.post(
  //     this.endpoint + "settingIntegration", data,
  //     this.config
  //   );
    
  //   return response.data;
  // }
}
