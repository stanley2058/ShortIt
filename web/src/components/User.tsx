import {
  ActionIcon,
  Anchor,
  Avatar,
  Flex,
  Menu,
  Tooltip,
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
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
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
                  sx={{ cursor: "pointer" }}
                />
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                icon={<IconTools />}
                onClick={() => navigate("/manage")}
              >
                Manage URLs
              </Menu.Item>
              <Menu.Item
                color="red"
                icon={<IconLogout />}
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
