import { ReactNode } from 'react'
import { Card, Flex, Image, Text, Button, Group, Grid } from '@mantine/core'
import { IconEdit } from '@tabler/icons-react'
import formatDistance from 'date-fns/formatDistance'

type GameCardProps = {
  name: string
  image: string
  updatedAt: Date
  displayActions: boolean
}

function GenericCard(props: GameCardProps) {
  return (
    <Card shadow="sm" p="lg" sx={{ width: 210, height: 260 }}>
      <Card.Section>
        <Image fit="cover" src={props.image} height={120} width={250} />
      </Card.Section>

      <Text mt="md" weight={500} lineClamp={2}>
        {props.name}
      </Text>

      <Text size="sm" color="dimmed">
        {formatDistance(props.updatedAt, new Date(), { includeSeconds: true })}
      </Text>

      {props.displayActions && (
        <Flex>
          <Button variant="subtle" color="gray" compact mt="xs" size="xs" pr="0">
            <IconEdit />
          </Button>
        </Flex>
      )}
    </Card>
  )
}

interface GenericItem {
  name: string
  imageUrl: string
  updatedAt: Date
}

type GenericListProps = {
  header?: ReactNode
  data: GenericItem[]
  limit?: number
  diplayActions?: boolean
}

export function GenericList(props: GenericListProps) {
  return (
    <>
      {props.header && <div>{props.header}</div>}
      <Grid mb="xl">
        {props.data.slice(0, props.limit || 5).map((item: GenericItem) => (
          <Grid.Col span="content" key={item.name}>
            <GenericCard
              name={item.name}
              image={item.imageUrl}
              updatedAt={item.updatedAt}
              displayActions={props.diplayActions ?? true}
            />
          </Grid.Col>
        ))}
      </Grid>
    </>
  )
}
