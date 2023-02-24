import * as dotenv from 'dotenv'
dotenv.config()

// eslint-disable-next-line
import * as express from 'express'
/* eslint-disable */
import { Request, Response, NextFunction } from 'express'
import { getLootboxsByAppId } from 'shared/src/models'
import { ERROR, ErrorCode } from './codes'
import { getGames, getItemsByAppId } from './game'
import { getSteamApp } from './steam'
import * as cors from 'cors'
import { DEFAULT_APP_PORT, getCorsConfig } from './config'
/* eslint-enable */

const app = express()
const PORT = process.env.PORT || DEFAULT_APP_PORT

app.use(cors(getCorsConfig()))

app.post('/ixs/mint', (_req: Request, res: Response) => {
  res.status(501).json({ msg: 'mot yet implemented' })
})

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy' })
})

app.get('/getAllItems/:appId', async (req: Request, res: Response) => {
  const gameItems = await getItemsByAppId(Number.parseInt(req.params.appId), 100)
  console.log(gameItems)
  res.json(gameItems)
})

app.get('/getAllProducts/:appId', async (req: Request, res: Response) => {
  const lootboxs = await getLootboxsByAppId(Number.parseInt(req.params.appId), 100)
  console.log(lootboxs)
  res.json(lootboxs)
})

app.get('/getAllGames', async (req: Request, res: Response) => {
  const games = await getGames()
  console.log(games)
  res.json(games)
})

// decodeURI()
app.get('/getSteamApp/:appId', async (req: Request, res: Response) => {
  const steamApp = await getSteamApp(req.params.appId, false)
  console.log(steamApp)
  res.json(steamApp)
})

app.get('/generateSteamAppPage/:appId', async (req: Request, res: Response) => {
  const steamApp = await getSteamApp(req.params.appId, true)
  console.log(steamApp)
  res.json(steamApp)
})

app.get('/getItemCount/:appId', async (req: Request, res: Response) => {
  const steamApp = await getSteamApp(req.params.appId)
  console.log(steamApp)
  res.json(steamApp)
})
// app.get('/publishGame/:appId'), async (req: Request, res: Response) => {
//   const steamApp = await getSteamApp(req.params.appId)
//   console.log(steamApp)
//   res.json(steamApp)
// })

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
