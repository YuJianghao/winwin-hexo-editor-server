const HexoAPI = require('hexo')
const path = require('path')
const fs = require('hexo-fs')
const Git = require('simple-git/promise')
const { exec } = require('child_process')
const Post = require('./post')
const debug = require('debug')('hexo')
/**
 * 用于和hexo交互的模型
 * @class
 */
class Hexo {
  /**
   * 初始化
   * @param {String} [cwd=process.cwd()] - 工作路径
   */
  constructor (cwd = process.cwd()) {
    this.cwd = cwd
    this.hexo = new HexoAPI(cwd, { debug: false, draft: true })
    this.git = new Git(this.cwd)
    this.ready = false
    if (process.env.NODE_ENV !== 'test') { this._init() }
  }

  /**
   * 初始化并开始监听文件
   * @private
   */
  async _init () {
    debug('starting ...')

    // 初始化hexo
    await this.hexo.init()

    // 监听事件
    this.hexo.on('new', post => {
      debug('new file', post.path)
    })

    // 载入数据
    await this.load()

    // Ready to go!
    this.ready = true
    debug('ready')
  }

  /**
   * 检测hexo是否完成初始化
   * @private
   */
  _checkReady () {
    if (!this.ready) {
      const err = new Error('Hexo initiating, try again later')
      err.name = 'Hexo Init'
      throw err
    }
  }

  /**
   * 从磁盘载入数据
   * @private
   */
  async load () {
    debug('load data')
    await this.hexo.load()
  }

  /**
   * 保存文章到磁盘
   * @param {Post[]} posts - 需要更新的文章
   * @returns {_Document[]} - 更新后的文章文档
   * @private
   */
  async _save (posts) {
    const pathes = []
    var file = null
    await Promise.all(posts.map(async post => {
      debug('save', post._id)
      const src = await this._get(post._id)
      // 删除源文件
      fs.unlinkSync(src.full_source)
      if (!post.published)post.layout = 'draft'
      // 创建新文件
      delete post._id
      delete post.raw
      delete post.published
      file = await this.hexo.post.create(post)
      pathes.push(file.path)
    }))
    // 更新数据
    await this.load()
    // 查询新数据
    return this.hexo.locals.get('posts').toArray()
      .filter(item => pathes.includes(item.full_source))
      .map(doc => new Post(doc))
  }

  /**
   * 从磁盘和数据库删除文章
   * @param {String[]} ids - 需要删除的文章id列表
   * @returns {Post[]} - 已删除的文章列表
   */
  async _remove (ids) {
    var posts = []
    var post = null
    await Promise.all(ids.map(async id => {
      debug('remove', id)
      post = await this._get(id)
      // 删除文件
      fs.unlinkSync(post.full_source)
      // 清除数据
      await this.load()
      posts.push(new Post(post))
    }))
    return posts
  }

  /**
   * 新建一篇文章
   * @param {Post} post - 用于新建的文章
   * @param {Number} [addon=0] - slug的后缀，如果不为零则添加此数字为后缀
   * @returns {Post} - 新建的文章
   * @private
   */
  async _add (post, addon = 0) {
    debug('_add with slug', post.slug, Object.keys(post))
    // 存在slug就查询slug是否被占用
    if (post.slug && this.hexo.locals.get('posts').find({ slug: post.slug }).length) {
      // 如果被占用
      if (addon) {
        // 清除后缀
        post.slug = post.slug.slice(0, addon.toString().length)
      }
      // 添加后缀  slug1
      post.slug += (addon + 1)
      return this._add(post, addon + 1)
    }
    // 创建文件
    const file = await this.hexo.post.create(post)
    // 更新数据
    await this.load()
    // 读取文件
    return new Post(this.hexo.locals.get('posts')
      .findOne({ full_source: file.path }))
  }

