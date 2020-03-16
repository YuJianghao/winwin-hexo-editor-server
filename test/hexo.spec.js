/* eslint-disable no-undef */
const Hexo = require('../src/hexo')
describe('check existence of hexo blog', () => {
  test('not a npm folder', async () => {
    var err = null
    try {
      const hexo = new Hexo('/')
      err = await hexo._init()
    } catch (e) {
      err = e
    } finally {
      expect(err.message).toMatch('isn\'t a hexo blog folder!')
    }
  })
  test('not a hexo blog folder', async () => {
    var err = null
    try {
      const hexo = new Hexo('./')
      err = await hexo._init()
    } catch (e) {
      err = e
    } finally {
      expect(err.message).toMatch('isn\'t a hexo blog folder!')
    }
  })
})

describe('check is git repository', () => {
  test('/', () => {
    const hexo = new Hexo('/')
    expect(hexo.isGit).toBe(false)
  })
  test('./', () => {
    const hexo = new Hexo('./')
    expect(hexo.isGit).toBe(true)
  })
})
