import { Box, Typography } from "@mui/material";

export default function AIInsightCard(props: any) {
  let recording = props.recording;
  let fieldName = props.fieldName;
  let split = props.split;
  let showModal = props.showModal;
  let isApplied = props.isApplied;

  console.log(fieldName);

  function titleCase(str: string) {
    if(str === 'actionItems') return 'Action Items';
    let splitStr = str.toLowerCase().split(" ");
    for (let i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(" ");
  }

  return (
    <Box display="flex" gap={2} flexDirection="column">
      <p className="font-medium-capt-big">{ titleCase(fieldName)}</p>
      <Box display="flex" flexDirection="column" gap={2}>
        {split ? (
          recording[fieldName].split("\n").map((point: any, index: number) => (
            <li key={`point-${index}`}>
              <Typography variant="body1">{point}</Typography>
            </li>
          ))
        ) : (
          <Typography variant="body1">{recording[fieldName]}</Typography>
        )}

        <Box>
          {!isApplied && (
            <button
              onClick={() => showModal(fieldName)}
              className="dutify-button"
              style={{ padding: "calc(12 / 16 * 1rem) calc(16 / 16 * 1rem)" }}
            >
              Add As Comment
            </button>
          )}
          {isApplied && (
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
    </Box>
    // <ul>
    //   {split ? recording[fieldName].split("\n").map((point: any) => <li key={point}>{point}</li>) : recording[fieldName]}
    // </ul>
    // <br />
  );
}
