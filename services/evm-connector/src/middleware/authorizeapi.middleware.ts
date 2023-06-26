import dotenv from 'dotenv'
import { type Request, type Response } from 'express'

dotenv.config()

export const authorizeAPI = (req: Request, res: Response, next: () => void): void => {
  if (req.header('X-API-KEY') !== process.env.API_KEY) { res.status(401).json({}) } else { next() }
}
