import {
  ActionIcon,
  Box,
  Button,
  Collapse,
  Container,
  Divider,
  Flex,
  LoadingOverlay,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useEffect, useState } from "react";
import Joyride, { CallBackProps } from "react-joyride";
import { IconQuestionMark } from "@tabler/icons-react";
import useMetadataForm from "../hooks/useMetadataForm";
import useOgInfo from "../hooks/useOgInfo";
import UrlService from "../services/UrlService";
import { TShortUrl } from "../types/TShortUrl";
import { UrlFormValue } from "../types/TUrlFormValue";
import InputForm from "./UrlFormMetaInputs";
import Tour from "./Tour";
import JoyrideHandler from "../services/JoyrideHandler";
import useColorScheme, { getTheme } from "../hooks/useColorScheme";

function firstVisit() {
  const key = "showedTour";
  const res = localStorage.getItem(key);
  localStorage.setItem(key, "");
  return res === null;
}

export default function UrlForm(props?: {
  edit?: TShortUrl;
  doneEditing?: () => void;
}) {
  const form = useMetadataForm(props?.edit);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [enableTour, setEnableTour] = useState(firstVisit());
  const [runTour, setRunTour] = useState(enableTour);
  const [tourRunning, setTourRunning] = useState(false);
  const [joyrideHandler] = useState(
    new JoyrideHandler({
      setTourRunning,
      setRunTour,
      setEnableTour,
      setShowAdvanced,
    })
  );
  const [tour, setTour] = useState(Tour(getTheme()));
  const [, , unsubscribe] = useColorScheme((colorScheme) =>
    setTour(Tour(colorScheme))
  );
  const ogInfo = useOgInfo(form.getInputProps("url").value);

  useEffect(() => {
    const url = form.getInputProps("url").value;
    const { ogTitle, ogDescription, ogImage } =
      props?.edit && props.edit.url === url ? props.edit : ogInfo || {};
    form.setFieldValue("ogTitle", ogTitle || "");
    form.setFieldValue("ogDescription", ogDescription || "");
    form.setFieldValue("ogImage", ogImage || "");
  }, [ogInfo, form.getInputProps("url").value]);

  useEffect(() => unsubscribe, []);

  async function onSubmit(values: UrlFormValue): Promise<void> {
    setLoading(true);
    const clear = await UrlService.submit(values, props?.edit);
    if (clear) form.reset();
    props?.doneEditing?.();
    setLoading(false);
  }

  function handleJoyrideCallback(data: CallBackProps) {
    joyrideHandler.handles({
      ...data,
      isAdvVisible: showAdvanced,
      getForm: () => form,
    });
  }

  function startTour() {
    setTourRunning(true);
    setTimeout(() => {
      setEnableTour(true);
      setRunTour(true);
    }, 0);
  }

  return (
    <form id="inputForm" onSubmit={form.onSubmit(onSubmit)}>
      {!props?.edit && enableTour ? (
        <Joyride
          callback={handleJoyrideCallback}
          continuous
          run={runTour}
          scrollToFirstStep
          showProgress
          showSkipButton
          steps={tour}
        />
      ) : null}
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <Container py="xs">
        <TextInput
          id="urlInput"
          size="lg"
          placeholder="URL to short..."
          {...form.getInputProps("url")}
        />
      </Container>
      {!props?.edit ? (
        <Container>
          <Flex justify="flex-end">
            <Tooltip label="Start tour">
              <ActionIcon
                id="btnStartTour"
                variant="outline"
                onClick={startTour}
                disabled={tourRunning}
              >
                <IconQuestionMark />
              </ActionIcon>
            </Tooltip>
          </Flex>
        </Container>
      ) : null}

      {props?.edit ? null : (
        <Container ta="center" py="xs">
          <Button
            id="submitBtn"
            size="lg"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan", deg: 140 }}
            type="submit"
          >
            Short It!
          </Button>
        </Container>
      )}
      <Container py="xl">
        <Flex justify="center" pb="md">
          <Tooltip label="Add your own OpenGraph metadata!">
            <Button
              id="customBtn"
              variant="outline"
              color={showAdvanced ? "orange" : "cyan"}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? "Hide" : "Show"} customization options
            </Button>
          </Tooltip>
        </Flex>
        <Collapse in={showAdvanced}>
          <Divider my="sm" variant="dashed" />
          <InputForm form={form} />
        </Collapse>
      </Container>
      {props?.doneEditing ? (
        <Box ta="right">
          <Button type="submit">Done!</Button>
        </Box>
      ) : null}
    </form>
  );
}
