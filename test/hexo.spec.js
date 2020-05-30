/* eslint-disable no-undef */
const Hexo = require('../src/hexo')
describe('check existence of hexo blog', () => {
  test('not a hexo blog folder', async () => {
    var err = null
    try {
      const hexo = new Hexo()
      err = await hexo.init('/')
    } catch (e) {
      err = e
    } finally {
      expect(err.message).toMatch('isn\'t a hexo blog folder!')
    }
  })
})
