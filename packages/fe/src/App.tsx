import { MantineProvider, MantineTheme } from '@mantine/core'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { GamesPage } from './pages/GamesPage'
import { CreateGamePage } from './pages/CreateGamePage'
import { CreateProductPage } from './pages/CreateProductPage'
import { EditGamePage } from './pages/EditGamePage'
import { HomePage } from './pages/HomePage'
import { PublisherPage } from './pages/PublisherPage'
import { ProductPage } from './pages/ProductPage'

// see https://reactrouter.com/en/main/start/tutorial
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/games',
    element: <GamesPage />
  },
  {
    path: '/games/new',
    element: <CreateGamePage />
  },
  {
    path: '/games/:gameId/edit',
    element: <EditGamePage />
  },
  {
    path: '/products/new',
    element: <CreateProductPage />
  },
  {
    path: '/products/:productId/preview',
    element: <ProductPage isPreview />
  },
  {
    path: '/publisher',
    element: <PublisherPage />
  }
])

const bokorGamesTheme: Partial<MantineTheme> = {
  colorScheme: 'dark',
  primaryColor: 'yellow'
}

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={bokorGamesTheme}>
      <RouterProvider router={router} />
    </MantineProvider>
  )
}
