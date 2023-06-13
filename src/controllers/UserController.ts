import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator'
import bctypt from 'bcrypt'
import UserModel from '../models/User'

export const register = async (request: Request, response: Response) => {
  try {
    const password = request.body.password
    const salt = await bctypt.genSalt(10)
    const passwordHash = await bctypt.hash(password, salt)

    const doc = new UserModel({
      email: request.body.email,
      passwordHash,
      firstName: request.body.firstName,
      avatarUrl: request.body.avatarUrl,
    })

    const user = await doc.save()

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d'
      }
    )
    
    response.json({
      id: user._doc._id,
      email: user._doc.email,
      firstName: user._doc.firstName,
      avatarUrl: user._doc.avatarUrl,
      token
    })
  } catch (error) {
    console.log(error)
    response.status(500).json({
      message: 'Не удалось зарегистрироваться'
    })
  }
}

export const login = async (request: Request, response: Response) => {
  try {
		const user = await UserModel.findOne({email: request.body.email})

		if (!user) {
			return response.status(404).json({
				message: 'Пользователь не найден'
			})
		}

		const isValidPassword = await bctypt.compare(request.body.password, user._doc.passwordHash)

		if (!isValidPassword) {
			return response.status(400).json({
				message: 'Неверный логин или пароль'
			})
		}

		const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d'
      }
    )

		response.json({
      id: user._doc._id,
      email: user._doc.email,
      firstName: user._doc.firstName,
      avatarUrl: user._doc.avatarUrl,
      token
    })
  } catch (error) {
    console.log(error)
    response.status(500).json({
      message: 'Не удалось авторизоваться'
    })
  }
}

export const me = async (request: Request, response: Response) => {
	try {
		const user = await UserModel.findById(request.body.userId)

		if (!user) {
			return response.status(404).json({
				message: 'Пользватель не найден'
			})
		}

		response.json({
      id: user._doc._id,
      email: user._doc.email,
      firstName: user._doc.firstName,
      avatarUrl: user._doc.avatarUrl
    })
	} catch (error) {
    console.log(error)
    response.status(500).json({
      message: 'Не удалось получить информацию о пользователе'
    })
  }
}