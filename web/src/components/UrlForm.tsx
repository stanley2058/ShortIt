import {
  Box,
  Button,
  Container,
  Flex,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import useOgInfo from "../hooks/useOgInfo";
import Utils from "../Utils";
import OgPreview from "./OgPreview";

export default function UrlForm() {
  const form = useForm({
    initialValues: {
      url: "",
      ogTitle: "",
      ogImage: "",
      ogDescription: "",
    },

    validate: {
      url: (value) => (Utils.verifyUrl(value) ? null : "Invalid URL"),
      ogTitle: (value) => (value.length > 0 ? null : "Title cannot be empty"),
      ogImage: (value) =>
        value ? (Utils.verifyUrl(value) ? null : "Invalid URL") : null,
    },
  });
  const ogInfo = useOgInfo(form.getInputProps("url").value);

  useEffect(() => {
    const { ogTitle, ogDescription, ogImage } = ogInfo || {};
    form.setFieldValue("ogTitle", ogTitle || "");
    form.setFieldValue("ogDescription", ogDescription || "");
    form.setFieldValue("ogImage", ogImage || "");
  }, [ogInfo, form.getInputProps("url").value]);

  // TODO: submit to backend
  return (
    <>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
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
                  disabled={!Utils.verifyUrl(form.getInputProps("url").value)}
                />
                <Textarea
                  label="Description"
                  placeholder="Preview Description"
                  {...form.getInputProps("ogDescription")}
                  disabled={!Utils.verifyUrl(form.getInputProps("url").value)}
                />
                <TextInput
                  label="Image"
                  placeholder="Preview Image"
                  {...form.getInputProps("ogImage")}
                  disabled={!Utils.verifyUrl(form.getInputProps("url").value)}
                />
              </Flex>
            </Box>
          </Flex>
        </Container>
      </form>
    </>
  );
}
