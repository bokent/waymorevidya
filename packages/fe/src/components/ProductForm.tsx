import { Image, TextInput, Box, NumberInput, Select, SimpleGrid } from '@mantine/core'
import { Formik } from 'formik'
import { IconPercentage } from '@tabler/icons-react'

interface ProductFormValues {
  image: string
  name: string
  productType: '' | 'single' | 'bundle' | 'lootbox'
  paymentType: '' | 'spl' | 'sol' | 'fiat'
  mintKey: string
  rarityConfig: number[]
}

type ProductFormProps = {
  initialValues: ProductFormValues
}

export function ProductForm(props: ProductFormProps) {
  return (
    <Formik initialValues={props.initialValues} onSubmit={(values) => console.log(values)}>
      {(form) => (
        <form onSubmit={form.handleSubmit}>
          <SimpleGrid cols={2}>
            <TextInput
              mb="3rem"
              label="Product Name"
              name="name"
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              value={form.values.name}
            />
            <Select
              label="Product type"
              name="productType"
              data={[
                { value: 'lootbox', label: 'Lootbox' },
                { value: 'single', label: 'Single' },
                { value: 'bundle', label: 'Bundle' }
              ]}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              value={form.values.productType}
              mb="3rem"
            />
            <Select
              label="Payment type"
              name="paymentType"
              data={[
                { value: 'fiat', label: 'Fiat' },
                { value: 'spl', label: 'Token' },
                { value: 'sol', label: 'SOL' }
              ]}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              value={form.values.paymentType}
              mb="3rem"
            />
            <TextInput
              mb="3rem"
              label="Mint Key"
              name="mintKey"
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              value={form.values.name}
            />
            <Box mb="3rem">
              <TextInput
                mb="1rem"
                placeholder="in example https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg"
                label="Image"
                name="image"
                onChange={form.handleChange}
                onBlur={form.handleBlur}
                value={form.values.image}
              />
              <Image src={form.values.image || null} withPlaceholder width={250} height={100} />
            </Box>
            <Box mb="3rem">
              <NumberInput
                label="Change Mint Common"
                icon={<IconPercentage />}
                onChange={(value) => {
                  if (!value) {
                    return
                  }
                  const newVal = [value, ...form.values.rarityConfig.slice(1)]
                  form.setFieldValue('rarityConfig', newVal)
                }}
                onBlur={form.handleBlur}
                value={form.values.rarityConfig[0]}
                min={0}
                max={100}
              />
              <NumberInput
                label="Change Mint Uncommon"
                icon={<IconPercentage />}
                onChange={(value) => {
                  if (!value) {
                    return
                  }
                  const newVal = [
                    form.values.rarityConfig[0],
                    value,
                    ...form.values.rarityConfig.slice(2)
                  ]
                  form.setFieldValue('rarityConfig', newVal)
                }}
                onBlur={form.handleBlur}
                value={form.values.rarityConfig[1]}
                min={0}
                max={100}
              />
              <NumberInput
                label="Change Mint Legendary"
                icon={<IconPercentage />}
                onChange={(value) => {
                  if (!value) {
                    return
                  }
                  const newVal = [
                    ...form.values.rarityConfig.slice(0, 2),
                    value,
                    ...form.values.rarityConfig.slice(3)
                  ]
                  form.setFieldValue('rarityConfig', newVal)
                }}
                onBlur={form.handleBlur}
                value={form.values.rarityConfig[2]}
                min={0}
                max={100}
              />
              <NumberInput
                label="Change Mint Arcana"
                icon={<IconPercentage />}
                onChange={(value) => {
                  if (!value) {
                    return
                  }
                  const newVal = [
                    ...form.values.rarityConfig.slice(0, 3),
                    value,
                    ...form.values.rarityConfig.slice(4)
                  ]
                  form.setFieldValue('rarityConfig', newVal)
                }}
                onBlur={form.handleBlur}
                value={form.values.rarityConfig[3]}
                min={0}
                max={100}
              />
              <NumberInput
                label="Change Mint Immortal"
                icon={<IconPercentage />}
                onChange={(value) => {
                  if (!value) {
                    return
                  }
                  const newVal = [...form.values.rarityConfig.slice(0, 4), value]
                  form.setFieldValue('rarityConfig', newVal)
                }}
                onBlur={form.handleBlur}
                value={form.values.rarityConfig[4]}
                min={0}
                max={100}
              />
            </Box>
          </SimpleGrid>
        </form>
      )}
    </Formik>
  )
}
