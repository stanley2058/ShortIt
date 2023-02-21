import { Title, Text } from "@mantine/core";
import { Step, Styles } from "react-joyride";

const styles: Styles = {};
const tooltipStyle: React.CSSProperties = {};

export default function Tour(): Step[] {
  return [
    {
      content: (
        <>
          <Title order={2}>Welcome to SortIt!</Title>
          <Text>Want to take a quick tour?</Text>
        </>
      ),
      locale: {
        next: "Yes!",
        skip: "Nope",
      },
      hideCloseButton: true,
      disableCloseOnEsc: true,
      disableOverlayClose: true,
      placement: "center",
      target: "body",
      styles: {
        tooltip: {
          backgroundColor: "black",
        },
      },
    },
    {
      content: <Text>Paste your URL here.</Text>,
      target: "#urlInput",
    },
    {
      content: <Text>Press this button to short it!</Text>,
      target: "#submitBtn",
    },
    {
      content: (
        <Text>
          Customize your URL preview by first going into customization options.
        </Text>
      ),
      target: "#customBtn",
    },
    {
      content: <Text>Set your custom options here.</Text>,
      target: "#inputMeta",
    },
    {
      content: <Text>Previews are automatically generated.</Text>,
      target: "#previewMeta",
    },
    {
      content: <Text>Just like this!</Text>,
      target: "#inputForm",
    },
    {
      content: <Text>Press this button to see this tour again.</Text>,
      target: "#btnStartTour",
      locale: { last: "Done!" },
    },
  ];
}
