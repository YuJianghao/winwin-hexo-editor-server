# @winwin/hexo-editor-server

A koa2 middleware provides hexo eidting API.

If you have your own server, and using HEXO for blogging, and looking for an editor that can use anythere anytime, and ... Bingo! You found it ! I write this project because almost every markdown editor I tried is not convenient enought when I'm writting blog with HEXO. I always has to add tags categories and front-matters mannuly, and run script to generate and deloy my blog(even though it is convenient enough for most people). So I write this one to edit HEXO post in a convenient way by just click click and click.

I also have a SPA hexo-editor-client based on Vue and Quasar.( I promise I'm working on it !❤).

API doc is comming soon... You can find it in `./src/controller.js`.

## Installation

```bash
npm install --save @winin/hexo-editor-server
```

Or other package manager, such as `yarn`.

## Usage

- Set `process.env.HEXO_ROOT` to your hexo blog folde, i.e. the same folder as your hexo `_config.yml` file.
- Inside your koa app file, mount hexo-editor-server to you app.

```js
// app.js
// mount hexo-editor-server to koa app
hexoeditorserver(app, { base: '/hexo' , auth: /* some authentication middleware */ })

```

- See `./example/app.js` and `./doc/index.html` for more infomation.

## Options

- `base`: the root url your hexo-editor-server will be runing at. Defulat to `/hexo/`.
- `auth`: a custom authentication koa middleware. Default to `undefined`.

## Notice

This project is on early devleopmemt stage and has a priority on personal use, so **API may changes everyday you wake up 😜!**

## Contribute

All kinds of PR are welcomed, including crazy change!
