import { Button, Flex, Title } from '@mantine/core'
import { Layout } from '../components/Layout'
import { GameList } from '../components/GameList'
import { IconPlus } from '@tabler/icons-react'

export function PublisherPage() {
  return (
    <Layout>
      <GameList
        header={
          <Flex justify="space-between">
            <Title order={2} mb="md">
              Published Games
            </Title>
            <Button>
              <IconPlus /> Add New Game
            </Button>
          </Flex>
        }
        data={[
          {
            appId: '1',
            blockchain: 'solana' as const,
            isPublished: true,
            name: 'Dota 2',
            updatedAt: new Date(),
            mainImage:
              'https://cdn.cloudflare.steamstatic.com/steam/apps/570/header.jpg?t=1675905833'
          },
          {
            appId: '2',
            blockchain: 'solana' as const,
            isPublished: true,
            name: 'CS: GO',
            updatedAt: new Date(),
            mainImage:
              'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg?t=1668125812'
          }
        ]}
      />
      <GameList
        header={
          <Title order={2} mb="md">
            Unpublished Games
          </Title>
        }
        data={[
          {
            appId: '3',
            blockchain: 'solana' as const,
            isPublished: false,
            name: 'Hogwarts Legacy',
            updatedAt: new Date(),
            mainImage:
              'https://gmedia.playstation.com/is/image/SIEPDC/hogwarts-legacy-hero-banner-desktop-01-en-24jan22?$4000px$'
          }
        ]}
      />
    </Layout>
  )
}
