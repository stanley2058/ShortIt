import { Anchor, Avatar, Button, Flex, Tooltip } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Envs from "../Envs";
import useUserInfo from "../hooks/useUserInfo";

export default function User() {
  const [userInfo, isLoading] = useUserInfo();
  const [hasLogin, setHasLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      setHasLogin(!!userInfo);
    }
  }, [isLoading]);

  return (
    <>
      {hasLogin ? (
        <Flex gap="md" align="center">
          <Anchor href={`${Envs.SERVER_URL}/logout`} target="_self">
            <Button variant="outline" color="red">
              Logout
            </Button>
          </Anchor>
          <Tooltip label="Go to profile">
            <Avatar
              src={userInfo?.picture}
              alt={userInfo?.email}
              onClick={() => navigate("/profile")}
              sx={{ cursor: "pointer" }}
            />
          </Tooltip>
        </Flex>
      ) : (
        <>
          <Anchor href={`${Envs.SERVER_URL}/login`} target="_self">
            <Button variant="outline">Login</Button>
          </Anchor>
        </>
      )}
    </>
  );
}
