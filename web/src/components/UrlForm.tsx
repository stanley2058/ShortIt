import {
  Box,
  Button,
  Container,
  Flex,
  LoadingOverlay,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Envs from "../Envs";
import useMetadataForm from "../hooks/useMetadataForm";
import useOgInfo from "../hooks/useOgInfo";
import UrlService from "../services/UrlService";
import { TShortUrl } from "../types/TShortUrl";
import { UrlFormValue } from "../types/TUrlFormValue";
import InputForm from "./UrlFormMetaInputs";

export default function UrlForm(props?: { edit: TShortUrl }) {
  const form = useMetadataForm(props?.edit);
  const [loading, setLoading] = useState(false);
  const ogInfo = useOgInfo(form.getInputProps("url").value);

  useEffect(() => {
    const url = form.getInputProps("url").value;
    const { ogTitle, ogDescription, ogImage } =
      props && props.edit.url === url ? props.edit : ogInfo || {};
    form.setFieldValue("ogTitle", ogTitle || "");
    form.setFieldValue("ogDescription", ogDescription || "");
    form.setFieldValue("ogImage", ogImage || "");
  }, [ogInfo, form.getInputProps("url").value]);

  async function onSubmit(values: UrlFormValue): Promise<void> {
    setLoading(true);
    try {
      const res = await UrlService.postUrl({
        url: values.url,
        ogTitle: values.ogTitle || undefined,
        ogDescription: values.ogDescription || undefined,
        ogImage: values.ogImage || undefined,
      });
      const shorted = `${Envs.SERVER_URL}/${res.id}`;
      const sRes = await Swal.fire({
        icon: "success",
        title: "URL Shortened!",
        html: `<a href=${shorted} target="_blank">${shorted}</a>`,
        confirmButtonText: "Copy to clipboard!",
        showCancelButton: true,
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

    setLoading(false);
  }

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <Container py="xs">
        <TextInput
          size="lg"
          placeholder="Url to short..."
          {...form.getInputProps("url")}
        />
      </Container>
      {props ? null : (
        <Container ta="center" py="xs">
          <Button
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
        <InputForm form={form} />
      </Container>
    </form>
  );
}
