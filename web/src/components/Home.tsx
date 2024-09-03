import { Container, Flex, Text } from "@mantine/core";
import UrlForm from "./UrlForm";

export default function Home() {
  return (
    <Flex h="100%" direction="column" justify="center">
      <Container pb="lg">
        <Text
          variant="gradient"
          ff="Merriweather Sans, sans-serif"
          gradient={{ from: "#A8FF75", to: "#D342FF", deg: -45 }}
          ta="center"
          mt="15dvh"
          size="72px"
          fw={700}
        >
          Short That URL!
        </Text>
      </Container>
      <UrlForm />
    </Flex>
  );
}
