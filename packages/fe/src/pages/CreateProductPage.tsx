import { Box, Title } from '@mantine/core'
import { GenericList } from '../components/GenericList'
import { Layout } from '../components/Layout'
import { ProductForm } from '../components/ProductForm'

export function CreateProductPage() {
  return (
    <Layout>
      <Title mb="xl">Product Creator</Title>
      <Box mb="xl">
        <ProductForm
          initialValues={{
            name: '',
            image: '',
            productType: '',
            paymentType: '',
            mintKey: '',
            rarityConfig: [0, 0, 0, 0, 0]
          }}
        />
      </Box>
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
    </Layout>
  )
}
