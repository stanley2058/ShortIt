// eslint-disable-next-line import/no-absolute-path
import {
  Container,
  Card,
  Text,
  Image,
  Flex,
  Title,
  Anchor,
} from "@mantine/core";
// eslint-disable-next-line import/no-absolute-path
import logo from "/shortit.svg";
import {
  Sireact,
  Siauth0,
  Sifigma,
  Siredis,
  Sipostgresql,
  Siprisma,
  Sinodedotjs,
  Siexpress,
} from "@icons-pack/react-simple-icons";

export default function About() {
  const frontend = [
    <Sireact key="React.js" color="default" title="React.js" size="4rem" />,
    <Image
      key="Mantine"
      title="Mantine"
      src="https://mantine.dev/favicon.svg"
      width="4rem"
      height="auto"
    />,
    <Siauth0 color="default" key="Auth0" title="Auth0" size="4rem" />,

    <Sifigma color="default" key="Figma" title="Figma" size="4rem" />,
  ];
  const backend = [
    <Sinodedotjs key="Node.js" color="default" title="Node.js" size="4rem" />,
    <Siexpress
      key="Express.js"
      color="default"
      title="Express.js"
      size="4rem"
    />,
    <Siprisma key="Prisma" color="default" title="Prisma" size="4rem" />,
    <Sipostgresql
      key="PostgreSQL"
      color="default"
      title="PostgreSQL"
      size="4rem"
    />,
    <Siredis key="Redis" color="default" title="Redis" size="4rem" />,
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
