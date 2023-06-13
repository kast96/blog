import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export default (request: Request, response: Response, next: NextFunction) => {
  const token = (request.headers.authorization || '').replace(/Bearer\s?/, '')
  
  if (!token) {
    return response.status(403).json({
      message: 'Нет доступа'
    })
  }

  try {
    const decoded = jwt.verify(token, 'secret123')
    
    request.body.userId = decoded._id
  } catch(error) {
    return response.status(403).json({
      message: 'Нет доступа'
    })
  }

  next()
}