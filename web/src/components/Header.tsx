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
import { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";
import useColorScheme from "../hooks/useColorScheme";
import User from "./User";
import logo from "/shortit.svg";

export default function Header(props: PropsWithChildren) {
  const navigate = useNavigate();
  const [colorScheme, setColorScheme] = useColorScheme();
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  };

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
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
