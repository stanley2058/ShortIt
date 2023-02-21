import { Title, Text } from "@mantine/core";
import { Step, Styles } from "react-joyride";

const styleLight: Styles = {
  beaconInner: {
    backgroundColor: "#4263eb",
  },
  beaconOuter: {
    borderColor: "#4263eb",
  },
  buttonNext: {
    backgroundColor: "#228be6",
  },
};
const styleDark: Styles = {
  beaconInner: {
    backgroundColor: "#4dabf7",
  },
  beaconOuter: {
    borderColor: "#4dabf7",
  },
  tooltip: {
    backgroundColor: "#2C2E33",
    color: "#c5f6fa",
  },
  options: { arrowColor: "#2C2E33" },
  buttonNext: {
    backgroundColor: "#228be6",
    color: "#c5f6fa",
  },
  buttonBack: {
    color: "#c5f6fa",
  },
  buttonSkip: {
    color: "#fd7e14",
  },
  buttonClose: {
    color: "#c5f6fa",
  },
};

export default function Tour(theme: "dark" | "light" = "dark"): Step[] {
  const styles = theme === "dark" ? styleDark : styleLight;
  return [
    {
      content: (
        <>
          <Title>Welcome to SortIt!</Title>
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
      styles,
    },
    {
      content: <Text>Paste your URL here.</Text>,
      target: "#urlInput",
      styles,
    },
    {
      content: <Text>Press this button to short it!</Text>,
      target: "#submitBtn",
      styles,
    },
    {
      content: (
        <Text>
          Customize your URL preview by first going into customization options.
        </Text>
      ),
      target: "#customBtn",
      styles,
    },
    {
      content: <Text>Set your custom options here.</Text>,
      target: "#inputMeta",
      styles,
    },
    {
      content: <Text>Previews are automatically generated.</Text>,
      target: "#previewMeta",
      styles,
    },
    {
      content: <Text>Just like this!</Text>,
      target: "#inputForm",
      styles,
    },
    {
      content: <Text>Press this button to see this tour again.</Text>,
      target: "#btnStartTour",
      locale: { last: "Done!" },
      styles,
    },
  ];
}
