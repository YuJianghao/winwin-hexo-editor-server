const hfm = require('hexo-front-matter')
/**
 * 用于存储不包含hexo默认值的文章信息
 * @class
 */
class Post {
  /**
   * @param {_Document} [post] - hexo数据库中的post文档
   * @param {fromDB} [fromDB=true] - 是否是从数据库载入
   */
  constructor (post, fromDB = true) {
    if (!post) return
    if (fromDB) {
    // 设置必须属性
      Array.from(['_id', 'slug', 'raw', 'layout', 'published'])
        .map(key => {
          if (post[key] !== undefined) { this[key] = post[key] }
        })
      // 混合hexo-front-matters属性
      if (this.raw) { Object.assign(this, hfm.parse(this.raw)) }
      // 转换日期为数字
      Array.from(['date', 'updated']).map(time => {
        if (this[time]) {
          this[time] = this[time].valueOf()
        }
      })
    } else {
      Object.keys(post).map(key => {
        if (post[key]) { this[key] = post[key] }
      })
    }
  }

  /**
   * 从对象更新数据
   * @param {Object} obj - 需要更新的属性对象，`_id`属性将被忽略
   * @returns {Post} - 更新后的文章
   */
  update (obj) {
    Object.keys(obj).map(key => {
      if (key === '_id') return
      this[key] = obj[key]
    })
    return this
  }
}

module.exports = Post
