import { ReactNode } from 'react'
import { AppShell, Container, Navbar, Header, Box, Flex } from '@mantine/core'
import { SearchBar } from './SearchBar'
import { Logo } from './Logo'

function LayoutNavigation() {
  return (
    <Navbar width={{ base: 240 }} withBorder={false}>
      <Navbar.Section mt="xl">
        <Box sx={{ margin: '0 auto', width: '200px' }}>Links section 1</Box>
      </Navbar.Section>
      <Navbar.Section grow mt="xl">
        <Box sx={{ margin: '0 auto', width: '200px' }}>Links section 2</Box>
      </Navbar.Section>
      <Navbar.Section mb="xl">
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
          <Logo />
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
