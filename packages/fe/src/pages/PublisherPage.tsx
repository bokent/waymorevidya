import { Button, Flex, Title } from '@mantine/core'
import { Layout } from '../components/Layout'
import { GameList } from '../components/GameList'
import { IconPlus } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Game } from 'shared/src/models'
import { Link } from 'react-router-dom'
type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>
export function PublisherPage() {
  const [pubGames, setPubGames] = useState<RequiredField<Game, 'updatedAt'>[]>([])
  const [unPubgames, setUnPubGames] = useState<RequiredField<Game, 'updatedAt'>[]>([])

  useEffect(() => {
    const getGames = async () => {
      let res = (await (
        await fetch((process.env.REACT_APP_BACKEND_API ?? '') + '/getAllGames')
      ).json()) as RequiredField<Game, 'updatedAt'>[]
      res = res.map((a) => ({ ...a, updatedAt: new Date(a.updatedAt) }))
      setPubGames(res.filter((game) => game.isPublished))
      setUnPubGames(res.filter((game) => !game.isPublished))
    }
    getGames()
  }, [])

  return (
    <Layout>
      <GameList
        header={
          <Flex justify="space-between">
            <Title order={2} mb="md">
              Published Games
            </Title>
            <Button component={Link} to="/games/new">
              <IconPlus /> Add New Game
            </Button>
          </Flex>
        }
        data={pubGames}
      />
      <GameList
        header={
          <Title order={2} mb="md">
            Unpublished Games
          </Title>
        }
        data={unPubgames}
      />
    </Layout>
  )
}
