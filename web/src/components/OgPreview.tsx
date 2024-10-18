import { Card, Image, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { TOpenGraphUrl } from "../types/TOpenGraphUrl";
import placeholder from "/images/placeholder.svg";
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
          style={{ overflow: "clip" }}
          alt={props.ogMeta.ogTitle || "placeholder image"}
          onError={() => setImgUrl(placeholder)}
        />
      </Card.Section>

      <Text fw={500} size="lg" mt="md" style={{ wordWrap: "break-word" }}>
        {props.ogMeta.ogTitle || "Title Placeholder"}
      </Text>

      <Text size="sm" c="dimmed" style={{ wordWrap: "break-word" }}>
        {props.ogMeta.ogDescription || "Description Placeholder"}
      </Text>

      <Text
        size="sm"
        fs="italic"
        c="blue"
        pt="sm"
        style={{ wordWrap: "break-word" }}
      >
        {siteUrl}
      </Text>
    </Card>
  );
}
