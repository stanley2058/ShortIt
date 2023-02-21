import { Card, Image, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { TOpenGraphUrl } from "../types/TOpenGraphUrl";
// eslint-disable-next-line import/no-absolute-path
import placeholder from "/placeholder.svg";
import UrlService from "../services/UrlService";

export default function OgPreview(props: { ogMeta: TOpenGraphUrl }) {
  const [imgUrl, setImgUrl] = useState(placeholder);
  useEffect(() => {
    const urlValid = UrlService.verifyUrl(props.ogMeta.ogImage || "")[0];
    if (!urlValid) setImgUrl(placeholder);
    else setImgUrl(props.ogMeta.ogImage || placeholder);
  }, [props]);

  const siteUrl = UrlService.verifyUrl(props.ogMeta.url)[0]
    ? props.ogMeta.url
    : "https://example.com";

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder w="100%">
      <Card.Section>
        <Image
          src={imgUrl}
          mah={200}
          sx={{ overflow: "clip" }}
          alt={props.ogMeta.ogTitle || "placeholder image"}
          onError={() => setImgUrl(placeholder)}
        />
      </Card.Section>

      <Text weight={500} size="lg" mt="md">
        {props.ogMeta.ogTitle || "Title Placeholder"}
      </Text>

      <Text size="sm" color="dimmed" sx={{ wordWrap: "break-word" }}>
        {props.ogMeta.ogDescription || "Description Placeholder"}
      </Text>

      <Text size="sm" fs="italic" color="blue" pt="sm">
        {siteUrl}
      </Text>
    </Card>
  );
}
