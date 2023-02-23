import { Image, TextInput } from '@mantine/core'
import { Formik } from 'formik'
import { useCallback, useEffect, useState } from 'react'

interface GameFormValues {
  mccAddress: string
  name: string
  mainImage: string
  isPublished: boolean
}

type GameFormProps = {
  initialValues: GameFormValues
}

export function GameForm(props: GameFormProps) {
  return (
    <Formik initialValues={props.initialValues} onSubmit={(values) => console.log(values)}>
      {(form) => (
        <form onSubmit={form.handleSubmit}>
          <TextInput
            mb="3rem"
            label="Display Name"
            name="name"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            value={form.values.name}
          />
          <TextInput
            mb="3rem"
            label="MCC address"
            name="mccAddress"
            description="Metaplex Certified Collection address"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            value={form.values.mccAddress}
          />
          <TextInput
            mb="1rem"
            placeholder="in example https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg"
            label="Game Profile Image URL"
            name="mainImage"
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            value={form.values.mainImage}
          />
          <Image
            src={form.values.mainImage || null}
            withPlaceholder
            width={250}
            height={100}
            mb="3rem"
          />
        </form>
      )}
    </Formik>
  )
}
