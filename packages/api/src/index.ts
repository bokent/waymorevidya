import * as dotenv from 'dotenv'
dotenv.config()

// eslint-disable-next-line
import * as express from 'express'
// eslint-disable-next-line
import { Request, Response, NextFunction } from 'express'
// eslint-disable-next-line
import { ERROR, ErrorCode } from './codes'
import { getSteamApp } from './steam'

const app = express()
const PORT = process.env.PORT || 8080

app.post('/ixs/mint', (_req: Request, res: Response) => {
  res.status(501).json({ msg: 'mot yet implemented' })
})

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy' })
})

app.get('/getSteamApp/:appId', async (req: Request, res: Response) => {
  const steamApp = await getSteamApp(req.params.appId)
  console.log(steamApp)
  res.json(steamApp)
})

app.get('/getItemCount/:appId', async (req: Request, res: Response) => {
  const steamApp = await getSteamApp(req.params.appId)
  console.log(steamApp)
  res.json(steamApp)
})

/**
 * default error handler
 */
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof Error) {
    if (Object.values(ERROR).includes(err.message as ErrorCode)) {
      res.status(500).json({
        errCode: err.message
      })
      return
    }
  }

  res.status(500).json({
    errCode: ERROR.UNKNOWN
  })
})

app.listen(PORT, () => {
  console.log(`waymorevidya is up in running on port ${PORT}`)
})
