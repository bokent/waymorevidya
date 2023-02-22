import { ReactNode } from 'react'
import { AppShell, Container, Navbar, Header, Box, Flex, NavLink } from '@mantine/core'
import { NavLink as RouterNavLink, Link } from 'react-router-dom'
import { IconDeviceGamepad2, IconRocket } from '@tabler/icons-react'
import { SearchBar } from './SearchBar'
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
        <Box sx={{ margin: '0 auto', width: '200px' }}>Footer</Box>
      </Navbar.Section>
    </Navbar>
  )
}

function LayoutHeader() {
  return (
    <Header height={55 + 28 + 28} pt="40px" pb="40px" pl="xl" pr="xl" withBorder={false}>
      <Flex gap="lg">
        <div>
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <Container size={468} pt="12px" pb="12px" mx="24px">
          <SearchBar />
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
