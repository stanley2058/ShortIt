import {
  ActionIcon,
  Anchor,
  Avatar,
  Flex,
  Menu,
  ThemeIcon,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconLogin,
  IconLogout,
  IconInfoSquare,
  IconTools,
  IconMoonStars,
  IconSun,
} from "@tabler/icons-react";
import Envs from "../Envs";
import UserContext from "../context/User";

export default function User() {
  const { toggleColorScheme } = useMantineColorScheme();
  const colorScheme = useComputedColorScheme();
  const [userInfo, isLoading] = useContext(UserContext);
  const [hasLogin, setHasLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      setHasLogin(!!userInfo);
    }
  }, [isLoading]);

  return (
    <Flex gap="md" align="center">
      <Tooltip label="Switch theme">
        <ActionIcon
          color={colorScheme === "dark" ? "yellow" : "blue"}
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
          variant="subtle"
        >
          {colorScheme === "dark" ? <IconSun /> : <IconMoonStars />}
        </ActionIcon>
      </Tooltip>
      <Tooltip label="About" onClick={() => navigate("/about")}>
        <ActionIcon color="cyan" variant="subtle">
          <IconInfoSquare />
        </ActionIcon>
      </Tooltip>
      {hasLogin ? (
        <>
          <Menu shadow="md">
            <Menu.Target>
              <Tooltip label="Options">
                <Avatar
                  src={userInfo?.picture}
                  alt={userInfo?.email}
                  style={{ cursor: "pointer" }}
                />
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<IconTools size="1.25rem" />}
                onClick={() => navigate("/manage")}
              >
                Manage URLs
              </Menu.Item>
              <Menu.Item
                color="red"
                leftSection={<IconLogout size="1.25rem" />}
                onClick={() =>
                  window.open(`${Envs.SERVER_URL}/logout`, "_self")
                }
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </>
      ) : (
        <Tooltip label="Login">
          <Anchor href={`${Envs.SERVER_URL}/login`} target="_self">
            <ActionIcon variant="subtle">
              <IconLogin />
            </ActionIcon>
          </Anchor>
        </Tooltip>
      )}
    </Flex>
  );
}
