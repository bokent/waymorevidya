import { MantineProvider } from '@mantine/core'
import { Layout } from './components/Layout'

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Layout>
        <h1>Bokor Games</h1>
      </Layout>
    </MantineProvider>
  )
}
