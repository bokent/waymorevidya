import { Box, Button, Flex, Image, SimpleGrid, Title, Text } from '@mantine/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Layout } from '../components/Layout'
import { GenericList } from '../components/GenericList'

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
  const gameId = '570'
  const [numberOfMintKeys, setNumberOfMintKeys] = useState(3)
  const [numberMinted, setNumberMinted] = useState(0)
  const [products, setProducts] = useState<RequiredField<any, 'updatedAt'>[]>([])

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
  }, [])

  useEffect(() => {
    if (!gameId) {
      return
    }
    const getProducts = async () => {
      let res = (await (
        await fetch((process.env.REACT_APP_BACKEND_API ?? '') + '/getAllProducts/' + gameId)
      ).json()) as RequiredField<any, 'updatedAt'>[]
      res = res.map((a) => ({
        ...a,
        updatedAt: a.updatedAt ? new Date(a.updatedAt) : generateDate(a.name)
      }))
      setProducts(res)
    }
    getProducts()
  }, [gameId])

  return (
    <Layout>
      <SimpleGrid cols={2} mb="xl">
        <Box>
          <Title mb="xl">
            {props.isPreview ? 'PREVIEW: ' : null}TREASURE OF THE CRIMSON WITNESS 2022
          </Title>
          <Flex gap="sm" align="center">
            <Button disabled={mintState.isDisabled} onClick={handleMint}>
              {mintState.buttonText}
            </Button>
            {numberMinted > 0 && <Text> {numberMinted} minted</Text>}
          </Flex>
        </Box>
        <Image src="https://i.pinimg.com/originals/40/4e/4d/404e4dcf67eca00d07729ecf9967d137.png" />
      </SimpleGrid>
      <GenericList data={products} header={<Title order={2}>Items</Title>} diplayActions={false} />
      <Flex gap="sm" align="center">
        <Text>Use TREASURE OF THE CRIMSON WITNESS 2022 key</Text>
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
