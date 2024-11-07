import axios from "axios";
import EndPointProvider from "utils/EndPointProvider";

export default class UserService {
  endpoint = "";
  token = "";
  config;

  constructor(authStore) {
    this.endpoint = EndPointProvider.getEndPoint() + "/user/";
    this.token = authStore.token;
    this.config = {
      headers: { Authorization: `Bearer ${this.token}` },
    };
  }


  getIntegrations = async () => {
    const response = await axios.get(this.endpoint + "integration", this.config);
    return response.data;
  };
}
