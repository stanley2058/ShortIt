import {
  AppShell,
  Header as MantineHeader,
  Group,
  Image,
  Text,
  Flex,
} from "@mantine/core";
import { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import User from "./User";
// eslint-disable-next-line import/no-absolute-path
import logo from "/shortit.svg";

export default function Header(props: PropsWithChildren) {
  const navigate = useNavigate();
  return (
    <AppShell
      padding="md"
      header={
        <MantineHeader height={60} p="xs">
          <Group sx={{ height: "100%" }} px={20} position="apart">
            <Flex
              gap="sm"
              align="center"
              onClick={() => navigate("/")}
              sx={{ cursor: "pointer" }}
              title="Short It!"
            >
              <Image
                src={logo}
                height="2.5rem"
                width="auto"
                alt="Short It! logo"
              />
              <Text
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan", deg: 45 }}
                ta="center"
                fz="xl"
                fw={700}
                fs="italic"
                sx={{ fontFamily: "Azeret Mono, monospace" }}
              >
                Short It!
              </Text>
            </Flex>

            <User />
          </Group>
        </MantineHeader>
      }
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.dark[8],
        },
      })}
    >
      {props.children}
    </AppShell>
  );
}
