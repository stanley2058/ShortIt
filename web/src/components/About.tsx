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
  SiReact as ReactJs,
  SiAuth0 as Auth0,
  SiFigma as Figma,
  SiRedis as Redis,
  SiPostgresql as Postgresql,
  SiPrisma as Prisma,
  SiNodedotjs as Nodedotjs,
  SiExpress as Express,
  SiMantine,
} from "@icons-pack/react-simple-icons";

export default function About() {
  const frontend = [
    <ReactJs key="React.js" color="#61DAFB" title="React.js" size="4rem" />,
    <SiMantine key="Mantine" color="#339af0" title="Mantine" size="4rem" />,
    <Auth0 color="#EB5424" key="Auth0" title="Auth0" size="4rem" />,
    <Figma color="#F24E1E" key="Figma" title="Figma" size="4rem" />,
  ];
  const backend = [
    <Nodedotjs key="Node.js" color="#339933" title="Node.js" size="4rem" />,
    <Express key="Express.js" color="#000000" title="Express.js" size="4rem" />,
    <Prisma key="Prisma" color="#2D3748" title="Prisma" size="4rem" />,
    <Postgresql
      key="PostgreSQL"
      color="#4169E1"
      title="PostgreSQL"
      size="4rem"
    />,
    <Redis key="Redis" color="#DC382D" title="Redis" size="4rem" />,
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
