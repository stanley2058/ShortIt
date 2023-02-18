import { AppShell, Header as MantineHeader, Group, Text } from "@mantine/core";
import { PropsWithChildren } from "react";
import User from "./User";

export default function Header(props: PropsWithChildren) {
  return (
    <AppShell
      padding="md"
      header={
        <MantineHeader height={60} p="xs">
          <Group sx={{ height: "100%" }} px={20} position="apart">
            <Text
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan", deg: 45 }}
              ta="center"
              fz="xl"
              fw={700}
            >
              Short It!
            </Text>
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
