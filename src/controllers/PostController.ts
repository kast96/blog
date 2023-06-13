import { Request, Response } from 'express'
import PostModel from '../models/Post'

export const getAll = async (request: Request, response: Response) => {
  try {
    const posts = await PostModel.find().populate('user').exec()

    response.json(posts)
  } catch (error) {
    console.log(error)
    response.status(500).json({
      message: 'Не удалось получить статьи'
    })
  }
}

export const getOne = async (request: Request, response: Response) => {
  try {
    const postId = request.params.id
    const posts = await PostModel.findOneAndUpdate({
      _id: postId
    },
    {
      $inc: {viewsCount: 1}
    },
    {
      returnDocument: 'after'
    }).populate('user')

    if (!posts) {
      return response.status(404).json({
        message: 'Статья не найдена'
      })
    }

    response.json(posts)
  } catch (error) {
    console.log(error)
    response.status(500).json({
      message: 'Не удалось получить статью'
    })
  }
}

export const create = async (request: Request, response: Response) => {
  try {
    const doc = new PostModel({
      title: request.body.title,
      text: request.body.text,
      imageUrl: request.body.imageUrl,
      tags: request.body.tags.split(',').map(tag => tag.trim()),
      user: request.body.userId,
    })

    const post = await doc.save()

    response.json(post)
  } catch (error) {
    console.log(error)
    response.status(500).json({
      message: 'Не удалось создать статью'
    })
  }
}

export const remove = async (request: Request, response: Response) => {
  try {
    const postId = request.params.id
    const posts = await PostModel.findOneAndDelete({
      _id: postId
    })

    if (!posts) {
      return response.status(500).json({
        message: 'Не удалось удалить статью'
      })
    }

    response.json({
      success: true
    })
  } catch (error) {
    console.log(error)
    response.status(500).json({
      message: 'Не удалось удалить статью'
    })
  }
}

export const update = async (request: Request, response: Response) => {
  try {
    const postId = request.params.id
    const posts = await PostModel.findOneAndUpdate({
      _id: postId
    },
    {
      title: request.body.title,
      text: request.body.text,
      imageUrl: request.body.imageUrl,
      tags: request.body.tags.split(',').map(tag => tag.trim()),
      userId: request.body.userId,
    })

    if (!posts) {
      return response.status(500).json({
        message: 'Не удалось изменить статью'
      })
    }

    response.json(posts)
  } catch (error) {
    console.log(error)
    response.status(500).json({
      message: 'Не удалось изменить статью'
    })
  }
}

export const getLastTags = async (request: Request, response: Response) => {
  try {
    const posts = await PostModel.find().limit(5).exec()

    const tags = posts.map(obj => obj.tags).flat().slice(0, 5)

    var uniqueTags = tags.filter((value, index, array) => array.indexOf(value) === index);

    response.json(uniqueTags)
  } catch (error) {
    console.log(error)
    response.status(500).json({
      message: 'Не удалось получить статьи'
    })
  }
}
