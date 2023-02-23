import { Box, Button, Flex, Image, SimpleGrid, Title, Text } from '@mantine/core'
import { useCallback, useMemo, useState } from 'react'
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

export function ProductPage(props: ProductPageProps) {
  const [numberOfMintKeys, setNumberOfMintKeys] = useState(3)
  const [numberMinted, setNumberMinted] = useState(0)

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

  return (
    <Layout>
      <SimpleGrid cols={2} mb="xl">
        <Box>
          <Title mb="xl">
            {props.isPreview ? 'PREVIEW: ' : null}TREASURE OF THE CRIMSON WITNESS 2022
          </Title>
          <Button disabled={mintState.isDisabled} onClick={handleMint}>
            {mintState.buttonText}
          </Button>
        </Box>
        <Image src="https://i.pinimg.com/originals/40/4e/4d/404e4dcf67eca00d07729ecf9967d137.png" />
      </SimpleGrid>
      <GenericList
        data={[
          {
            imageUrl:
              'https://cdn.akamai.steamstatic.com/steamcommunity/public/images/clans//3703047/4263c0bbe42c6f0dbc573f9748e1b69fff6d64b5.png',
            name: 'Gold Power Hammer',
            updatedAt: new Date()
          }
        ]}
        header={<Title order={2}>Items</Title>}
      />
      <Flex gap="sm" align="center">
        <Text>Use TREASURE OF THE CRIMSON WITNESS 2022 key</Text>
        <Button disabled={unlockState.isDisabled} onClick={handleUnlock}>
          {unlockState.buttonText}
        </Button>
        <Text>
          {numberOfMintKeys} key{numberOfMintKeys > 1 ? 's' : ''} left and {numberMinted} treasury
          {numberMinted > 1 ? 's' : ''} left
        </Text>
      </Flex>
    </Layout>
  )
}
