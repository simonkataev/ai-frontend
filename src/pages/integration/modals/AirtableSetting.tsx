import { Select } from "antd";
import Checkbox from "@mui/material/Checkbox";
import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { observer } from "mobx-react-lite";
import AirtableContext from "store/AirtableStore";
import AirtableService from "service/airtableService";
import AuthContext from "store/AuthStore";
import { useNavigate } from "react-router-dom";
import FormControlLabel from "@mui/material/FormControlLabel";


type AirtableSettingProps = {
  initData: any
};  

const AirtableSettingModal: React.FC<AirtableSettingProps> = ({
  initData
}) => {
  const navigate = useNavigate();
  const authStore = useContext(AuthContext);
  const store = useContext(AirtableContext);
  const [currentStatus, setCurrentStatus] = useState({
    useSelectedList: false,
    selectedBase: null,
    selectedTable: null
  });

  const service = useMemo(() => new AirtableService(authStore), [authStore]);

  const basesOptions = store.bases.map((team: any) => ({
    value: team.id,
    label: team.name,
  }));
  const tableOptions = store.tables.map((value: any) => ({
    value: value.id,
    label: value.name,
  }));

  useEffect(() => {
    if (!store.isRequestInProgress && store.bases.length === 0) {
      store.setIsRequestInProgress(true);
      service
        .getBases()
        .then((data: any) => {
          const bases = data.bases;
          store.setBases(bases);
          store.setIsRequestInProgress(false);
        })
        .catch((error) => {
          console.log(error);
          if (error.response && error.response.status === 401) {
            navigate("/hub");
          }
        });
    }
  }, [store, navigate, service]);

  const onBasesChange = useCallback(
    (value: any) => {
      setCurrentStatus(prev => ({
        ...prev,
        selectedBase: value,
        selectedTable: null
      }))
      store.setSelectedBaseId(value);
      store.setSelectedTableId(null);
      service
        .getTables(value)
        .then((data: any) => {
          const entityList = data;
          store.setTables(entityList);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            navigate("/hub");
          }
          console.log(error);
        });
    },
    [store, service, navigate]
  );

  const onTableChange = useCallback(
    (value: any) => {
      setCurrentStatus(prev => ({
        ...prev,
        selectedTable: value
      }))
      store.setSelectedTableId(value);
    },
    [store]
  );

  useEffect(() => {
    const setInitialData = async (data: any) => {
      await onBasesChange(data.selectedBase);
      await onTableChange(data.selectedTable);
      setCurrentStatus( prev => ({
        ...prev,
        useSelectedList: data.useSelectedList
      }))
    };

    if (initData.selectedBase) {
      setInitialData({
        useSelectedList: initData.useSelectedList,
        selectedBase: initData.selectedBase,
        selectedTable: initData.selectedTable
      });
    }
  }, [
    onBasesChange,
    onTableChange,
    initData
  ]);

  return (
    <div className={"flex-column-container gap-2"}>
      <Select
        placeholder={"Select Base"}
        size={"large"}
        style={{ width: "200px" }}
        onChange={onBasesChange}
        options={basesOptions}
        value={basesOptions.length > 0 ? currentStatus.selectedBase : null}
      />
      <Select
        placeholder={"Select Table"}
        size={"large"}
        style={{ width: "200px" }}
        onChange={onTableChange}
        options={tableOptions}
        value={tableOptions.length > 0 ? currentStatus.selectedTable : null}
      />
      <FormControlLabel
        label="Use Selected List"
        style={{ width: "200px" }}
        control={
          <Checkbox
            checked={currentStatus.useSelectedList}
            onChange={() => {
              store.isSelectedListConfirmed = !store.isSelectedListConfirmed;
              setCurrentStatus( prev => ({
                ...prev,
                useSelectedList: !prev.useSelectedList
              }))
            }}
          />
        }
      />
    </div>
  );
}

export default observer(AirtableSettingModal);
