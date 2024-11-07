import { makeAutoObservable } from "mobx";
import { createContext } from "react";

class EmailStore {
  appInfo = {
    clientId: "",
    clientSecret: "",
    redirectUri: "",
  };

  emailCode = "";
  accessToken = null;

  domain = null;
  autoApply = false;

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

  setEmailCode(newCode) {
    this.emailCode = newCode;
  }

  setAccessToken = (token) => {
    this.accessToken = token;
  };

  setDomain(value) {
    this.domain = value;
  }

  setAutoApply(value) {
    this.autoApply = value;
  }
}

const EmailContext = createContext(new EmailStore());
EmailContext.displayName = "EmailContext";

export default EmailContext;
