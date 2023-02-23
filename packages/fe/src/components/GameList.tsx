import { ReactNode } from 'react'
import { Card, Container, Flex, Image, Text, Badge, Button, Group, Grid } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'
import formatDistance from 'date-fns/formatDistance'

type GameCardProps = {
  name: string
  mainImage: string
  updatedAt: Date
  isPublished?: boolean
}

function GameCard(props: GameCardProps) {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section>
        <Image fit="cover" src={props.mainImage} height={120} width={250} />
      </Card.Section>

      <Group mt="md" mb="xs" spacing="sm">
        <Text weight={500}>{props.name}</Text>
        {props.isPublished && <Badge variant="light">Published</Badge>}
      </Group>

      <Text size="sm" color="dimmed">
        {formatDistance(props.updatedAt, new Date(), { includeSeconds: true })}
      </Text>

      <Flex justify="space-between">
        <Button variant="subtle" color="gray" compact mt="md" size="xs" pl="0">
          Store page
        </Button>
        <Button variant="subtle" color="gray" compact mt="md" size="xs" pr="0">
          <IconEdit />
        </Button>
      </Flex>
    </Card>
  )
}

type Blockchain = 'solana'

interface Game {
  appId: string
  isPublished: boolean
  name: string
  mainImage: string
  blockchain: Blockchain
  updatedAt: Date
}

type GameListProps = {
  header: ReactNode
  data: Game[]
}

export function GameList(props: GameListProps) {
  return (
    <>
      {props.header && <div>{props.header}</div>}
      <Grid mb="xl">
        {props.data.map((item: any) => (
          <Grid.Col span="content">
            <GameCard
              name={item.name}
              isPublished={item.isPublished}
              updatedAt={item.updatedAt}
              mainImage={item.mainImage}
            />
          </Grid.Col>
        ))}
      </Grid>
    </>
  )
}
