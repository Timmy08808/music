import { readdirSync } from 'node:fs'
import axios from 'axios'
import Router from '@koa/router'

import { resolve } from '../utils/index.mjs'

const router = new Router()

router.get('/', async ctx => {
    ctx.body = 'hello word !'
})

router.get('/api/music/list', async ctx => {
    const { type } = ctx.query
    const dirs = {
        0: 'music',
        1: 'tiktok'
    }
    const dir = dir[type] ?? dir[0]
    const names = readdirSync(resolve(`public/${dir}`))
    const data = names.filter(k => /\.mp3/.test(k)).map(name => ({ name: name.replace(/\.mp3/, ''), url: `/${dir}/${name}` }))
    ctx.return({ data })
})

// https://www.bilibili.com/read/cv15587325/ // 免费网易云api
const baseUrl = 'http://music.cyrilstudio.top'
router.get('/api/threelist', async ctx => {
    const { keywords } = ctx.query
    const { data: { result } } = await axios.get(`${baseUrl}/search?keywords=${keywords}`)
    ctx.return({ data: result })
})

router.get('/api/threedetail', async ctx => {
    const { id } = ctx.query
    const { data: { data } } = await axios.get(`${baseUrl}/song/url?id=${id}`)
    ctx.return({ data })
})

export default router