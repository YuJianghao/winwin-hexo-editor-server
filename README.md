# @winwin/hexo-editor-server

A koa2 middleware provides hexo editing API.

<img src="https://img.shields.io/npm/v/@winwin/hexo-editor-server?style=flat-square">

If you have your own server, and using HEXO for blogging, and looking for an editor that can use anywhere anytime, and ... Bingo! You found it !

I write this project because almost every markdown editor I tried is not convenient enought when writting blog with HEXO. I always have to add tags categories and front-matters mannuly, and run script to generate and deloy(even though it is convenient enough for most people). So I write this one to edit HEXO post in a convenient way by just click click and click.

I also have a SPA hexo-editor-client based on Vue and Quasar.( I promise I'm working on it !❤). see [@winin/hexo-editor-client](https://github.com/YuJianghao/winwin-hexo-editor-client), [@winin/hexo-editor-sdk](https://github.com/YuJianghao/winwin-hexo-editor-sdk) and [Hand by hand installation guide](http://blog.yujianghao.cn/2020/03/16/rv13LtBZuoRgOPWy/)

API doc is comming soon... You can find it in `./src/controller.js`.

## Feature

- [x] Post add/delete/update/puiblish/unpublish
- [x] Support for categories
- [x] Support for tags
- [x] Support for front-matters
- [x] Support for git push/reset/pull
- [x] Support for hexo generate/deploy/clean
- [x] Custom authentication
- [ ] let me know what you need ...

## Installation

[Hand to hand tutorial here](http://blog.yujianghao.cn/2020/03/16/rv13LtBZuoRgOPWy/)

```bash
npm install --save @winwin/hexo-editor-server
```

Or other package manager, such as `yarn`.

## Usage

### Core

- Set `process.env.HEXO_ROOT` to your hexo blog folder, i.e. the same folder as your hexo `_config.yml` file.
- Inside your koa app file, mount hexo-editor-server to app.

```js
// app.js
// mount hexo-editor-server to koa app
hexoeditorserver(app, { base: '/hexo' , auth: /* some authentication middleware */ })

```

- See `./example/app.js` and [document](https://yujianghao.github.io/winwin-hexo-editor-server/module-hexo-editor-serever.html) for more infomation.

### Hexo-cli and Git

- If you want to deploy blog, you need to config your `hexo deploy` and `hexo generate` command. see [HEXO's doc](https://hexo.io/docs/one-command-deployment.html)
- If you want to use Git for backup, you need to config Git repository with a remote origin.

## Options

- `base`: the root url your hexo-editor-server will be runing at. Defulat to `/hexo/`.
- `auth`: a custom authentication koa middleware. Default to `undefined`.

## Notice

This project is on early devleopmemt stage and has a priority on personal use, so **API may changes everyday you wake up 😜!**

## Contribute

All kinds of PR are welcomed, including crazy change!
