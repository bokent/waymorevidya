import { ReactNode } from 'react'
import { Card, Flex, Image, Text, Badge, Button, Group, Grid } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'
import formatDistance from 'date-fns/formatDistance'

type GameCardProps = {
  name: string
  image: string
  updatedAt: Date
}

function GenericCard(props: GameCardProps) {
  return (
    <Card shadow="sm" p="lg">
      <Card.Section>
        <Image fit="cover" src={props.image} height={120} width={250} />
      </Card.Section>

      <Group mt="md" spacing="sm">
        <Text weight={500}>{props.name}</Text>
      </Group>

      <Text size="sm" color="dimmed">
        {formatDistance(props.updatedAt, new Date(), { includeSeconds: true })}
      </Text>

      <Flex justify="flex-end">
        <Button variant="subtle" color="gray" compact mt="xs" size="xs" pr="0">
          <IconEdit />
        </Button>
      </Flex>
    </Card>
  )
}

interface GenericItem {
  name: string
  image: string
  updatedAt: Date
}

type GenericListProps = {
  header?: ReactNode
  data: GenericItem[]
}

export function GenericList(props: GenericListProps) {
  return (
    <>
      {props.header && <div>{props.header}</div>}
      <Grid mb="xl">
        {props.data.map((item: GenericItem) => (
          <Grid.Col span="content">
            <GenericCard name={item.name} image={item.image} updatedAt={item.updatedAt} />
          </Grid.Col>
        ))}
      </Grid>
    </>
  )
}