  /**
   * 更新文章并存储
   * @param {Post} post - 需要更新的文章及其参数
   * @param {String} post._id - 文章id
   * @returns {Post} - 更新过的文章
   * @private
   */
  async _update (post) {
    debug('update', post._id, Object.keys(post))
    var src = await this._get(post._id)
    if (!src) return null
    src = new Post(src)
    src.update(post)
    var posts = await this._save([src])
    if (posts.length === 0) throw new Error('post not found !')
    if (posts.length > 1) throw new Error('multiple posts found')
    return posts[0]
  }

  /**
   * 从_id读取数据库文章
   * @param {String} _id - 文章id
   * @returns {_Document} - 文章文档
   * @private
   */
  async _get (_id) {
    const query = this.hexo.locals.get('posts').findOne({ _id })
    if (!query) debug('not found', _id)
    return query
  }

  /**
   * 获取文章列表
   * @returns {Post[]} - 文章列表
   * @public
   */
  async listPosts () {
    this._checkReady()
    console.log('list posts')
    return this.hexo.locals.get('posts')
      .map(doc => new Post(doc))
  }

  /**
   * 获取标签列表
   * @returns {Object[]} - 标签对象列表
   * @public
   */
  async listTags () {
    this._checkReady()
    const tags = this.hexo.locals.get('tags')
      .toArray()
      .map(item => {
        return this._formatTag(item)
      })
    debug('list tag', tags.length)
    return tags
  }

  /**
   * 获取分类列表
   * @returns {Object[]} - 分类列表
   * @public
   */
  async listCategories () {
    this._checkReady()
    const categories = this.hexo.locals.get('categories')
      .toArray()
      .map(item => {
        return this._formatCategorie(item)
      })
    debug('list categories', categories.length)
    return categories
  }

  /**
   * 获取单篇文章
   * @param {String} _id - 文章id
   * @returns {Post|null} - 文章对象，如果没有则为`null`
   * @public
   */
  async getPost (_id) {
    this._checkReady()
    console.log('get post', _id)
    if (!_id) throw new Error('_id should be String!')
    const query = await this._get(_id)
    return query ? new Post(query) : null
  }

  /**
   * 新建一篇文章
   * @param {Object} options - 新建参数
   * @param {String} options.title - 文章名
   * @param {String} [options.slug] - 网址，参见[hexo API]{@link https://hexo.io/zh-cn/api/posts}
   * @returns {Post} - 新建的文章
   * @public
   */
  async addPost (options) {
    this._checkReady()
    console.log('add post')
    if (!options.title) throw new Error('post.title is required!')
    debug('add post', Object.keys(options))
    var post = new Post(options, false)
    // 新文章不能指定`_id`
    delete post._id
    // post.published是计算出来的，不是指定的
    delete post.published
    logger.log(post)
    post = await this._add(post)
    console.log('added post', post._id)
    return post
  }

  /**
   * 更新一篇文章
   * @param {Object} options - 更新参数
   * @param {String} options._id - 文章id
   * @returns {Post} - 更新过的文章
   * @public
   */
  async updatePost (options) {
    this._checkReady()
    if (!options._id) throw new Error('options._id is required!')
    console.log('update post', options._id)
    return this._update(new Post(options, false))
  }

  /**
   * 删除一篇文章
   * @param {String} _id - 文章id
   * @returns {Post} - 被删除的文章
   */
  async deletePost (_id, hard = false) {
    this._checkReady()
    if (!_id) throw new Error('_id is required!')
    console.log('delete post', _id)
    if (hard) {
      var posts = await this._remove([_id])
      if (posts.length === 0) throw new Error('post not found !')
      if (posts.length > 1) throw new Error('multiple posts found')
      return posts[0]
    }
    const post = await this._get(_id)
    await this._moveFile('_discarded', post)
    await this.hexo.load()
    return new Post(post)
  }

