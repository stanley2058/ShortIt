import { Container, Flex, Text } from "@mantine/core";
import UrlForm from "./UrlForm";

export default function Home() {
  return (
    <Flex direction="column" justify="center">
      <Container pb="lg">
        <Text
          variant="gradient"
          sx={{
            fontFamily: "Merriweather Sans, sans-serif",
          }}
          gradient={{ from: "#A8FF75", to: "#D342FF", deg: -45 }}
          ta="center"
          size={72}
          fw={700}
        >
          Short That URL!
        </Text>
      </Container>
      <UrlForm />
    </Flex>
  );
}
