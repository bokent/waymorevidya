import { Button, Container, Flex, Title } from '@mantine/core'
import { Layout } from '../components/Layout'
import { GameForm } from '../components/GameForm'
import { GenericList } from '../components/GenericList'
import { IconPlus } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

export function EditGamePage() {
  return (
    <Layout>
      <Title>Game Manger</Title>
      <Container px="0" mx="0" mb="xl">
        <GameForm initialValues={{ mccAddress: '', name: '', mainImage: '', isPublished: false }} />
      </Container>
      <GenericList
        data={[
          {
            image:
              'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/clans//3703047/4263c0bbe42c6f0dbc573f9748e1b69fff6d64b5.png',
            name: 'Gold Power Hammer',
            updatedAt: new Date()
          }
        ]}
        header={<Title order={2}>Items</Title>}
      />
      <GenericList
        data={[
          {
            image:
              'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/clans//3703047/4263c0bbe42c6f0dbc573f9748e1b69fff6d64b5.png',
            name: 'Gold Power Hammer',
            updatedAt: new Date()
          }
        ]}
        header={
          <Flex justify="space-between">
            <Title order={2} mb="md">
              Products
            </Title>
            <Button component={Link} to="/products/new">
              <IconPlus /> Add New Product
            </Button>
          </Flex>
        }
      />
    </Layout>
  )
}
