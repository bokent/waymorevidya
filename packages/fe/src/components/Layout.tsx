import { ReactNode } from 'react'
import { AppShell, Navbar, Header } from '@mantine/core'

// <Navbar width={{ base: 300 }} height={500} p="xs">{/* Navbar content */}</Navbar>
function LayoutNavigation() {
  return (
    <Navbar width={{ base: 240 }}>
      <Navbar.Section>Header with log</Navbar.Section>
      <Navbar.Section grow mt="md">
        Links sections
      </Navbar.Section>
      <Navbar.Section>Footer</Navbar.Section>
    </Navbar>
  )
}

function LayoutHeader() {
  return (
    <Header height={60} p="xs">
      Bokor Games
    </Header>
  )
}

type LayoutProps = {
  children: ReactNode
}

export function Layout(props: LayoutProps) {
  return (
    <AppShell
      padding="md"
      navbar={<LayoutNavigation />}
      header={<LayoutHeader />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
        }
      })}
    >
      {props.children}
    </AppShell>
  )
}
