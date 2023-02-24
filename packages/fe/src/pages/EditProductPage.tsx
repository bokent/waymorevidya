import { Box, LoadingOverlay, Title } from '@mantine/core'
import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Item, Lootbox } from 'shared/src/types'
import { GenericList } from '../components/GenericList'
import { Layout } from '../components/Layout'
import { ProductForm, ProductFormValues } from '../components/ProductForm'

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

export function EditProductPage() {
  const params = useParams()
  // const [productValues, setProductValues] = useState<Lootbox>()
  const [productFormValues, setProductFormValues] = useState<ProductFormValues>({
    name: '',
    image: '',
    productType: '',
    paymentType: '',
    mintKey: '',
    rarityConfig: [60, 20, 10, 8, 2]
  })
  const [items, setItems] = useState<RequiredField<Item, 'updatedAt'>[]>([])
  useEffect(() => {
    const getProduct = async () => {
      const res = (await (
        await fetch(
          (process.env.REACT_APP_BACKEND_API ?? '') +
            `/getProduct/${params.gameId}/${encodeURIComponent(params.marketplaceHashName ?? '')}`
        )
      ).json()) as Lootbox
      setProductFormValues({
        image: res.imageUrl,
        mintKey: '',
        name: res.name,
        paymentType: 'sol',
        productType: 'lootbox',
        rarityConfig: [60, 20, 10, 8, 2]
      })
      console.log(res)
    }
    getProduct()
  }, [params])
  useEffect(() => {
    if (!params.gameId) {
      return
    }
    const getItems = async () => {
      let res = (await (
        await fetch(
          (process.env.REACT_APP_BACKEND_API ?? '') +
            `/getProductItems/${params.gameId}/${encodeURIComponent(
              params.marketplaceHashName ?? ''
            )}`
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
  }, [params.gameId])

  if (productFormValues.name.length < 2) {
    return <LoadingOverlay visible={true} />
  }
  return (
    <Layout>
      <Title mb="xl">Product Editor</Title>
      <Box mb="xl">
        <ProductForm initialValues={productFormValues} />
      </Box>
      <GenericList data={items} header={<Title order={2}>Items</Title>} />
    </Layout>
  )
}
