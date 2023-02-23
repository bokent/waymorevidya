import { TextInput } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

export function SearchBar() {
  return <TextInput icon={<IconSearch />} placeholder="Search" />
}
