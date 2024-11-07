import axios from "axios";
import EndPointProvider from "utils/EndPointProvider";

export default class TaskService {
  endpoint = "";
  token = "";
  userId = "";
  config;

  constructor(authStore) {
    this.endpoint = EndPointProvider.getEndPoint() + "/changes/tasks/";
    this.token = authStore.token;
    this.config = {
      headers: { Authorization: `Bearer ${this.token}` },
    };
  }

  applyChanges = async (taskId) => {
    const response = await axios.post(this.endpoint + taskId + '/process', {}, this.config);
    return response.data;
  }
}
