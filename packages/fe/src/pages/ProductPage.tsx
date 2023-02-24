import { Box, Button, Flex, Image, SimpleGrid, Title, Text, LoadingOverlay } from '@mantine/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Layout } from '../components/Layout'
import { GenericList } from '../components/GenericList'
import { Item, Lootbox } from 'shared/src/types'
import { useParams } from 'react-router-dom'

type ProductPageProps = {
  isPreview: boolean
}

type MintState = {
  buttonText: string
  isDisabled: boolean
}

type UnlockState = {
  buttonText: string
  isDisabled: boolean
}

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

type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>

export function ProductPage(props: ProductPageProps) {
  const { productId } = useParams()

  const gameId = '570'
  const [numberOfMintKeys, setNumberOfMintKeys] = useState(3)
  const [numberMinted, setNumberMinted] = useState(0)
  const [initialSlide, setInitialSlide] = useState(0)
  const [stopSlider, setStopSlider] = useState(false)
  const [items, setItems] = useState<RequiredField<Item, 'updatedAt'>[]>([])
  const [product, setProduct] = useState<Lootbox>({
    appId: 0,
    enabled: false,
    imageUrl: '',
    name: '',
    items: [],
    priceSOL: 0
  })
  useEffect(() => {
    const getProduct = async () => {
      const res = (await (
        await fetch(
          (process.env.REACT_APP_BACKEND_API ?? '') +
            `/getProduct/${gameId}/${encodeURIComponent(productId ?? '')}`
        )
      ).json()) as Lootbox
      setProduct(res)
    }
    getProduct()
  }, [productId])

  const mintState: MintState = useMemo(() => {
    return {
      buttonText: 'Mint',
      isDisabled: false
    }
  }, [])
  const unlockState: UnlockState = useMemo(() => {
    if (numberOfMintKeys > 0 && numberMinted > 0) {
      return {
        buttonText: 'Unlock Treasure',
        isDisabled: false
      }
    } else if (numberOfMintKeys > 0 && numberMinted < 1) {
      return {
        buttonText: 'Mint More Treasure',
        isDisabled: true
      }
    } else if (numberOfMintKeys < 1) {
      return {
        buttonText: 'Get More Keys',
        isDisabled: true
      }
    } else {
      throw new Error('unsupported unlock state')
    }
  }, [numberOfMintKeys, numberMinted])

  const handleMint = useCallback(() => {
    setNumberMinted((prevVal) => prevVal + 1)
  }, [])
  const handleUnlock = useCallback(() => {
    setNumberMinted((prevVal) => prevVal - 1)
    setNumberOfMintKeys((prevVal) => prevVal - 1)
    setInitialSlide(10)
  }, [])

  useEffect(() => {
    if (!gameId) {
      return
    }
    const getItems = async () => {
      let res = (await (
        await fetch(
          (process.env.REACT_APP_BACKEND_API ?? '') +
            `/getProductItems/570/${encodeURIComponent(productId ?? '')}`
        )
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
  if (product.appId == 0) {
    return <LoadingOverlay visible={true} />
  }
  return (
    <Layout>
      <SimpleGrid cols={2} mb="xl">
        <Box>
          <Title mb="xl">
            {props.isPreview ? 'PREVIEW: ' : null}
            {product.name}
          </Title>
          <Flex gap="sm" align="center">
            <Button disabled={mintState.isDisabled} onClick={handleMint}>
              {mintState.buttonText}
            </Button>
            {numberMinted > 0 && <Text> {numberMinted} minted</Text>}
          </Flex>
        </Box>
        <Image src={product.imageUrl} />
      </SimpleGrid>
      <GenericList
        data={items}
        header={<Title order={2}>Items</Title>}
        diplayActions={false}
        editUrl={() => ''}
        limit={50}
        mode="slider"
        stopSlider={stopSlider}
      />
      <Flex gap="sm" align="center">
        <Text>Use {product.name} key</Text>
        <Button disabled={unlockState.isDisabled} onClick={handleUnlock}>
          {unlockState.buttonText}
        </Button>
        <Text>
          {numberOfMintKeys} key{numberOfMintKeys > 1 ? 's' : ''} left and {numberMinted}{' '}
          {numberMinted > 1 ? 'treasuries' : 'treasury'} left
        </Text>
      </Flex>
    </Layout>
  )
}
