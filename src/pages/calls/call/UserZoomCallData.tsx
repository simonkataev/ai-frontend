import { Modal } from "antd";
import "styles/Main.css";
import ChangedTask from "./ChangedTask";
import { useContext, useState } from "react";
import ListSelectionModal from "./ListSelectionModal";
import AIInsightCard from "./AIInsightCard";
import ClickUpContext from "store/ClickUpStore";
import ClickUpService from "service/clickUpService";
import Toastify from "utils/Toastify";
import AuthContext from "store/AuthStore";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function UserZoomCallData(props: any) {
  const navigate = useNavigate();
  const { isMobile } = props;
  let userZoomCall = props.userZoomCall;
  let recording = userZoomCall.call.recordings[0];
  let store = useContext(ClickUpContext);
  let authStore = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentFiled, setCommentField] = useState("");

  let [isTranscriptionApplied, setIsTranscriptionApplied] = useState(
    userZoomCall.transcriptionApplied
  );
  let [isSummaryApplied, setIsSummaryApplied] = useState(
    userZoomCall.summaryApplied
  );
  let [isKeyPointsApplied, setIsKeyPointsApplied] = useState(
    userZoomCall.keyPointsApplied
  );
  let [isActionItemsApplied, setIsActionItemsApplied] = useState(
    userZoomCall.actionItemsApplied
  );

  const showModal = (fieldName: string) => {
    setIsModalOpen(true);
    setCommentField(fieldName);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    let clickupService = new ClickUpService(authStore);
    clickupService
      .addComment(
        userZoomCall.id,
        recording.id,
        commentFiled,
        store.selectedTaskId
      )
      .then((data) => {
        console.log(data);
        if (data.isSuccessful) {
          Toastify.success("🦄 Succesfully Updated!");
          recording[commentFiled + "Applied"] = true;
          if (commentFiled === "transcription") {
            setIsTranscriptionApplied(true);
          } else if (commentFiled === "summary") {
            setIsSummaryApplied(true);
          } else if (commentFiled === "key_points") {
            setIsKeyPointsApplied(true);
          } else if (commentFiled === "action_items") {
            setIsActionItemsApplied(true);
          }
        } else {
          Toastify.error("Something Went Wrong!");
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401) {
          navigate("/hub");
        }
        Toastify.error("Something Went Wrong!");
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Box display="flex" flexDirection="column" gap={3}>
      <Box display="flex" gap={2} flexDirection="column">
        <p className="font-medium-capt-large">Changed Tasks</p>
        {recording.changedTasks.map((task: any, index: number) => (
          <ChangedTask
            key={`changedTask-${index}`}
            recordingId={recording.id}
            task={task}
            isMobile={isMobile}
          />
        ))}
      </Box>
      <AIInsightCard
        recording={recording}
        fieldName={"transcription"}
        split={false}
        showModal={showModal}
        isApplied={isTranscriptionApplied}
        isMobile={isMobile}
      />
      <AIInsightCard
        recording={recording}
        fieldName={"summary"}
        split={false}
        showModal={showModal}
        isApplied={isSummaryApplied}
        isMobile={isMobile}
      />
      <AIInsightCard
        recording={recording}
        fieldName={"keyPoints"}
        split={true}
        showModal={showModal}
        isApplied={isKeyPointsApplied}
        isMobile={isMobile}
      />
      <AIInsightCard
        recording={recording}
        fieldName={"actionItems"}
        split={true}
        showModal={showModal}
        isApplied={isActionItemsApplied}
        isMobile={isMobile}
      />
      <Modal
        title="Choose Task for Comment"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <ListSelectionModal />
      </Modal>
    </Box>
  );
}
