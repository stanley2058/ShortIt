import { Flex, Box, TextInput, Textarea, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import UrlService from "../services/UrlService";
import { UrlFormValue } from "../types/TUrlFormValue";
import OgPreview from "./OgPreview";

export default function InputForm(props: {
  form: UseFormReturnType<UrlFormValue>;
}) {
  const names = [
    ["ogTitle", "Title"] as const,
    ["ogDescription", "Description"] as const,
    ["ogImage", "Image"] as const,
  ] as const;
  const sharedProps = names.map(([path, name]) => ({
    label: name,
    placeholder: `Preview ${name}`,
    ...props.form.getInputProps(path),
    disabled: !UrlService.verifyUrl(props.form.getInputProps("url").value),
  }));

  return (
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
        <OgPreview ogMeta={props.form.values} />
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
          <TextInput withAsterisk {...sharedProps[0]} />
          <Textarea {...sharedProps[1]} />
          <TextInput {...sharedProps[2]} />
        </Flex>
      </Box>
    </Flex>
  );
}