  /**
   * 发布文章
   * @param {String} _id - 文章id
   * @returns {Post} - 发布后的文章，**注意，id会改变！**
   * @public
   */
  async publishPost (_id) {
    this._checkReady()
    if (!_id) throw new Error('_id is required!')
    console.log('publish post', _id)
    var doc = await this._get(_id)
    try {
      await this.hexo.post.publish({ slug: doc.slug }, true)
    } catch (err) {
      err.name = 'Not Found'
      throw err
    }
    await this.hexo.load()
    const post = this.hexo.locals.get('posts')
      .findOne({ slug: doc.slug })
    if (!post) throw new Error('post not found !')
    return new Post(post)
  }

  /**
  * 取消发布文章
  * @param {String} _id - 文章id
  * @returns {Post} - 取消发布后的文章，**注意，id会改变！**
  * @public
  */
  async unpublishPost (_id) {
    this._checkReady()
    if (!_id) throw new Error('_id is required!')
    console.log('unpublish post', _id)
    var doc = await this._get(_id)
    var post = new Post(doc)
    post.published = false
    return this._update(post)
  }

  /**
   * 将hexo数据库中categories处理为可以序列化为json的对象
   * @param {Query} category - 分类
   * @returns {Object} - 可以转化为JSON的对象
   * @private
   */
  _formatCategorie (category) {
    category = category.toObject()
    var posts = category.posts.toArray()
    category.posts = posts.map(post => post._id)
    return category
  }

  /**
   * 将hexo数据库中tags处理为可以序列化为json的对象
   * @param {_Document} tag - 标签文档
   * @returns {Object} - 可以转化为JSON的对象
   * @private
   */
  _formatTag (tag) {
    tag = tag.toObject()
    var posts = tag.posts.toArray()
    tag.posts = posts.map(post => post._id)
    return tag
  }

  /**
   * 移动文章源文件
   * @param {String} to
   * @param {String} from
   * @param {String} folder source/_xxx
   * @param {String} data post.raw
   */
  async _moveFile (dest, post) {
    debug(`move file from ${post.source} to ${dest}/`)
    const src = post.full_source
    const des = post.full_source.replace(post.source.split(path.sep)[0], dest)
    const folder = path.join(this.hexo.source_dir, dest)

    if (!fs.exists(folder)) {
      fs.mkdir(folder)
    }
    fs.writeFile(des, post.raw)
    fs.unlinkSync(src)
  }

  /**
   * 部署网站
   */
  async deploy () {
    this._checkReady()
    debug('deploy')
    return this._runShell('hexo clean;hexo generate -d')
  }

  /**
   * 清理hexo数据
   */
  async clean () {
    this._checkReady()
    debug('clean')
    return this._runShell('hexo clean')
  }

  /**
   * 运行控制台程序
   * @param {String} cmd 命令
   */
  async _runShell (cmd) {
    return new Promise((resolve, reject) => {
      const workProcess = exec(cmd, {
        cwd: this.cwd,
        maxBuffer: 5000 * 1024 // 默认 200 * 1024
      })
      // 打印正常的后台可执行程序输出
      workProcess.stdout.on('data', function (data) {
        console.log(data)
      })

      // 打印错误的后台可执行程序输出
      workProcess.stderr.on('data', function (data) {
        console.log(data)
      })

      // 退出之后的输出
      workProcess.on('close', function (code, signal) {
        if (code === 0) {
          resolve(0)
        } else {
          reject(code, signal)
        }
      })
    })
  }

  /**
   * 从GIT同步
   */
  async syncGit () {
    debug('sync git')
    await this.git.pull()
    return Promise.resolve()
  }

  /**
   * 重置本地文件
   */
  async resetGit () {
    debug('reset git')
    await this.git.reset('hard')
    return Promise.resolve()
  }

  /**
   * 保存到git
   */
  async saveGit () {
    debug('save git')
    await this.git.add('./*')
    await this.git.commit('server update posts: ' + (new Date()).toString(), () => {})
    await this.git.push()
    return Promise.resolve()
  }
}

module.exports = Hexo
