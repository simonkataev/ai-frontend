export default class EndPointProvider {
  static getEndPoint() {
    let endpoint;
    if (process.env.REACT_APP_LOCAL_START) {
      endpoint = "http://localhost:8080/api";
    } else {
      endpoint = process.env.REACT_APP_APIENDPOINT;
    }

    return endpoint;
  }

  static getAuthEndPoint() {
    let endpoint;
    if (process.env.REACT_APP_LOCAL_START) {
      endpoint = "http://localhost:8080/auth/user";
    } else {
      endpoint = process.env.REACT_APP_AUTHENDPOINT;
    }

    return endpoint;
  }

  static getCalendarEndPoint() {
    let endpoint;
    endpoint = "https://teamsassistapi-hdarg9f3eud5b3dv.uaenorth-01.azurewebsites.net";

    return endpoint;
  }

  static getPageEndPoint() {
    let endpoint;
    if (process.env.REACT_APP_LOCAL_START) {
      endpoint = "http://localhost:9002";
    } else {
      endpoint = process.env.REACT_APP_HUBENDPOINT;
    }

    return endpoint;
  }

  static getAirtableEndPoint() {
    let endpoint;
    if (process.env.REACT_APP_LOCAL_START) {
      endpoint = "http://localhost:3000/atbl";
    } else {
      endpoint = process.env.REACT_APP_ABTLENDPOINT;
    }

    return endpoint; 
  }
}
