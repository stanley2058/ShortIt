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
  Modal,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
// eslint-disable-next-line import/extensions, @typescript-eslint/ban-ts-comment
import Swal from "sweetalert2/dist/sweetalert2.js";
import Envs from "../Envs";
import UrlService from "../services/UrlService";
import { TShortUrl } from "../types/TShortUrl";
import UrlForm from "./UrlForm";

function shrinkUrl(url: string): string {
  if (url.length <= 33) return url;
  return `${url.slice(0, 30)}...`;
}

export default function UrlTable(props: {
  urls: TShortUrl[];
  refresh: () => void;
}) {
  const [edit, setEdit] = useState(false);
  const [urlToEdit, setUrlToEdit] = useState<TShortUrl | null>(null);

  async function deleteUrl(url: TShortUrl) {
    const confirmRes = await Swal.fire({
      icon: "warning",
      title: "Confirm Deletion",
      text: "Are you sure you want to delete this short url? This action cannot be reverted!",
      showCancelButton: true,
      focusCancel: true,
      confirmButtonText: "Delete It!",
      confirmButtonColor: "red",
    });
    if (confirmRes.isDenied || confirmRes.isDismissed) return;
    try {
      await UrlService.deleteUrl(url.id);
      props.refresh();
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Oops!",
        html: `<p>Something went wrong, please try again later.</p><p>${
          (err as Error).message
        }</p>`,
      });
    }
  }

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
                    UrlService.copyToClipboard(`${Envs.SERVER_URL}/${u.alias}`)
                  }
                >
                  <Popover.Target>
                    <Button
                      sx={{ fontFamily: "Azeret Mono, monospace" }}
                      color="green"
                    >
                      {u.alias}
                    </Button>
                  </Popover.Target>
                  <Popover.Dropdown>
                    <Text size="sm">Copied!</Text>
                  </Popover.Dropdown>
                </Popover>
              </td>
              <td>
                <Tooltip
                  label={u.url}
                  multiline
                  style={{ overflowWrap: "anywhere", wordBreak: "normal" }}
                >
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
                    <ActionIcon
                      color="teal"
                      variant="filled"
                      onClick={() => {
                        setEdit(true);
                        setUrlToEdit(u);
                      }}
                    >
                      <IconEdit />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label="Delete">
                    <ActionIcon
                      color="red"
                      variant="filled"
                      onClick={() => deleteUrl(u)}
                    >
                      <IconTrash />
                    </ActionIcon>
                  </Tooltip>
                </Flex>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal
        size="lg"
        opened={edit}
        onClose={() => setEdit(false)}
        title="Editing URL"
      >
        {urlToEdit ? (
          <UrlForm
            edit={urlToEdit}
            doneEditing={() => {
              setEdit(false);
              props.refresh();
            }}
          />
        ) : null}
      </Modal>
    </Container>
  );
}
