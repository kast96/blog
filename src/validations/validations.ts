import { body } from 'express-validator'

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Слишком короткий пароль').isLength({min: 5}),
  body('firstName', 'Укажите имя').isLength({min: 3}),
  body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL()
]

export const loginValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Слишком короткий пароль').isLength({min: 5})
]

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
  body('text', 'Введите текст статьи').isLength({min: 10}).isString(),
  body('tags', 'Неверный формат тэгов').optional().isString(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString()
]