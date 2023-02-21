import { Container, Flex, Title, Text, Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Flex h="100%" direction="column" justify="center">
      <Container>
        <Flex direction="column" ta="center" align="center" gap="lg">
          <Title order={1}>Oops!</Title>
          <Text>The page you are try to visit was deleted.</Text>
          <Button variant="light" onClick={() => navigate("/")}>
            Go back to home page
          </Button>
        </Flex>
      </Container>
    </Flex>
  );
}
