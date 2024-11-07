import { Select } from "antd";
import Checkbox from "@mui/material/Checkbox";
import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { observer } from "mobx-react-lite";
import AuthContext from "store/AuthStore";
import { useNavigate } from "react-router-dom";
import FormControlLabel from "@mui/material/FormControlLabel";
import JiraContext from "store/JiraStore";
import JiraService from "service/jiraService";


type JiraSettingProps = {
  initData: any
};  

const JiraSettingModal: React.FC<JiraSettingProps> = ({
  initData
}) => {
  const navigate = useNavigate();
  const authStore = useContext(AuthContext);
  const store = useContext(JiraContext);
  const [currentStatus, setCurrentStatus] = useState({
    useSelectedList: false,
    selectedCloud: null,
    selectedProject: null,
    selectedList: null,
  });

  const service = useMemo(() => new JiraService(authStore), [authStore]);

  const cloudsOptions = store.clouds.map((cloud: any) => ({
    value: cloud.id,
    label: cloud.name,
  }));
  const projectsOptions = store.projects.map((value: any) => ({
    value: value.id,
    label: value.name,
  }));
  const listOptions = store.lists.map((value: any) => ({
    value: value.id,
    label: value.name,
  }));

  useEffect(() => {
    if (!store.isRequestInProgress && store.clouds.length === 0) {
      store.setIsRequestInProgress(true);
      service
        .getClouds()
        .then((data: any) => {
          const value = data.clouds;
          store.setCloudes(value);
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

  const onCloudChange = useCallback(
    (value: any) => {
      setCurrentStatus(prev => ({
        ...prev,
        selectedCloud: value,
        selectedProject: null,
        selectedList: null
      }))
      store.setProjects([]);
      store.setLists([]);
      store.setSelectedCloudId(value);
      store.setSelectedProjectId(null);
      store.setSelectedListId(null);
      service
        .getProjects(value)
        .then((data: any) => {
          const entityList = data.projects;
          store.setProjects(entityList);
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

  const onProjectChange = useCallback(
    (value: any) => {
      setCurrentStatus(prev => ({
        ...prev,
        selectedFolder: value,
        selectedList: null
      }))
      store.setSelectedProjectId(value);
      store.setSelectedListId(null);
      service
        .getLists(currentStatus.selectedCloud, value)
        .then((data: any) => {
          const entityList = data.lists;
          store.setLists(entityList);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            navigate("/hub");
          }
          console.log(error);
        });
    },
    [store, service, navigate, currentStatus.selectedCloud]
  );

  const onListChange = useCallback(
    (value: any) => {
      setCurrentStatus(prev => ({
        ...prev,
        selectedList: value
      }))
      store.setSelectedListId(value);
    },
    [store]
  );

  useEffect(() => {
    const setInitialData = async (data: any) => {
      await onCloudChange(data.selectedWorkspace);
      await onProjectChange(data.selectedFolder);
      await onListChange(data.selectedList);
      setCurrentStatus( prev => ({
        ...prev,
        useSelectedList: data.useSelectedList
      }))
    };

    if (initData.selectedWorkspace) {
      setInitialData({
        useSelectedList: initData.useSelectedList,
        selectedWorkspace: initData.selectedWorkspace,
        selectedSpace: initData.selectedSpace,
        selectedFolder: initData.selectedFolder,
        selectedList: initData.selectedList,
      });
    }
  }, [
    onCloudChange,
    onProjectChange,
    onListChange,
    initData
  ]);

  return (
    <div className={"flex-column-container gap-2"}>
      <Select
        placeholder={"Select Cloud"}
        size={"large"}
        style={{ width: "200px" }}
        onChange={onCloudChange}
        options={cloudsOptions}
        value={cloudsOptions.length > 0 ? currentStatus.selectedCloud : null}
      />
      <Select
        placeholder={"Select Project"}
        size={"large"}
        style={{ width: "200px" }}
        onChange={onProjectChange}
        options={projectsOptions}
        value={projectsOptions.length > 0 ? currentStatus.selectedProject : null}
      />
      <Select
        placeholder={"Select List"}
        size={"large"}
        style={{ width: "200px" }}
        onChange={onListChange}
        options={listOptions}
        value={listOptions.length > 0 ? currentStatus.selectedList : null}
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

export default observer(JiraSettingModal);
