import { Button, Flex } from '@mantine/core'
import { IconWallet } from '@tabler/icons-react'

export function Wallet() {
  return (
    <Button variant="outline">
      <Flex gap="xs" align="center">
        <IconWallet /> bokor.sol
      </Flex>
    </Button>
  )
}
