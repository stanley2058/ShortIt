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
import Swal from "sweetalert2";
import Joyride, { CallBackProps } from "react-joyride";
import { IconQuestionMark } from "@tabler/icons-react";
import Envs from "../Envs";
import useMetadataForm from "../hooks/useMetadataForm";
import useOgInfo from "../hooks/useOgInfo";
import UrlService from "../services/UrlService";
import { TShortUrl } from "../types/TShortUrl";
import { UrlFormValue } from "../types/TUrlFormValue";
import InputForm from "./UrlFormMetaInputs";
import Tour from "./Tour";

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
  const ogInfo = useOgInfo(form.getInputProps("url").value);

  useEffect(() => {
    const url = form.getInputProps("url").value;
    const { ogTitle, ogDescription, ogImage } =
      props?.edit && props.edit.url === url ? props.edit : ogInfo || {};
    form.setFieldValue("ogTitle", ogTitle || "");
    form.setFieldValue("ogDescription", ogDescription || "");
    form.setFieldValue("ogImage", ogImage || "");
  }, [ogInfo, form.getInputProps("url").value]);

  async function onSubmit(values: UrlFormValue): Promise<void> {
    setLoading(true);
    try {
      const res = await UrlService.postUrl({
        id: props?.edit?.id,
        url: values.url,
        ogTitle: values.ogTitle || undefined,
        ogDescription: values.ogDescription || undefined,
        ogImage: values.ogImage || undefined,
      });
      const shorted = `${Envs.SERVER_URL}/${res.id}`;
      const sRes = await Swal.fire({
        icon: "success",
        title: props?.edit ? "Changes saved!" : "URL Shortened!",
        html: `<a href=${shorted} target="_blank">${shorted}</a>`,
        confirmButtonText: "Copy to clipboard!",
        showCancelButton: !props?.edit,
      });
      if (sRes.isConfirmed) {
        await UrlService.copyToClipboard(shorted);
        form.reset();
      }
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Oh no! Something went wrong.",
        text: (err as Error).message,
      });
    }

    props?.doneEditing?.();
    setLoading(false);
  }

  function handleJoyrideCallback(data: CallBackProps) {
    if (data.index === 2 && data.lifecycle === "complete") {
      setRunTour(false);
      setShowAdvanced(true);
      setTimeout(() => setRunTour(true), 500);
    }
    if (data.index === 6 && data.lifecycle === "ready") {
      form.setFieldValue("url", "https://ogp.me");
    }
    if (data.index === 6 && data.lifecycle === "complete") {
      setRunTour(false);
      setShowAdvanced(false);
      form.reset();
      setTimeout(() => setRunTour(true), 500);
    }
  }

  function startTour() {
    if (runTour) setRunTour(false);
    setTimeout(() => {
      setEnableTour(true);
      setRunTour(true);
    }, 0);
  }

  return (
    <form id="inputForm" onSubmit={form.onSubmit(onSubmit)}>
      {enableTour ? (
        <Joyride
          callback={handleJoyrideCallback}
          continuous
          run={runTour}
          scrollToFirstStep
          showProgress
          showSkipButton
          steps={Tour()}
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
      <Container>
        <Flex justify="flex-end">
          <Tooltip label="Start tour">
            <ActionIcon id="btnStartTour" variant="outline" onClick={startTour}>
              <IconQuestionMark />
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Container>

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
