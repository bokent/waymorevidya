import * as dotenv from 'dotenv'
dotenv.config()

// eslint-disable-next-line
import * as express from 'express'
// eslint-disable-next-line
import { Request, Response } from 'express'

const app = express()
const PORT = process.env.PORT || 8080

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy' })
})

app.listen(PORT, () => {
  console.log(`waymorevidya is up in running on port ${PORT}`)
})
