import { ReactNode } from 'react'
import { Anchor, AppShell, Container, Navbar, Header, Flex, NavLink } from '@mantine/core'
import { NavLink as RouterNavLink, Link } from 'react-router-dom'
import { IconDeviceGamepad2, IconRocket, IconBrandTwitter } from '@tabler/icons-react'
import { SearchBar } from './SearchBar'
import { Wallet } from './Wallet'
import { Logo } from './Logo'

function LayoutNavigation() {
  return (
    <Navbar width={{ base: 240 }} withBorder={false}>
      <Navbar.Section grow pl="20px" mt="xl">
        <RouterNavLink to="/games">
          <NavLink label="Games" icon={<IconDeviceGamepad2 />} />
        </RouterNavLink>
        <RouterNavLink to="/publisher">
          <NavLink label="Publisher" icon={<IconRocket />} />
        </RouterNavLink>
      </Navbar.Section>
      <Navbar.Section mb="xl" pl="20px">
        <Anchor href="https://twitter.com/bokorgames" sx={{ marginLeft: '4rem' }}>
          <IconBrandTwitter />
        </Anchor>
      </Navbar.Section>
    </Navbar>
  )
}

function LayoutHeader() {
  return (
    <Header height={55 + 28 + 28} pt="40px" pb="40px" pl="xl" pr="xl" withBorder={false}>
      <Flex gap="lg" align="center">
        <div>
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <Container size={468} mx="20px">
          <SearchBar />
        </Container>
        <Container mr="0" ml="auto">
          <Wallet />
        </Container>
      </Flex>
    </Header>
  )
}

type LayoutProps = {
  children: ReactNode
}

export function Layout(props: LayoutProps) {
  return (
    <AppShell padding="md" navbar={<LayoutNavigation />} header={<LayoutHeader />}>
      {props.children}
    </AppShell>
  )
}
