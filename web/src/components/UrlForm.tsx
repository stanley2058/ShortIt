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
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useOgInfo from "../hooks/useOgInfo";
import UrlService from "../services/UrlService";
import OgPreview from "./OgPreview";

type FormValue = {
  url: string;
  ogTitle: string;
  ogImage: string;
  ogDescription: string;
};

export default function UrlForm() {
  const form = useForm({
    initialValues: {
      url: "",
      ogTitle: "",
      ogImage: "",
      ogDescription: "",
    },

    validate: {
      url: (value) => (UrlService.verifyUrl(value) ? null : "Invalid URL"),
      ogTitle: (value) => (value.length > 0 ? null : "Title cannot be empty"),
      ogImage: (value) =>
        value ? (UrlService.verifyUrl(value) ? null : "Invalid URL") : null,
    },
  });
  const [loading, setLoading] = useState(false);
  const ogInfo = useOgInfo(form.getInputProps("url").value);

  useEffect(() => {
    const { ogTitle, ogDescription, ogImage } = ogInfo || {};
    form.setFieldValue("ogTitle", ogTitle || "");
    form.setFieldValue("ogDescription", ogDescription || "");
    form.setFieldValue("ogImage", ogImage || "");
  }, [ogInfo, form.getInputProps("url").value]);

  const onSubmit = async (values: FormValue) => {
    setLoading(true);
    try {
      const res = await UrlService.postUrl(values);
      const shorted = `${window.origin}/s/${res.id}`;
      const sRes = await Swal.fire({
        icon: "success",
        title: "URL Shortened!",
        html: `<a href=${shorted} target="_blank">${shorted}</a>`,
        confirmButtonText: "Copy to clipboard!",
        showCancelButton: true,
      });
      if (sRes.isConfirmed) await UrlService.copyToClipboard(shorted);
      form.reset();
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Oh no! Something went wrong.",
        text: (err as Error).message,
      });
    }

    setLoading(false);
  };

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
      <Container py="xl">
        <Flex
          gap="xs"
          justify="space-evenly"
          align="stretch"
          direction="row"
          wrap="wrap"
        >
          <Box maw="min(100%, 20em)">
            <Text ta="center" weight={500} size="lg">
              Preview
            </Text>
            <OgPreview ogMeta={form.values} />
          </Box>

          <Box>
            <Text ta="center" weight={500} size="lg">
              Custom Metadata
            </Text>
            <Flex
              gap="xs"
              justify="start"
              direction="column"
              align="stretch"
              pt="1rem"
            >
              <TextInput
                withAsterisk
                label="Title"
                placeholder="Preview Title"
                {...form.getInputProps("ogTitle")}
                disabled={
                  !UrlService.verifyUrl(form.getInputProps("url").value)
                }
              />
              <Textarea
                label="Description"
                placeholder="Preview Description"
                {...form.getInputProps("ogDescription")}
                disabled={
                  !UrlService.verifyUrl(form.getInputProps("url").value)
                }
              />
              <TextInput
                label="Image"
                placeholder="Preview Image"
                {...form.getInputProps("ogImage")}
                disabled={
                  !UrlService.verifyUrl(form.getInputProps("url").value)
                }
              />
            </Flex>
          </Box>
        </Flex>
      </Container>
    </form>
  );
}
