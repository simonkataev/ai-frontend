import TaskService from "service/taskService";
import { useContext, useState } from "react";
import Toastify from "utils/Toastify";
import AuthContext from "store/AuthStore";
import "./style.scss";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ChangedTask(props: any) {
  const navigate = useNavigate();
  let task = props.task;
  // let recordingId = props.recordingId;
  let authStore = useContext(AuthContext);

  let isCanApplyChanges = false;
  task.taskChanges.forEach((change: any) => {
    if (!change.applied) isCanApplyChanges = true;
  });
  let [canApplyChanges, setCanApplyChanges] = useState(isCanApplyChanges);

  let applyChanges = () => {
    let taskService = new TaskService(authStore);
    taskService
      .applyChanges(task.id)
      .then((data) => {
        if (data.isSuccessful) {
          Toastify.success("🦄 Succesfully Updated!");
          setCanApplyChanges(false);
        } else {
          Toastify.error("Something Went Wrong!");
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          navigate("/hub");
        }
        Toastify.error("Something Went Wrong!");
      });

    // let clickupService = new ClickUpService(authStore);
    // if (task.new) {
    //   clickupService
    //     .postNewTask(recordingId, task.id)
    //     .then((data) => {
    //       if (data.isSuccessful) {
    //         Toastify.success("🦄 Succesfully Updated!");
    //         setCanApplyChanges(false);
    //       } else {
    //         Toastify.error("Something Went Wrong!");
    //       }
    //     })
    //     .catch((error) => {
    //       if (error.response.status === 401) {
    //         navigate("/hub");
    //       }
    //       Toastify.error("Something Went Wrong!");
    //     });
    // } else {
    //   clickupService
    //     .changeTaskFields(recordingId, task.id)
    //     .then((data) => {
    //       console.log(data);
    //       if (data.isSuccessful) {
    //         Toastify.success("🦄 Succesfully Updated!");
    //         setCanApplyChanges(false);
    //       } else {
    //         Toastify.error("Something Went Wrong!");
    //       }
    //     })
    //     .catch((error) => {
    //       if (error.response.status === 401) {
    //         navigate("/hub");
    //       }
    //       Toastify.error("Something Went Wrong!");
    //     });
    // }
  };

  return (
    <Box
      sx={{
        px: 2,
        py: 3,
        borderRadius: "0px calc(8 / 16 * 1rem) calc(8 / 16 * 1rem) 0px",
        borderLeft: "3px solid var(--other-trans-blue-color)",
        boxShadow: "var(--medium-shadow)",
      }}
      display="flex"
      flexDirection="column"
      gap={2.5}
    >
      
      <div className="panel-header">
        <p className="font-medium-capt-big">{task.taskTitle}</p>
          {task.new && <div className="new-task-badge">NEW</div>}
      </div>
      {task.taskType === 'AIRTABLE' && <p className="font-medium-capt-small changed-task-label" style={{ fontWeight: 'bold' }}>
          {task.airtableTable}
      </p>}
      {task.taskChanges.map((taskChange: any, index: number) => (
        <Box
          key={`taskChange-${task.id}-${index}`}
          display="flex"
          flexDirection="column"
          gap={1.5}
        >
          <p className="font-medium-capt-small changed-task-label">
            {taskChange.field}
          </p>
          <p className="font-regular-big changed-task-content">
            {taskChange.oldValue} → {taskChange.newValue}
          </p>
        </Box>
      ))}
      <Box>
        {canApplyChanges && (
          <button
            onClick={applyChanges}
            className="dutify-button"
            style={{ padding: "calc(12 / 16 * 1rem) calc(16 / 16 * 1rem)" }}
          >
            {task.new ? "Create" : "Apply Changes"}
          </button>
        )}
        {!canApplyChanges && (
          <button
            disabled
            className="dutify-button"
            style={{ padding: "calc(12 / 16 * 1rem) calc(16 / 16 * 1rem)" }}
          >
            Applied
          </button>
        )}
      </Box>
    </Box>
  );
}
