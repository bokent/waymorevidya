import { MantineProvider } from '@mantine/core'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { HomePage } from './pages/HomePage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  }
])

export default function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <RouterProvider router={router} />
    </MantineProvider>
  )
}
