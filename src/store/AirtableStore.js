import { makeAutoObservable } from "mobx";
import { createContext } from "react";

class AirtableStore {
  appInfo = {
    clientId: "",
    clientSecret: "",
    redirectUri: "",
  };

  airtableCode = "";
  accessToken = null;
  bases = [];
  tables = [];

  selectedBaseId = null;
  selectedTableId = null;
  isSelectedListConfirmed = false;
  isRequestInProgress = false;

  constructor() {
    makeAutoObservable(this);
  }

  setAirtableCode(newCode) {
    this.airtableCode = newCode;
  }

  setAccessToken = (token) => {
    this.accessToken = token;
  };

  setBases(bases) {
    this.bases = bases;
  }

  setTables(value) {
    this.tables = value;
  }

  setIsRequestInProgress(isInProgress) {
    this.isRequestInProgress = isInProgress;
  }

  setSelectedBaseId(id) {
    this.selectedBaseId = id;
  }
  
  setSelectedTableId(id) {
    this.selectedTableId = id;
  }

  setSelectedListConfirmed(confirmed) {
    this.isSelectedListConfirmed = confirmed;
  }
}

const AirtableContext = createContext(new AirtableStore());
AirtableContext.displayName = "AirtableContext";

export default AirtableContext;
