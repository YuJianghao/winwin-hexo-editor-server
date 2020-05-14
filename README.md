# @winwin/hexo-editor-server

A koa2 middleware provides @winwin/hexo-editor editing API. [Please visit @winwin/hexo-editor homePage](https://yujianghao.github.io/winwin-hexo-editor/)

<img src="https://img.shields.io/npm/v/@winwin/hexo-editor-server?style=flat-square">

If you have your own server, and using HEXO for blogging, and looking for an editor that can use online anywhere anytime, and ... Bingo! You found it !

I write this project because almost every markdown editor I tried is not convenient enought when writting blog with HEXO. I always have to add tags categories and front-matters mannuly, and run script to generate and deloy(even though it is convenient enough for most people). So I write this one to edit HEXO post in a convenient way by just click click and click.

The is a part of  [@winin/hexo-editor](https://github.com/YuJianghao/winwin-hexo-editor). See [@winin/hexo-editor-client](https://github.com/YuJianghao/winwin-hexo-editor-client), [@winin/hexo-editor-sdk](https://github.com/YuJianghao/winwin-hexo-editor-sdk) and [Hand by hand installation guide](http://blog.yujianghao.cn/2020/03/16/rv13LtBZuoRgOPWy/) too !

API doc is comming soon... You can find it in `./src/controller.js`.

## Feature

- [x] Post add/delete/update
- [x] Post puiblish/unpublish/drafts
- [x] categories
- [x] tags
- [x] front-matters
- [x] git push/reset/pull
- [x] hexo generate/deploy/clean
- [x] Custom authentication
- [ ] ~~Image CDN~~(use [picgo](https://picgo.github.io/PicGo-Doc/zh/guide/) instead)
- [ ] let me know what you need ...

## Installation

```bash
npm install --save @winwin/hexo-editor-server
```

Or other package manager, such as `yarn`.

## Usage

### Core

- Inside your koa app file, mount hexo-editor-server to app.
- Set `opts.hexoRoot` to your hexo blog folder, i.e. the same folder as your hexo `_config.yml` file.

```js
// app.js
// mount hexo-editor-server to koa app
hexoeditorserver(app, {
    base: '/hexo',
    /* auth: */ /* some authentication middleware */ 
    hexoRoot: 'your/blog/path' 
})

```

- See `./example/app.js`, [document](https://yujianghao.github.io/winwin-hexo-editor-server/module-hexo-editor-serever.html) and [@winin/hexo-editor](https://github.com/YuJianghao/winwin-hexo-editor) for more usage and examples.

### Hexo-cli and Git

- If you want to deploy blog, you need to config your `hexo deploy` and `hexo generate` command. see [HEXO's doc](https://hexo.io/docs/one-command-deployment.html)
- If you want to use Git for backup, you need to config Git repository with a remote origin(`git push` and `git pull`).

## Options

- `hexoRoot`: your hexo blog folder, i.e. the same folder as your hexo `_config.yml` file. Required.
- `base`: the root url your hexo-editor-server will be runing at. Defulat to `/hexo/`.
- `auth`: a custom authentication koa middleware. Default to `undefined`.

## Notice

This project is on early devleopmemt stage, **API may changes everyday you wake up 😜!** I will do my best to keep it working at anytime. If not, please send an issue [here](https://github.com/YuJianghao/winwin-hexo-editor-server/issues).

## Contribute

All kinds of PR are welcomed, including crazy change!

## Acknowledgement

[hexo-client](https://github.com/gaoyoubo/hexo-client) by [gaoyoubo](https://github.com/gaoyoubo), [homepage](https://www.mspring.org/tags/HexoClient/)

[hexo-admin](https://github.com/jaredly/hexo-admin) by [jaredly](https://github.com/jaredly), [homepage](https://jaredforsyth.com/hexo-admin/)

I learnt a lot about hexo usage from them!

[Qusar Login Form Card Component](https://gist.github.com/justinatack/39ec7f37064b2e9fa61fbd450cba3826) by [justinatack](https://gist.github.com/justinatack/)

## Release Note

### v0.1.8

- fix a auth bug