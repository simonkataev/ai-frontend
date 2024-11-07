import { Select } from "antd";
import Checkbox from "@mui/material/Checkbox";
import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import { observer } from "mobx-react-lite";
import ClickUpContext from "store/ClickUpStore";
import ClickUpService from "service/clickUpService";
import AuthContext from "store/AuthStore";
import { useNavigate } from "react-router-dom";
import FormControlLabel from "@mui/material/FormControlLabel";


type ClickUpSettingProps = {
  initData: any
};  

const ClickUpSettingModal: React.FC<ClickUpSettingProps> = ({
  initData
}) => {
  const navigate = useNavigate();
  const authStore = useContext(AuthContext);
  const store = useContext(ClickUpContext);
  const [currentStatus, setCurrentStatus] = useState({
    useSelectedList: false,
    selectedWorkspace: null,
    selectedSpace: null,
    selectedFolder: null,
    selectedList: null,
  });

  const service = useMemo(() => new ClickUpService(authStore), [authStore]);

  const teamsOptions = store.teams.map((team: any) => ({
    value: team.id,
    label: team.name,
  }));
  const spaceOptions = store.spaces.map((value: any) => ({
    value: value.id,
    label: value.name,
  }));
  const foldersOptions = [
    {
      value: '0',
      label: '-',
    },
    ...store.folders.map((value: any) => ({
      value: value.id,
      label: value.name,
    }))
  ];
  const listOptions = store.lists.map((value: any) => ({
    value: value.id,
    label: value.name,
  }));

  useEffect(() => {
    if (!store.isRequestInProgress && store.teams.length === 0) {
      store.setIsRequestInProgress(true);
      service
        .getWorkspaces()
        .then((data: any) => {
          const workspaces = data.teams;
          store.setTeams(workspaces);
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

  const onTeamsChange = useCallback(
    (value: any) => {
      setCurrentStatus(prev => ({
        ...prev,
        selectedWorkspace: value,
        selectedSpace: null,
        selectedFolder: null,
        selectedList: null
      }))
      store.setSelectedWorkSpaceId(value);
      store.setSelectedSpaceId(null);
      store.setSelectedFolderId(null);
      store.setSelectedListId(null);
      service
        .getSpaces(value)
        .then((data: any) => {
          const entityList = data.spaces;
          store.setSpaces(entityList);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            navigate("/hub");
          }
          console.log(error);
        });
      store.setSpaces([]);
      store.setFolders([]);
      store.setLists([]);
    },
    [store, service, navigate]
  );

  const onSpaceChange = useCallback(
    (value: any) => {
      setCurrentStatus(prev => ({
        ...prev,
        selectedSpace: value,
        selectedFolder: null,
        selectedList: null
      }))
      store.setSelectedSpaceId(value);
      store.setSelectedFolderId(null);
      store.setSelectedListId(null);
      store.setFolders([]);
      store.setLists([]);
      service
        .getFolders(value)
        .then((data: any) => {
          const entityList = data.folders;
          store.setFolders(entityList);
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

  const onFolderChange = useCallback(
    (value: any) => {
      setCurrentStatus(prev => ({
        ...prev,
        selectedFolder: value,
        selectedList: null
      }))
      store.setSelectedFolderId(value);
      store.setSelectedListId(null);
      if(value === '0') {
        service
        .getFolderlessLists(store.selectedSpaceId)
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
      } else {
        service
        .getListsFromFolder(value)
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
      }
    },
    [store, service, navigate]
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
      await onTeamsChange(data.selectedWorkspace);
      await onSpaceChange(data.selectedSpace);
      await onFolderChange(data.selectedFolder);
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
    onTeamsChange,
    onSpaceChange,
    onFolderChange,
    onListChange,
    initData
  ]);

  return (
    <div className={"flex-column-container gap-2"}>
      <Select
        placeholder={"Select Workspace"}
        size={"large"}
        style={{ width: "200px" }}
        onChange={onTeamsChange}
        options={teamsOptions}
        value={teamsOptions.length > 0 ? currentStatus.selectedWorkspace : null}
      />
      <Select
        placeholder={"Select Space"}
        size={"large"}
        style={{ width: "200px" }}
        onChange={onSpaceChange}
        options={spaceOptions}
        value={spaceOptions.length > 0 ? currentStatus.selectedSpace : null}
      />
      <Select
        placeholder={"Select Folder"}
        size={"large"}
        style={{ width: "200px" }}
        onChange={onFolderChange}
        options={foldersOptions}
        value={foldersOptions.length > 0 ? currentStatus.selectedFolder : null}
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

export default observer(ClickUpSettingModal);
