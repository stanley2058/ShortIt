import {
  AppShell,
  Group,
  Image,
  Text,
  Flex,
  Tooltip,
  MantineProvider,
  AppShellHeader,
  AppShellMain,
  useComputedColorScheme,
} from "@mantine/core";
import { PropsWithChildren, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserProvider } from "../context/User";
import useUserInfo from "../hooks/useUserInfo";
import User from "./User";
import logo from "/shortit.svg";

type ColorScheme = "dark" | "light";
function handleSweetalertTheme(theme: ColorScheme) {
  const style = document.getElementById("sweetalert-theme") as HTMLLinkElement;
  const url = `https://cdn.jsdelivr.net/npm/@sweetalert2/${
    theme === "dark"
      ? "theme-dark/dark.min.css"
      : "theme-default/default.min.css"
  }`;
  style.href = url;
}

function App(props: PropsWithChildren) {
  const navigate = useNavigate();
  const colorScheme = useComputedColorScheme();
  const prevColor = useRef<ColorScheme | null>(null);
  if (prevColor.current !== colorScheme) {
    handleSweetalertTheme(colorScheme);
    prevColor.current = colorScheme;
  }
  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      styles={(theme) => ({
        main: {
          backgroundColor:
            colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.cyan[1],
        },
        header: {
          backgroundColor:
            colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.cyan[0],
        },
      })}
    >
      <AppShellHeader p="xs">
        <Group style={{ height: "100%" }} px={20} justify="space-between">
          <Tooltip label="Go to home page">
            <Flex
              gap="sm"
              align="center"
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
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
                ff="Azeret Mono, monospace"
              >
                Short It!
              </Text>
            </Flex>
          </Tooltip>

          <User />
        </Group>
      </AppShellHeader>
      <AppShellMain>{props.children}</AppShellMain>
    </AppShell>
  );
}

export default function Header(props: PropsWithChildren) {
  const [user, isLoading] = useUserInfo();

  return (
    <MantineProvider defaultColorScheme="auto">
      <UserProvider value={[user, isLoading]}>
        <App {...props} />
      </UserProvider>
    </MantineProvider>
  );
}
