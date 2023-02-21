import {
  Container,
  Card,
  Text,
  Image,
  Flex,
  Title,
  Anchor,
} from "@mantine/core";
import logo from "/shortit.svg";
import {
  ReactJs,
  Auth0,
  Figma,
  Redis,
  Postgresql,
  Prisma,
  Nodedotjs,
  Express,
} from "@icons-pack/react-simple-icons";

export default function About() {
  const frontend = [
    <ReactJs key="React.js" color="default" title="React.js" size="4rem" />,
    <Image
      key="Mantine"
      title="Mantine"
      src="https://mantine.dev/favicon.svg"
      width="4rem"
      height="auto"
    />,
    <Auth0 color="default" key="Auth0" title="Auth0" size="4rem" />,

    <Figma color="default" key="Figma" title="Figma" size="4rem" />,
  ];
  const backend = [
    <Nodedotjs key="Node.js" color="default" title="Node.js" size="4rem" />,
    <Express key="Express.js" color="default" title="Express.js" size="4rem" />,
    <Prisma key="Prisma" color="default" title="Prisma" size="4rem" />,
    <Postgresql
      key="PostgreSQL"
      color="default"
      title="PostgreSQL"
      size="4rem"
    />,
    <Redis key="Redis" color="default" title="Redis" size="4rem" />,
  ];

  return (
    <Container maw="40rem" pt="2rem">
      <Card shadow="sm" p="lg" radius="md" withBorder>
        <Title order={1} ta="center">
          Short It!
        </Title>
        <Card.Section>
          <Flex justify="center">
            <Image src={logo} height="auto" width={100} alt="Short It! Logo" />
          </Flex>
        </Card.Section>
        <Card.Section>
          <Anchor href="https://github.com/stanley2058/shortit" target="_blank">
            <Text fs="italic" ta="center">
              https://github.com/stanley2058/shortit
            </Text>
          </Anchor>
        </Card.Section>

        <Text size="md" pt="lg">
          Short It! is a free and open source URL shortener, providing great
          customize-ability with outstanding performance.
        </Text>

        <Container pt="lg">
          <Flex gap="md" justify="space-around" align="center">
            {...frontend}
          </Flex>

          <Flex gap="md" justify="space-around" align="center" pt="sm">
            {...backend}
          </Flex>
        </Container>
      </Card>
    </Container>
  );
}
