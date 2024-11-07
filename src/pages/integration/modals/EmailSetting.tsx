import Checkbox from "@mui/material/Checkbox";
import { useContext, useEffect, useState, useCallback } from "react";
import { observer } from "mobx-react-lite";
import FormControlLabel from "@mui/material/FormControlLabel";
import EmailContext from "store/EmailStore";


type EmailSettingProps = {
  initData: any
};  

const EmailSettingModal: React.FC<EmailSettingProps> = ({
  initData
}) => {
  const store = useContext(EmailContext);
  const [currentStatus, setCurrentStatus] = useState({
    autoApply: false,
    domain: undefined
  });

  const onDomainChange = useCallback(
    (value: any) => {
      setCurrentStatus(prev => ({
        ...prev,
        domain: value
      }))
      store.setDomain(value);
    },
    [store]
  );

  useEffect(() => {
    const setInitialData = async (data: any) => {
      onDomainChange(data.domain);
      setCurrentStatus( prev => ({
        ...prev,
        autoApply: data.autoApply
      }))
    };

    if (initData.domain) {
      setInitialData({
        autoApply: initData.autoApply,
        domain: initData.domain
      });
    }
  }, [
    onDomainChange,
    initData
  ]);

  return (
    <div className={"flex-column-container gap-2"}>
      <input
        className="dutify-input"
        type="text"
        style={{ width: "200px", marginTop: 20 }}
        placeholder="Input Domain"
        value={currentStatus.domain}
        onChange={(e) => onDomainChange(e.target.value)}
      />
      <FormControlLabel
        label="Auto Apply"
        style={{ width: "200px" }}
        control={
          <Checkbox
            checked={currentStatus.autoApply}
            onChange={() => {
              store.autoApply = !store.autoApply;
              setCurrentStatus( prev => ({
                ...prev,
                autoApply: !prev.autoApply
              }))
            }}
          />
        }
      />
    </div>
  );
}

export default observer(EmailSettingModal);
