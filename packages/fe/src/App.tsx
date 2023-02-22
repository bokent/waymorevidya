import { MantineProvider } from '@mantine/core'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { GamesPage } from './pages/GamesPage'
import { HomePage } from './pages/HomePage'
import { PublisherPage } from './pages/PublisherPage'

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
    path: '/publisher',
    element: <PublisherPage />
  }
])

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <RouterProvider router={router} />
    </MantineProvider>
  )
}
