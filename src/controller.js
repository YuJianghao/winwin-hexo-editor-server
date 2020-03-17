const Hexo = require('./hexo')
const hexo = new Hexo(process.env.HEXO_ROOT)
const Joi = require('@hapi/joi')

exports.hexo = hexo

exports.v = {
  addPost: {
    body: {
      title: Joi.string().required(),
      slug: Joi.string()
    }
  }
}

exports.hexoInitErrorHandler = async function (ctx, next) {
  try {
    await next()
  } catch (err) {
    if (err.name === 'Hexo Init') {
      err.status = 503
    }
    throw err
  }
}

exports.postNotFoundErrorHandler = async function (ctx, next) {
  try {
    await next()
  } catch (err) {
    if (err.name === 'Not Found') {
      err.status = 404
    }
    throw err
  }
}

exports.reload = async function (ctx, next) {
  await hexo.load()
  ctx.body = {
    success: true
  }
}

exports.addPost = async function (ctx, next) {
  try {
    const post = await hexo.addPost(ctx.request.body)
    ctx.body = {
      success: true,
      data: {
        post: post
      }
    }
  } catch (err) {
    console.error(err)
    ctx.body = {
      success: false,
      message: err.message
    }
  }
}

exports.getPosts = async function (ctx, next) {
  const posts = await hexo.listPosts()
  ctx.body = {
    success: true,
    data: {
      posts: posts
    }
  }
}

exports.getPost = async function (ctx, next) {
  const post = await hexo.getPost(ctx.params.id)
  if (post === null) {
    const err = new Error('Post not found')
    err.name = 'Not Found'
    throw err
  }
  ctx.body = {
    success: true,
    data: {
      post: post
    }
  }
}

exports.updatePost = async function (ctx, next) {
  const post = await hexo.updatePost({ _id: ctx.params.id, ...ctx.request.body })
  ctx.body = {
    success: true,
    data: {
      post: post
    }
  }
}

exports.removePost = async function (ctx, next) {
  const post = await hexo.deletePost(ctx.params.id)
  ctx.body = {
    success: true,
    data: {
      post: post
    }
  }
}

exports.publishPost = async function (ctx, next) {
  const post = await hexo.publishPost(ctx.params.id)
  ctx.body = {
    success: true,
    data: {
      post: post
    }
  }
}

exports.unpublishPost = async function (ctx, next) {
  const post = await hexo.unpublishPost(ctx.params.id)
  ctx.body = {
    success: true,
    data: {
      post: post
    }
  }
}

exports.getTags = async function (ctx, next) {
  const tags = await hexo.listTags()
  ctx.body = {
    success: true,
    data: {
      tags: tags
    }
  }
}

exports.getCategories = async function (ctx, next) {
  const categories = await hexo.listCategories()
  ctx.body = {
    success: true,
    data: {
      categories: categories
    }
  }
}

exports.sync = async function (ctx, next) {
  await hexo.syncGit()
  ctx.body = {
    success: true
  }
}

exports.reset = async function (ctx, next) {
  await hexo.resetGit()
  ctx.body = {
    success: true
  }
}

exports.save = async function (ctx, next) {
  await hexo.saveGit()
  ctx.body = {
    success: true
  }
}

exports.deploy = async function (ctx, next) {
  await hexo.deploy()
  ctx.body = {
    success: true
  }
}

exports.clean = async function (ctx, next) {
  await hexo.clean()
  ctx.body = {
    success: true
  }
}
