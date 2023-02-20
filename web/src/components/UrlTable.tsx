import {
  ActionIcon,
  Anchor,
  Container,
  Flex,
  Table,
  Tooltip,
  Text,
  Button,
  Popover,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import Envs from "../Envs";
import UrlService from "../services/UrlService";
import { TShortUrl } from "../types/TShortUrl";

function shrinkUrl(url: string): string {
  if (url.length <= 33) return url;
  return `${url.slice(0, 30)}...`;
}

export default function UrlTable(props: { urls: TShortUrl[]; total: number }) {
  console.log(props.urls, props.total);

  return (
    <Container w="100%">
      <Table>
        <thead>
          <tr>
            <th>Short URL</th>
            <th>Full URL</th>
            <th>Created At</th>
            <th>Views</th>
            <th style={{ width: "1rem" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {props.urls.map((u, i) => (
            <tr key={i}>
              <td>
                <Popover
                  position="bottom"
                  withArrow
                  shadow="md"
                  onOpen={() =>
                    UrlService.copyToClipboard(`${Envs.SERVER_URL}/${u.id}`)
                  }
                >
                  <Popover.Target>
                    <Button sx={{ fontFamily: "Azeret Mono, monospace" }}>
                      {u.id}
                    </Button>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Text size="sm">Copied!</Text>
                  </Popover.Dropdown>
                </Popover>
              </td>
              <td>
                <Tooltip label={u.url}>
                  <Anchor href={u.url} target="_blank">
                    {shrinkUrl(u.url)}
                  </Anchor>
                </Tooltip>
              </td>
              <td>
                {u.createdAt ? new Date(u.createdAt).toLocaleString() : ""}
              </td>
              <td>{u.views}</td>
              <td>
                <Flex justify="center" gap="sm">
                  <Tooltip label="Edit">
                    <ActionIcon color="indigo" variant="filled">
                      <IconEdit />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete">
                    <ActionIcon color="red" variant="filled">
                      <IconTrash />
                    </ActionIcon>
                  </Tooltip>
                </Flex>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
