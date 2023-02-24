import { Button, Container, Flex, LoadingOverlay, Title } from '@mantine/core'
import { Layout } from '../components/Layout'
import { GameForm } from '../components/GameForm'
import { GenericList } from '../components/GenericList'
import { IconPlus } from '@tabler/icons-react'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Game, Item, Lootbox } from 'shared/src/types'

type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>

const generateDate = (str: string) => {
  const arr = str.split('')
  return new Date(
    1677155963071 +
      (Math.abs(
        arr.reduce(
          (hashCode, currentVal) =>
            (hashCode = currentVal.charCodeAt(0) + (hashCode << 6) + (hashCode << 16) - hashCode),
          0
        )
      ) %
        60000)
  )
}

export function EditGamePage() {
  const { gameId } = useParams()
  const [items, setItems] = useState<RequiredField<Item, 'updatedAt'>[]>([])
  const [products, setProducts] = useState<RequiredField<Lootbox, 'updatedAt'>[]>([])
  const [gameDetails, setGameDetails] = useState<Game>({
    mccAddress: '',
    name: '',
    mainImage: '',
    isPublished: false,
    appId: 0,
    background: '',
    desc: '',
    blockchain: 'solana'
  })

  useEffect(() => {
    const getGame = async () => {
      const res = (await (
        await fetch((process.env.REACT_APP_BACKEND_API ?? '') + '/getAllGames')
      ).json()) as RequiredField<Game, 'updatedAt'>[]
      const found = res.find((a) => a.appId.toString() === gameId)
      if (found) {
        setGameDetails({ ...found, updatedAt: new Date(found.updatedAt) })
      }
    }
    getGame()
  }, [gameId])
  // useEffect(() => {
  //   console.log(gameDetails)
  // }, [gameDetails])

  useEffect(() => {
    if (!gameId) {
      return
    }
    const getItems = async () => {
      let res = (await (
        await fetch((process.env.REACT_APP_BACKEND_API ?? '') + '/getAllItems/' + gameId)
      ).json()) as RequiredField<Item, 'updatedAt'>[]
      console.log(res)
      res = res.map((a) => ({
        ...a,
        updatedAt: a.updatedAt ? new Date(a.updatedAt) : generateDate(a.marketHashName)
      }))
      setItems(res)
    }
    getItems()
  }, [gameId])
  useEffect(() => {
    if (!gameId) {
      return
    }
    const getProducts = async () => {
      let res = (await (
        await fetch((process.env.REACT_APP_BACKEND_API ?? '') + '/getAllProducts/' + gameId)
      ).json()) as RequiredField<Lootbox, 'updatedAt'>[]
      res = res.map((a) => ({
        ...a,
        updatedAt: a.updatedAt ? new Date(a.updatedAt) : generateDate(a.name)
      }))
      setProducts(res)
    }
    getProducts()
  }, [gameId])
  if (gameDetails.appId == 0) {
    return <LoadingOverlay visible={true} />
  }
  return (
    <Layout>
      <Title>Game Manger</Title>
      <Container px="0" mx="0" mb="xl">
        <GameForm initialValues={gameDetails} />
      </Container>
      <GenericList data={items} header={<Title order={2}>Items</Title>} editUrl={(item) => ``} />
      <GenericList
        data={products}
        editUrl={(product) => `/products/${product.appId}/${encodeURIComponent(product.name)}/edit`}
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
