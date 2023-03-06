import {
  AppShell,
  Header as MantineHeader,
  Group,
  Image,
  Text,
  Flex,
  Tooltip,
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserProvider } from "../context/User";
import useColorScheme from "../hooks/useColorScheme";
import useUserInfo from "../hooks/useUserInfo";
import User from "./User";
import logo from "/shortit.svg";

function handleSweetalertTheme(theme: ColorScheme) {
  const style = document.getElementById("sweetalert-theme") as HTMLLinkElement;
  const url = `https://cdn.jsdelivr.net/npm/@sweetalert2/${
    theme === "dark"
      ? "theme-dark/dark.min.css"
      : "theme-default/default.min.css"
  }`;
  style.href = url;
}

export default function Header(props: PropsWithChildren) {
  const navigate = useNavigate();
  const [user, isLoading] = useUserInfo();
  const [colorScheme, setColorScheme, unsubscribe] = useColorScheme(
    handleSweetalertTheme
  );
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  };
  useEffect(() => unsubscribe, []);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <UserProvider value={[user, isLoading]}>
          <AppShell
            padding="md"
            header={
              <MantineHeader height={60} p="xs">
                <Group sx={{ height: "100%" }} px={20} position="apart">
                  <Tooltip label="Go to home page">
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
                  </Tooltip>

                  <User />
                </Group>
              </MantineHeader>
            }
            styles={(theme) => ({
              main: {
                backgroundColor:
                  colorScheme === "dark"
                    ? theme.colors.dark[8]
                    : theme.colors.cyan[1],
              },
            })}
          >
            {props.children}
          </AppShell>
        </UserProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
