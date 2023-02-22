import { Input } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'

export function SearchBar() {
  return <Input icon={<IconSearch />} placeholder="Search" radius="xl" />
}
