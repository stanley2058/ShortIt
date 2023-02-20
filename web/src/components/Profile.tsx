import { Button, Flex, Pagination, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUrlHistory from "../hooks/useUrlHistory";
import useUserInfo from "../hooks/useUserInfo";
import UrlTable from "./UrlTable";

export default function Profile() {
  const navigate = useNavigate();
  const [user, isLoading] = useUserInfo();

  useEffect(() => {
    if (!isLoading && !user) navigate("/");
  }, [isLoading]);

  const elementPerPage = 10;
  const [skip, setSkip] = useState(0);
  const [take] = useState(elementPerPage);
  const [, total] = useUrlHistory(skip, take);

  function setPage(page: number) {
    const nextSkip = (page - 1) * elementPerPage;
    setSkip(nextSkip);
  }

  return (
    <Flex w="100%" direction="column" gap="md" align="center">
      <Title order={1} size="h2" fw="bold">
        Manage Your URLs
      </Title>
      {total > 0 ? (
        <>
          <UrlTable skip={skip} take={take} />
          <Pagination
            total={Math.ceil(total / take)}
            onChange={(page) => setPage(page)}
          />
        </>
      ) : (
        <Flex direction="column" gap="sm" align="center">
          <Text pt="3rem">Nothing here yet.</Text>
          <Button variant="outline" onClick={() => navigate("/")}>
            Create one now!
          </Button>
        </Flex>
      )}
    </Flex>
  );
}
